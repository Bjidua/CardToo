import type { Models } from "appwrite";
import {
  ID,
  Permission,
  Query,
  Role,
  tablesDB,
} from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { notificationService } from "@/lib/services/notification";
import { profileService } from "@/lib/services/profile";
import { storeService } from "@/lib/services/store";
import type {
  ChatContact,
  ChatMessage,
  ChatMessageRow,
  ConversationRow,
} from "@/types";

const conversationsTableId = appwriteConfig.tables.conversations;
const chatMessagesTableId = appwriteConfig.tables.chatMessages;

type ConversationRecord = Models.Row & ConversationRow;
type ChatMessageRecord = Models.Row & ChatMessageRow;

const normalizeError = (error: unknown) =>
  error instanceof Error ? error.message : "Gagal memproses percakapan.";

const formatChatTime = (value?: string | null) => {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toChatMessage = (
  row: ChatMessageRecord,
  currentUserId: string
): ChatMessage => ({
  id: row.$id,
  text: row.message_text,
  sender: row.sender_user_id === currentUserId ? "me" : "other",
  time: formatChatTime(row.$createdAt),
  isRead: row.is_read,
  senderUserId: row.sender_user_id,
  receiverUserId: row.receiver_user_id,
});

const buildPermissions = (buyerUserId: string, sellerUserId: string) => [
  Permission.read(Role.user(buyerUserId)),
  Permission.update(Role.user(buyerUserId)),
  Permission.delete(Role.user(buyerUserId)),
  Permission.read(Role.user(sellerUserId)),
  Permission.update(Role.user(sellerUserId)),
  Permission.delete(Role.user(sellerUserId)),
];

const getConversationUnreadCount = async (
  conversationId: string,
  userId: string
) => {
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

const resolveConversationName = async (
  conversation: ConversationRecord,
  currentUserId: string
) => {
  const isBuyer = conversation.buyer_user_id === currentUserId;

  if (isBuyer) {
    const store = await storeService.getStoreById(conversation.store_id);
    if (store) return store.name;

    const sellerProfile = await profileService.getProfile(conversation.seller_user_id);
    return sellerProfile?.full_name || sellerProfile?.username || "Seller";
  }

  const buyerProfile = await profileService.getProfile(conversation.buyer_user_id);
  return buyerProfile?.full_name || buyerProfile?.username || "Pembeli";
};

export const chatService = {
  async findConversation(buyerUserId: string, sellerUserId: string) {
    try {
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

  async getOrCreateConversation(input: {
    buyerUserId: string;
    sellerUserId: string;
    storeId: string;
  }) {
    try {
      const existing = await this.findConversation(
        input.buyerUserId,
        input.sellerUserId
      );
      if (existing) {
        return existing;
      }

      const now = new Date().toISOString();
      return await tablesDB.createRow<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        rowId: ID.unique(),
        data: {
          buyer_user_id: input.buyerUserId,
          seller_user_id: input.sellerUserId,
          store_id: input.storeId,
          last_message: null,
          last_message_at: now,
          last_sender_id: null,
          buyer_last_read_at: now,
          seller_last_read_at: null,
        },
        permissions: buildPermissions(input.buyerUserId, input.sellerUserId),
      });
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  async listConversations(userId: string) {
    try {
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

      const contacts = await Promise.all(
        result.rows.map(async (conversation) => {
          const [name, unread] = await Promise.all([
            resolveConversationName(conversation, userId),
            getConversationUnreadCount(conversation.$id, userId),
          ]);

          return {
            id: conversation.$id,
            name,
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

  async getConversationRoom(userId: string, conversationId: string) {
    try {
      const conversation = await tablesDB.getRow<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        rowId: conversationId,
      });

      if (
        conversation.buyer_user_id !== userId &&
        conversation.seller_user_id !== userId
      ) {
        return null;
      }

      const [messagesResult, name] = await Promise.all([
        tablesDB.listRows<ChatMessageRecord>({
          databaseId: appwriteConfig.databaseId,
          tableId: chatMessagesTableId,
          queries: [
            Query.equal("conversation_id", [conversationId]),
            Query.orderAsc("$createdAt"),
          ],
        }),
        resolveConversationName(conversation, userId),
      ]);

      return {
        id: conversation.$id,
        name,
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

  async markConversationAsRead(userId: string, conversationId: string) {
    try {
      const room = await this.getConversationRoom(userId, conversationId);
      if (!room) return;

      const unreadMessages = room.messages.filter(
        (message) => message.receiverUserId === userId && !message.isRead
      );

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

  async sendMessage(userId: string, conversationId: string, text: string) {
    try {
      const conversation = await tablesDB.getRow<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        rowId: conversationId,
      });

      const isBuyer = conversation.buyer_user_id === userId;
      const receiverUserId = isBuyer
        ? conversation.seller_user_id
        : conversation.buyer_user_id;
      const now = new Date().toISOString();
      const permissions = buildPermissions(
        conversation.buyer_user_id,
        conversation.seller_user_id
      );

      const row = await tablesDB.createRow<ChatMessageRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: chatMessagesTableId,
        rowId: ID.unique(),
        data: {
          conversation_id: conversationId,
          sender_user_id: userId,
          receiver_user_id: receiverUserId,
          message_text: text.trim(),
          is_read: false,
        },
        permissions,
      });

      await tablesDB.updateRow<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        rowId: conversationId,
        data: isBuyer
          ? {
              last_message: text.trim(),
              last_message_at: now,
              last_sender_id: userId,
              buyer_last_read_at: now,
            }
          : {
              last_message: text.trim(),
              last_message_at: now,
              last_sender_id: userId,
              seller_last_read_at: now,
            },
      });

      await notificationService.createNotification({
        userId: receiverUserId,
        title: "Pesan baru masuk",
        description: text.trim(),
        type: "chat",
        label: "CHAT",
        actionUrl: `/messages/room?conversationId=${conversationId}`,
      });

      return toChatMessage(row, userId);
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },
};
