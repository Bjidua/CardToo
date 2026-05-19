import { ExecutionMethod, functions } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import type {
  BuyerOrder,
  ChatMessage,
  Review,
  ShippingMethodOption,
} from "@/types";

type GatewayAction =
  | "createOrder"
  | "markOrderAsPaid"
  | "markOrderAsShipped"
  | "markOrderAsCompleted"
  | "markOrderAsCancelled"
  | "closeStore"
  | "deleteAccount"
  | "getOrCreateConversation"
  | "sendMessage"
  | "createReview";

type GatewaySuccess<T> = {
  ok: true;
  data: T;
};

type GatewayFailure = {
  ok: false;
  message: string;
};

const normalizeError = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Trusted backend Appwrite Function gagal dipanggil.";

const parseGatewayResponse = <T>(
  responseBody: string | undefined
): GatewaySuccess<T>["data"] => {
  const parsed = JSON.parse(responseBody || "{}") as
    | GatewaySuccess<T>
    | GatewayFailure;

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Respons trusted backend tidak valid.");
  }

  if (!("ok" in parsed) || parsed.ok !== true) {
    throw new Error(
      "message" in parsed && typeof parsed.message === "string"
        ? parsed.message
        : "Trusted backend mengembalikan respons error."
    );
  }

  return parsed.data;
};

const executeGateway = async <T>(
  action: GatewayAction,
  payload: Record<string, unknown>
) => {
  const functionId = appwriteConfig.functions.commerceGateway;
  if (!functionId) {
    throw new Error(
      "Appwrite Function commerce-gateway belum dikonfigurasi di environment."
    );
  }

  try {
    const execution = await functions.createExecution({
      functionId,
      async: false,
      method: ExecutionMethod.POST,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        action,
        payload,
      }),
    });

    return parseGatewayResponse<T>(
      "responseBody" in execution
        ? (execution.responseBody as string | undefined)
        : undefined
    );
  } catch (error) {
    throw new Error(normalizeError(error));
  }
};

export const commerceGatewayService = {
  createOrder(input: {
    shippingMethod: ShippingMethodOption;
    paymentMethod: "qris";
    idempotencyKey?: string;
  }) {
    return executeGateway<{ orderId: string }>("createOrder", input);
  },

  markOrderAsPaid(orderId: string) {
    return executeGateway<{ orderId: string }>("markOrderAsPaid", { orderId });
  },

  markOrderAsShipped(orderId: string) {
    return executeGateway<{ orderId: string }>("markOrderAsShipped", { orderId });
  },

  markOrderAsCompleted(orderId: string) {
    return executeGateway<{ orderId: string }>("markOrderAsCompleted", {
      orderId,
    });
  },

  markOrderAsCancelled(orderId: string) {
    return executeGateway<{ orderId: string }>("markOrderAsCancelled", {
      orderId,
    });
  },

  closeStore() {
    return executeGateway<{ closedStoreId: string }>("closeStore", {});
  },

  deleteAccount() {
    return executeGateway<{ deletedUserId: string }>("deleteAccount", {});
  },

  getOrCreateConversation(input: {
    sellerUserId: string;
    storeId: string;
  }) {
    return executeGateway<{ conversationId: string }>(
      "getOrCreateConversation",
      input
    );
  },

  sendMessage(input: { conversationId: string; text: string }) {
    return executeGateway<{ message: ChatMessage }>("sendMessage", input);
  },

  createReview(input: { orderId: string; rating: number; reviewText: string }) {
    return executeGateway<{ review: Review }>("createReview", input);
  },
};
