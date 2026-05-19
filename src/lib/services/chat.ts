import type { Models } from "appwrite";
import {
  Channel,
  Query,
  realtime,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { commerceGatewayService } from "@/lib/services/commerceGateway";
import { profileService } from "@/lib/services/profile";
import { storeService } from "@/lib/services/store";
import type {
  ChatContact,
  ChatMessage,
  ChatMessageRow,
  ConversationRow,
} from "@/types";

// Mendefinisikan Table ID untuk grup percakapan (Conversations)
const conversationsTableId = appwriteConfig.tables.conversations;

// Mendefinisikan Table ID untuk detail pesan obrolan (Chat Messages)
const chatMessagesTableId = appwriteConfig.tables.chatMessages;

// Representasi tipe data baris database percakapan
type ConversationRecord = Models.Row & ConversationRow;

// Representasi tipe data baris database detail pesan obrolan
type ChatMessageRecord = Models.Row & ChatMessageRow;

/** 
 * Normalisasi objek error menjadi pesan kesalahan teks.
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses percakapan.";

/**
 * Memformat string tanggal/waktu ISO menjadi format jam lokal menit (HH:MM).
 * @param value String waktu ISO
 */
const formatChatTime = (value?: string | null) => {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Mengubah baris data mentah `ChatMessageRecord` dari Appwrite menjadi bentuk
 * antarmuka `ChatMessage` yang bisa dirender di komponen UI dengan properti tambahan 
 * `sender` (pengirim) berdasarkan ID user saat ini.
 * 
 * @param row Baris data pesan mentah dari database
 * @param currentUserId ID pengguna aktif saat ini
 */
const toChatMessage = (
  row: ChatMessageRecord,
  currentUserId: string
): ChatMessage => ({
  id: row.$id,
  text: row.message_text,
  sender: row.sender_user_id === currentUserId ? "me" : "other", // Tentukan label pengirim demi visual balon chat
  time: formatChatTime(row.$createdAt),
  createdAt: row.$createdAt,
  isRead: row.is_read,
  senderUserId: row.sender_user_id,
  receiverUserId: row.receiver_user_id,
});

/**
 * Menghitung jumlah pesan yang belum dibaca (unread count) di dalam suatu percakapan,
 * khusus untuk pengguna yang sedang aktif (sebagai penerima).
 * 
 * @param conversationId - ID percakapan/room
 * @param userId - ID penerima pesan
 */
const getConversationUnreadCount = async (
  conversationId: string,
  userId: string
) => {
  // Ambil daftar pesan di database dengan filter conversation_id dan penerima = userId serta belum dibaca (is_read = false)
  const result = await tablesDB.listRows<ChatMessageRecord>({
    databaseId: appwriteConfig.databaseId,
    tableId: chatMessagesTableId,
    queries: [
      Query.equal("conversation_id", [conversationId]),
      Query.equal("receiver_user_id", [userId]),
      Query.equal("is_read", [false]),
    ],
  });

  return result.total;
};

/**
 * Mengambil metadata kontak percakapan (nama dan avatar) secara dinamis.
 * Jika currentUserId adalah buyer, maka yang ditampilkan adalah nama Toko/Seller.
 * Jika currentUserId adalah seller, maka yang ditampilkan adalah profil Buyer.
 * 
 * @param conversation Rekaman baris data percakapan
 * @param currentUserId ID pengguna aktif
 */
const resolveConversationMeta = async (
  conversation: ConversationRecord,
  currentUserId: string
) => {
  const isBuyer = conversation.buyer_user_id === currentUserId;

  // Kasus A: Pengguna aktif bertindak sebagai pembeli (tampilkan detail toko penjual)
  if (isBuyer) {
    const store = await storeService.getStoreById(conversation.store_id);
    if (store) {
      return {
        name: store.name,
        avatar: store.logoUrl || store.bannerUrl || undefined,
      };
    }

    // Fallback: Ambil nama profil seller langsung jika detail toko tidak ditemukan
    const sellerProfile = await profileService.getProfile(conversation.seller_user_id);
    return {
      name: sellerProfile?.full_name || sellerProfile?.username || "Seller",
      avatar: sellerProfile?.avatar_url || undefined,
    };
  }

  // Kasus B: Pengguna aktif bertindak sebagai penjual (tampilkan profil pembeli)
  const buyerProfile = await profileService.getProfile(conversation.buyer_user_id);
  return {
    name: buyerProfile?.full_name || buyerProfile?.username || "Pembeli",
    avatar: buyerProfile?.avatar_url || undefined,
  };
};

/**
 * Kumpulan layanan untuk mengatur fitur percakapan (chat) antara buyer dan seller.
 * Mencakup pengambilan daftar pesan, pengiriman pesan, dan sinkronisasi real-time.
 */
export const chatService = {
  /**
   * Mencari percakapan (room) yang sudah ada antara satu buyer dan satu seller.
   */
  async findConversation(buyerUserId: string, sellerUserId: string) {
    try {
      // Cari baris percakapan yang dicocokkan dengan buyer dan seller terkait
      const result = await tablesDB.listRows<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        queries: [
          Query.equal("buyer_user_id", [buyerUserId]),
          Query.equal("seller_user_id", [sellerUserId]),
          Query.limit(1),
        ],
      });

      return result.rows[0] || null;
    } catch {
      return null;
    }
  },

  /**
   * Mendapatkan percakapan yang ada, atau membuat percakapan baru 
   * (menggunakan commerceGateway untuk memvalidasi akses) jika belum pernah ada interaksi.
   */
  async getOrCreateConversation(input: {
    buyerUserId: string;
    sellerUserId: string;
    storeId: string;
  }) {
    try {
      // Periksa apakah ruang obrolan sudah pernah dibuat sebelumnya
      const existing = await this.findConversation(
        input.buyerUserId,
        input.sellerUserId
      );
      if (existing) {
        return existing;
      }

      // Jika belum ada, panggil serverless function commerce-gateway untuk inisialisasi yang aman
      const { conversationId } = await commerceGatewayService.getOrCreateConversation({
        sellerUserId: input.sellerUserId,
        storeId: input.storeId,
      });

      // Muat dokumen percakapan terdaftar yang baru saja dibuat
      return await tablesDB.getRow<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        rowId: conversationId,
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil daftar kontak percakapan untuk ditampilkan di Inbox pesan pengguna.
   * Akan menarik data baik sebagai buyer maupun sebagai seller, diurutkan dari pesan terbaru.
   * 
   * @param userId ID pengguna aktif
   */
  async listConversations(userId: string) {
    try {
      // Ambil daftar percakapan di mana user bertindak sebagai pembeli ATAU penjual, diurutkan dari pesan teranyar
      const result = await tablesDB.listRows<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        queries: [
          Query.or([
            Query.equal("buyer_user_id", [userId]),
            Query.equal("seller_user_id", [userId]),
          ]),
          Query.orderDesc("last_message_at"),
        ],
      });

      // Muat metadata visual profil lawan chat serta unreadCount pesan secara paralel untuk setiap baris kontak
      const contacts = await Promise.all(
        result.rows.map(async (conversation) => {
          const [meta, unread] = await Promise.all([
            resolveConversationMeta(conversation, userId),
            getConversationUnreadCount(conversation.$id, userId),
          ]);

          return {
            id: conversation.$id,
            name: meta.name,
            avatar: meta.avatar,
            msg: conversation.last_message || "Mulai percakapan baru",
            time: formatChatTime(conversation.last_message_at),
            unread,
            sellerId: conversation.seller_user_id,
            buyerId: conversation.buyer_user_id,
            storeId: conversation.store_id,
          } satisfies ChatContact;
        })
      );

      return contacts;
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengambil isi detail dari satu ruang obrolan (room), beserta seluruh riwayat pesannya.
   * Akses akan ditolak (return null) jika user bukan buyer atau seller dari percakapan ini.
   * 
   * @param userId ID pengguna aktif
   * @param conversationId ID percakapan obrolan
   */
  async getConversationRoom(userId: string, conversationId: string) {
    try {
      // Ambil data percakapan utama
      const conversation = await tablesDB.getRow<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        rowId: conversationId,
      });

      // Validasi hak akses obrolan
      if (
        conversation.buyer_user_id !== userId &&
        conversation.seller_user_id !== userId
      ) {
        return null;
      }

      // Tarik daftar semua isi riwayat obrolan dan metadata profil secara paralel
      const [messagesResult, meta] = await Promise.all([
        tablesDB.listRows<ChatMessageRecord>({
          databaseId: appwriteConfig.databaseId,
          tableId: chatMessagesTableId,
          queries: [
            Query.equal("conversation_id", [conversationId]),
            Query.orderAsc("$createdAt"),
          ],
        }),
        resolveConversationMeta(conversation, userId),
      ]);

      return {
        id: conversation.$id,
        name: meta.name,
        avatar: meta.avatar,
        sellerUserId: conversation.seller_user_id,
        buyerUserId: conversation.buyer_user_id,
        storeId: conversation.store_id,
        messages: messagesResult.rows.map((message) =>
          toChatMessage(message, userId)
        ),
      };
    } catch {
      return null;
    }
  },

  /**
   * Menandai seluruh pesan yang belum dibaca dalam satu percakapan menjadi `is_read: true`.
   * Dan memperbarui waktu `last_read_at` di row percakapan.
   * 
   * @param userId ID pengguna penerima pesan
   * @param conversationId ID percakapan
   */
  async markConversationAsRead(userId: string, conversationId: string) {
    try {
      const room = await this.getConversationRoom(userId, conversationId);
      if (!room) return;

      // Filter pesan yang diterima oleh pengguna aktif dan status isRead masih false
      const unreadMessages = room.messages.filter(
        (message) => message.receiverUserId === userId && !message.isRead
      );

      // Tandai is_read true untuk setiap pesan tersebut secara paralel di database
      await Promise.all(
        unreadMessages.map((message) =>
          tablesDB.updateRow<ChatMessageRecord>({
            databaseId: appwriteConfig.databaseId,
            tableId: chatMessagesTableId,
            rowId: message.id,
            data: { is_read: true },
          })
        )
      );

      // Perbarui waktu pembacaan terakhir di database sesuai peran pengguna (buyer atau seller)
      const isBuyer = room.buyerUserId === userId;
      await tablesDB.updateRow<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        rowId: conversationId,
        data: isBuyer
          ? { buyer_last_read_at: new Date().toISOString() }
          : { seller_last_read_at: new Date().toISOString() },
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Mengirim pesan baru ke dalam percakapan tertentu.
   * Pesan ini akan diproses melalui gateway backend demi keamanan integritas chat.
   * 
   * @param userId ID pengirim pesan
   * @param conversationId ID percakapan target
   * @param text Teks isi pesan obrolan
   */
  async sendMessage(userId: string, conversationId: string, text: string) {
    try {
      // Panggil serverless gateway function untuk merekam pesan baru secara aman
      const { message } = await commerceGatewayService.sendMessage({
        conversationId,
        text,
      });

      const localTime = formatChatTime(
        message.createdAt || new Date().toISOString()
      );

      // Normalisasi flag balon pengirim chat (me / other)
      return message.senderUserId === userId
        ? { ...message, sender: "me" as const, time: localTime }
        : { ...message, sender: "other" as const, time: localTime };
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  /**
   * Berlangganan (subscribe) event realtime ke channel Appwrite untuk menerima pesan baru 
   * secara instan tanpa perlu refresh.
   * 
   * @param conversationId - ID percakapan yang dilanggan
   * @param onEvent - Callback yang dipanggil saat pesan baru masuk
   * @returns Fungsi unsubscribe (pembersih) saat komponen di-unmount
   */
  subscribeMessages(
    conversationId: string,
    onEvent: (message: ChatMessageRecord) => void
  ) {
    // Dapatkan target channel realtime khusus untuk perubahan di table chatMessages
    const channel = Channel.tablesdb(appwriteConfig.databaseId)
      .table(chatMessagesTableId)
      .row();

    // Lakukan pendaftaran langganan event realtime menggunakan engine realtime Appwrite
    const subscriptionPromise = realtime.subscribe(
      channel,
      (event) => {
        const payload = event.payload as Partial<ChatMessageRecord & { $id: string }>;
        // Pastikan event data masuk sesuai dengan ID percakapan aktif yang sedang dilanggan
        if (
          payload &&
          payload.conversation_id === conversationId &&
          typeof payload.$id === "string"
        ) {
          onEvent(payload as ChatMessageRecord);
        }
      },
      [Query.equal("conversation_id", [conversationId])]
    );

    // Kembalikan callback cleaner pembersih listener langganan (unsubscribe)
    return () => {
      void subscriptionPromise.then((subscription) => subscription.unsubscribe());
    };
  },
};
