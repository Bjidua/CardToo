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
  createdAt: row.$createdAt,
  isRead: row.is_read,
  senderUserId: row.sender_user_id,
  receiverUserId: row.receiver_user_id,
});

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

const resolveConversationMeta = async (
  conversation: ConversationRecord,
  currentUserId: string
) => {
  const isBuyer = conversation.buyer_user_id === currentUserId;

  if (isBuyer) {
    const store = await storeService.getStoreById(conversation.store_id);
    if (store) {
      return {
        name: store.name,
        avatar: store.logoUrl || store.bannerUrl || undefined,
      };
    }

    const sellerProfile = await profileService.getProfile(conversation.seller_user_id);
    return {
      name: sellerProfile?.full_name || sellerProfile?.username || "Seller",
      avatar: sellerProfile?.avatar_url || undefined,
    };
  }

  const buyerProfile = await profileService.getProfile(conversation.buyer_user_id);
  return {
    name: buyerProfile?.full_name || buyerProfile?.username || "Pembeli",
    avatar: buyerProfile?.avatar_url || undefined,
  };
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

      const { conversationId } = await commerceGatewayService.getOrCreateConversation({
        sellerUserId: input.sellerUserId,
        storeId: input.storeId,
      });

      return await tablesDB.getRow<ConversationRecord>({
        databaseId: appwriteConfig.databaseId,
        tableId: conversationsTableId,
        rowId: conversationId,
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
      const { message } = await commerceGatewayService.sendMessage({
        conversationId,
        text,
      });

      const localTime = formatChatTime(
        message.createdAt || new Date().toISOString()
      );

      return message.senderUserId === userId
        ? { ...message, sender: "me" as const, time: localTime }
        : { ...message, sender: "other" as const, time: localTime };
    } catch (error) {
      throw new Error(normalizeError(error));
    }
  },

  subscribeMessages(
    conversationId: string,
    onEvent: (message: ChatMessageRecord) => void
  ) {
    const channel = Channel.tablesdb(appwriteConfig.databaseId)
      .table(chatMessagesTableId)
      .row();

    const subscriptionPromise = realtime.subscribe(
      channel,
      (event) => {
        const payload = event.payload as Partial<ChatMessageRecord & { $id: string }>;
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

    return () => {
      void subscriptionPromise.then((subscription) => subscription.unsubscribe());
    };
  },
};
