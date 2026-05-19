import { ExecutionMethod, functions } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import type {
  BuyerOrder,
  ChatMessage,
  Review,
  ShippingMethodOption,
} from "@/types";

// Enumerasi aksi yang didukung oleh Cloud Function commerce-gateway
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

// Representasi tipe data respon sukses dari gateway
type GatewaySuccess<T> = {
  ok: true;
  data: T;
};

// Representasi tipe data respon gagal dari gateway
type GatewayFailure = {
  ok: false;
  message: string;
};

/** 
 * Normalisasi error saat memanggil backend tepercaya (Appwrite Cloud Function).
 * @param error Objek error tidak dikenal
 */
const normalizeError = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Trusted backend Appwrite Function gagal dipanggil.";

/**
 * Mengurai string JSON dari respons Appwrite Function.
 * Backend diharapkan selalu mengembalikan format { ok: boolean, data/message }.
 * 
 * @param responseBody String mentah hasil eksekusi fungsi
 */
const parseGatewayResponse = <T>(
  responseBody: string | undefined
): GatewaySuccess<T>["data"] => {
  const parsed = JSON.parse(responseBody || "{}") as
    | GatewaySuccess<T>
    | GatewayFailure;

  // Validasi format objek respon JSON
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Respons trusted backend tidak valid.");
  }

  // Lempar pesan kesalahan jika status 'ok' bernilai false/gagal
  if (!("ok" in parsed) || parsed.ok !== true) {
    throw new Error(
      "message" in parsed && typeof parsed.message === "string"
        ? parsed.message
        : "Trusted backend mengembalikan respons error."
    );
  }

  return parsed.data;
};

/**
 * Fungsi utilitas untuk mengeksekusi Appwrite Function `commerce-gateway`
 * yang berjalan di backend untuk menangani logika kompleks/sensitif
 * (seperti transaksi pembayaran, perhitungan saldo, enkripsi chat, dll).
 * 
 * @param action Nama aksi target di Cloud Function
 * @param payload Parameter data masukan untuk aksi terkait
 */
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
    // Jalankan eksekusi fungsi serverless secara sinkron (async: false) untuk menunggu respon balik
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

    // Urai dan validasi hasil response body Cloud Function
    return parseGatewayResponse<T>(
      "responseBody" in execution
        ? (execution.responseBody as string | undefined)
        : undefined
    );
  } catch (error) {
    throw new Error(normalizeError(error));
  }
};

/**
 * Kumpulan layanan untuk berinteraksi dengan `commerce-gateway` Appwrite Function.
 * Semua operasi mutasi data yang memerlukan validasi keamanan ekstra 
 * (menghindari manipulasi client-side) harus melalui layanan ini.
 */
export const commerceGatewayService = {
  /** 
   * Memproses pembuatan pesanan baru (checkout).
   * Dijalankan di Cloud Function untuk mencegah manipulasi harga barang oleh client.
   */
  createOrder(input: {
    shippingMethod: ShippingMethodOption;
    paymentMethod: "qris";
    idempotencyKey?: string;
  }) {
    return executeGateway<{ orderId: string }>("createOrder", input);
  },

  /** 
   * Memvalidasi pembayaran pesanan (webhook callback simulator).
   */
  markOrderAsPaid(orderId: string) {
    return executeGateway<{ orderId: string }>("markOrderAsPaid", { orderId });
  },

  /** 
   * Mengubah status pesanan menjadi dikirim (khusus Seller).
   */
  markOrderAsShipped(orderId: string) {
    return executeGateway<{ orderId: string }>("markOrderAsShipped", { orderId });
  },

  /** 
   * Menyelesaikan pesanan secara sah setelah barang diterima (khusus Buyer).
   */
  markOrderAsCompleted(orderId: string) {
    return executeGateway<{ orderId: string }>("markOrderAsCompleted", {
      orderId,
    });
  },

  /** 
   * Membatalkan pesanan jika belum dibayar / dibatalkan secara sepihak.
   */
  markOrderAsCancelled(orderId: string) {
    return executeGateway<{ orderId: string }>("markOrderAsCancelled", {
      orderId,
    });
  },

  /** 
   * Menutup toko dan menghapus seluruh data produk yang terkait secara massal.
   */
  closeStore() {
    return executeGateway<{ closedStoreId: string }>("closeStore", {});
  },

  /** 
   * Menghapus akun pengguna beserta semua data yang berhubungan dengannya secara menyeluruh.
   */
  deleteAccount() {
    return executeGateway<{ deletedUserId: string }>("deleteAccount", {});
  },

  /** 
   * Membuat room chat baru dan mengamankan permission-nya di tingkat server.
   */
  getOrCreateConversation(input: {
    sellerUserId: string;
    storeId: string;
  }) {
    return executeGateway<{ conversationId: string }>(
      "getOrCreateConversation",
      input
    );
  },

  /** 
   * Mengirim pesan chat melalui gateway agar disaring & tercatat di database dengan aman.
   */
  sendMessage(input: { conversationId: string; text: string }) {
    return executeGateway<{ message: ChatMessage }>("sendMessage", input);
  },

  /** 
   * Menyimpan ulasan produk dari pengguna yang sudah terverifikasi membeli produk tersebut.
   */
  createReview(input: { orderId: string; rating: number; reviewText: string }) {
    return executeGateway<{ review: Review }>("createReview", input);
  },
};
