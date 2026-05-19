// ============================================================================
// CardToo - Centralized Type Definitions & Data Structures
// ============================================================================
// File ini mendefinisikan seluruh tipe data, antarmuka (interface), 
// dan type-guards yang digunakan di seluruh aplikasi CardToo.
// Tipe data dipecah menjadi representasi mentah database (Appwrite Rows) 
// dan bentuk olahan tingkat aplikasi (UI Models) demi pemisahan kekhawatiran (separation of concerns).

/** Peran pengguna dalam platform (pembeli = buyer, penjual = seller) */
export type UserRole = "buyer" | "seller";

/** Nilai kondisi kartu TCG dalam format mentah (digunakan untuk database/logika internal) */
export type ProductConditionValue =
  | "mint"
  | "near_mint"
  | "excellent"
  | "good"
  | "played";

/** Nilai kondisi kartu TCG dalam format tampilan pengguna (UI) */
export type ProductCondition =
  | "Mint"
  | "Near Mint"
  | "Excellent"
  | "Good"
  | "Played";

/** Kategori waralaba kartu TCG yang tersedia di platform CardToo */
export type ProductCategoryValue =
  | "pokemon"
  | "onepiece"
  | "boboiboy"
  | "yugioh"
  | "magic"
  | "digimon"
  | "sports"
  | "other";

/** Status visibilitas dan ketersediaan produk di etalase toko */
export type ProductStatus = "draft" | "published" | "archived";

/** Status operasional dan legalitas toko penjual */
export type StoreStatus = "draft" | "active" | "suspended";

/** Status pesanan dari sudut pandang pembeli (Buyer) */
export type BuyerOrderStatusValue =
  | "unpaid"
  | "packed"
  | "shipped"
  | "completed"
  | "cancelled";

/** Metode pembayaran yang didukung oleh sistem checkout */
export type PaymentMethodValue = "qris";

/** Representasi baris data profil pengguna langsung dari tabel database Appwrite */
export interface UserProfileRow {
  /** Username unik pengguna */
  username: string;
  /** Email terdaftar */
  email: string;
  /** Peran hak akses (buyer/seller) */
  role: UserRole;
  /** Nama lengkap pengguna (opsional) */
  full_name: string | null;
  /** Nomor telepon pengguna (opsional) */
  phone: string | null;
  /** ID file gambar avatar di Appwrite Storage */
  avatar_file_id: string | null;
  /** URL publik untuk gambar avatar profil */
  avatar_url: string | null;
  /** Status keaktifan akun */
  is_active: boolean;
}

/** Tipe data profil pengguna lengkap dengan ID dokumen Appwrite untuk UI */
export interface UserProfile extends UserProfileRow {
  /** ID dokumen profil unik */
  id: string;
}

/** Representasi baris data produk kartu TCG langsung dari tabel database Appwrite */
export interface ProductRow {
  /** ID Toko pemilik produk ini */
  store_id: string;
  /** Nama atau Judul kartu TCG */
  title: string;
  /** Slug URL ramah SEO untuk pencarian produk */
  slug: string;
  /** Kategori game kartu TCG */
  category: ProductCategoryValue;
  /** Harga per unit kartu dalam Rupiah */
  price: number;
  /** Stok kartu yang tersedia */
  stock: number;
  /** Nilai kondisi fisik kartu */
  condition: ProductConditionValue;
  /** Rincian deskripsi produk (opsional) */
  description: string | null;
  /** ID file gambar sampul utama di Appwrite Storage */
  cover_file_id: string | null;
  /** URL publik gambar sampul utama */
  cover_url: string | null;
  /** Kumpulan ID file gambar galeri tambahan di Appwrite Storage */
  gallery_file_ids: string[] | null;
  /** Kumpulan URL publik gambar galeri tambahan */
  gallery_urls: string[] | null;
  /** Status penerbitan produk */
  status: ProductStatus;
}

/** Tipe data produk olahan siap pakai oleh komponen antarmuka pengguna (UI) */
export interface Product {
  /** ID dokumen produk unik */
  id: string;
  /** Judul atau nama produk */
  title: string;
  /** Harga produk */
  price: number;
  /** Label kondisi fisik kartu (misal: "Near Mint") */
  condition?: ProductCondition;
  /** Kategori produk */
  category?: string;
  /** URL gambar sampul produk */
  image?: string | null;
  /** Jumlah stok yang tersedia */
  stock?: number;
  /** ID Toko pemilik produk */
  storeId?: string;
  /** Status rilis produk */
  status?: ProductStatus;
  /** Detail deskripsi */
  description?: string | null;
  /** Slug URL ramah SEO */
  slug?: string;
  /** Galeri foto produk tambahan */
  gallery?: string[];
}

/** Representasi baris data profil toko penjual dari tabel database Appwrite */
export interface StoreRow {
  /** Nama Toko */
  store_name: string;
  /** Slug URL unik toko penjual */
  store_slug: string;
  /** Lokasi geografis atau kota toko berada */
  location: string | null;
  /** Deskripsi singkat toko */
  description: string | null;
  /** ID file gambar logo toko di Appwrite Storage */
  logo_file_id: string | null;
  /** URL publik gambar logo toko */
  logo_url: string | null;
  /** ID file gambar banner toko di Appwrite Storage */
  banner_file_id: string | null;
  /** URL publik gambar banner toko */
  banner_url: string | null;
  /** Status verifikasi kelayakan toko (centang biru) */
  is_verified: boolean;
  /** Status keaktifan toko */
  status: StoreStatus;
  /** ID Pengguna (User) pemilik toko ini */
  owner_user_id: string;
}

/** Tipe data profil toko penjual lengkap untuk kebutuhan rendering UI */
export interface Store {
  /** ID dokumen toko unik */
  id: string;
  /** Nama toko */
  name: string;
  /** Kota asal/lokasi toko */
  location: string;
  /** Tanggal pembuatan akun toko */
  createdAt?: string;
  /** Penilaian rata-rata toko */
  rating: string;
  /** Jumlah pengikut toko */
  followers: string;
  /** Status centang biru terverifikasi */
  isVerified: boolean;
  /** URL gambar banner sampul toko */
  coverImage: string | null;
  /** Deskripsi toko */
  description: string;
  /** Statistik kinerja respon toko */
  performance: {
    /** Kecepatan membalas pesan obrolan */
    chat: string;
    /** Kecepatan proses pesanan */
    process: string;
    /** Ketepatan waktu kirim paket */
    onTime: string;
  };
  /** Daftar produk-produk yang dijual oleh toko ini */
  products: Product[];
  /** ID pemilik toko */
  ownerUserId?: string;
  /** Slug URL toko */
  slug?: string;
  /** Status operasional toko */
  status?: StoreStatus;
  /** URL gambar logo toko */
  logoUrl?: string | null;
  /** URL gambar banner toko */
  bannerUrl?: string | null;
}

/** Representasi baris data alamat pengiriman pengguna di database Appwrite */
export interface AddressRow {
  /** ID Pengguna pemilik alamat */
  user_id: string;
  /** Label alamat (misal: "Rumah", "Kantor") */
  label: string;
  /** Nama lengkap penerima */
  name: string;
  /** Nomor telepon penerima */
  phone: string;
  /** Detail rincian alamat lengkap (jalan, nomor, RT/RW, kecamatan) */
  details: string;
  /** Status penanda alamat utama untuk checkout */
  is_primary: boolean;
}

/** Tipe data alamat pengiriman untuk interaksi antarmuka pengguna */
export interface Address {
  /** ID dokumen alamat unik */
  id: string;
  /** Label nama alamat */
  label: string;
  /** Nama penerima */
  name: string;
  /** Nomor telepon penerima */
  phone: string;
  /** Detail alamat lengkap */
  details: string;
  /** Menandakan apakah ini alamat pengiriman default */
  isPrimary: boolean;
}

/** Baris data item keranjang belanja langsung dari database Appwrite */
export interface CartItemRow {
  user_id: string;
  product_id: string;
  seller_user_id: string;
  store_id: string;
  product_title: string;
  product_image_url: string | null;
  store_name: string;
  condition: ProductConditionValue;
  price: number;
  quantity: number;
  is_selected: boolean;
}

/** Model item keranjang belanja terurai untuk di-render di halaman Cart */
export interface CartItem {
  /** ID dokumen item keranjang */
  id: string;
  /** ID pembeli */
  userId: string;
  /** ID produk yang dibeli */
  productId: string;
  /** ID pengguna penjual */
  sellerUserId: string;
  /** ID Toko penjual */
  storeId: string;
  /** Judul produk */
  title: string;
  /** Nama toko penjual */
  shopName: string;
  /** Harga per unit produk */
  price: number;
  /** URL gambar miniatur produk */
  image?: string | null;
  /** Jumlah barang yang dimasukkan */
  quantity: number;
  /** Kondisi fisik barang */
  condition: ProductCondition;
  /** Status centang untuk checkout */
  selected: boolean;
}

/** Representasi transaksi pesanan di database Appwrite */
export interface OrderRow {
  /** Kode unik invoice pesanan (misal: INV-YYYYMMDD-XXXXX) */
  order_code: string;
  /** Kunci idempoten untuk mencegah double charge saat transaksi QRIS */
  idempotency_key?: string | null;
  /** ID Pengguna pembeli */
  buyer_user_id: string;
  /** ID Pengguna penjual */
  seller_user_id: string;
  /** ID Toko tempat pemesanan dilakukan */
  store_id: string;
  /** Label alamat tujuan */
  address_label: string;
  /** Nama penerima paket */
  recipient_name: string;
  /** Nomor HP penerima paket */
  recipient_phone: string;
  /** Alamat lengkap tujuan pengiriman */
  address_details: string;
  /** Metode pembayaran */
  payment_method: PaymentMethodValue;
  /** Nama ekspedisi kurir pengiriman */
  shipping_method: string;
  /** Estimasi hari pengiriman */
  shipping_etd: string;
  /** Ongkos kirim */
  shipping_fee: number;
  /** Biaya admin/aplikasi */
  app_fee: number;
  /** Subtotal harga barang saja */
  subtotal: number;
  /** Total tagihan keseluruhan */
  total: number;
  /** Jumlah ragam produk dalam satu pesanan */
  product_count: number;
  /** Status pemrosesan pesanan */
  status: BuyerOrderStatusValue;
  /** Waktu pembayaran berhasil dikonfirmasi */
  paid_at: string | null;
}

/** Rincian produk dalam transaksi pesanan di database Appwrite */
export interface OrderItemRow {
  /** ID transaksi induk */
  order_id: string;
  /** ID produk */
  product_id: string;
  /** Judul produk saat transaksi terjadi (snapshot) */
  product_title: string;
  /** URL Gambar produk saat transaksi terjadi */
  product_image_url: string | null;
  /** Kondisi fisik produk saat transaksi */
  condition: ProductConditionValue;
  /** Jumlah kuantitas produk */
  quantity: number;
  /** Harga per unit produk */
  unit_price: number;
  /** Total harga produk (unit_price * quantity) */
  total_price: number;
}

/** Baris ulasan produk dari pembeli di database Appwrite */
export interface ReviewRow {
  order_id: string;
  product_id: string;
  store_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
}

/** Model ulasan produk untuk UI */
export interface Review {
  id: string;
  orderId: string;
  productId: string;
  storeId: string;
  userId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

/** Ringkasan statistik rating produk */
export interface ReviewSummary {
  /** Rata-rata bintang ulasan */
  averageRating: number;
  /** Total banyaknya ulasan masuk */
  totalReviews: number;
  /** Distribusi rincian jumlah bintang */
  breakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  /** Daftar list ulasan dari pembeli */
  reviews: Review[];
}

/** Hubungan room obrolan/pesan di database Appwrite */
export interface ConversationRow {
  buyer_user_id: string;
  seller_user_id: string;
  store_id: string;
  last_message: string | null;
  last_message_at: string;
  last_sender_id: string | null;
  buyer_last_read_at: string | null;
  seller_last_read_at: string | null;
}

/** Baris isi obrolan/pesan chat individual di database Appwrite */
export interface ChatMessageRow {
  conversation_id: string;
  sender_user_id: string;
  receiver_user_id: string;
  message_text: string;
  is_read: boolean;
}

/** Struktur data notifikasi sistem di database Appwrite */
export interface NotificationRow {
  user_id: string;
  title: string;
  description: string;
  type: "order" | "promo" | "system" | "chat" | "alert" | "message";
  label: string | null;
  action_url: string | null;
  is_read: boolean;
}

/** Hubungan produk favorit pengguna di database Appwrite */
export interface FavoriteRow {
  user_id: string;
  product_id: string;
}

/** Data map koleksi folder kartu milik user di database Appwrite */
export interface CollectionRow {
  user_id: string;
  title: string;
}

/** Rincian item kartu yang tersimpan dalam folder koleksi di database Appwrite */
export interface CollectionItemRow {
  collection_id: string;
  product_id: string | null;
  custom_title: string;
  price_snapshot: number;
  condition: ProductConditionValue;
  image_url: string | null;
}

/** Rincian item pesanan dari sudut pandang pembeli (UI Model) */
export interface BuyerOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productImage?: string | null;
  condition: ProductCondition;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/** Transaksi pesanan lengkap untuk pembeli (UI Model) */
export interface BuyerOrder {
  id: string;
  orderCode: string;
  idempotencyKey?: string | null;
  buyerUserId: string;
  sellerUserId: string;
  storeId: string;
  addressLabel: string;
  recipientName: string;
  recipientPhone: string;
  addressDetails: string;
  paymentMethod: PaymentMethodValue;
  shippingMethod: string;
  shippingEtd: string;
  shippingFee: number;
  appFee: number;
  subtotal: number;
  total: number;
  productCount: number;
  status: BuyerOrderStatusValue;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  storeName?: string;
  items: BuyerOrderItem[];
}

/** Informasi user terotentikasi dari Appwrite Auth */
export interface AuthUser {
  /** ID unik pengguna */
  id: string;
  /** Nama lengkap pengguna */
  name: string;
  /** Alamat email terdaftar */
  email: string;
}

/** Skema input formulir pendaftaran toko baru (seller onboarding) */
export interface SellerOnboardingInput {
  storeName: string;
  preferredSlug?: string;
  description?: string;
  fullName?: string;
  phone?: string;
}

/** Skema input formulir pendaftaran user baru (register) */
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

/** Skema input formulir masuk akun (login) */
export interface LoginInput {
  email: string;
  password: string;
}

/** Skema input penambahan produk baru ke etalase */
export interface CreateProductInput {
  storeId: string;
  title: string;
  category: ProductCategoryValue;
  price: number;
  stock: number;
  condition: ProductConditionValue;
  description?: string;
  coverFile?: File | null;
}

/** Skema input pembuatan alamat baru */
export interface CreateAddressInput {
  label: string;
  name: string;
  phone: string;
  details: string;
  isPrimary?: boolean;
}

/** Skema input penambahan barang ke keranjang belanja */
export interface AddCartItemInput {
  productId: string;
  sellerUserId: string;
  storeId: string;
  productTitle: string;
  productImageUrl?: string | null;
  storeName: string;
  condition: ProductConditionValue;
  price: number;
  quantity?: number;
  isSelected?: boolean;
}

/** Opsi kurir pengiriman barang saat checkout */
export interface ShippingMethodOption {
  id: string;
  name: string;
  price: number;
  etd: string;
}

/** Skema parameter input pemesanan transaksi baru */
export interface CreateOrderInput {
  shippingMethod: ShippingMethodOption;
  paymentMethod: PaymentMethodValue;
  idempotencyKey?: string;
}

/** Skema input formulir ubah rincian data produk */
export interface UpdateProductInput {
  title: string;
  category: ProductCategoryValue;
  price: number;
  stock: number;
  condition: ProductConditionValue;
  description?: string;
  coverFile?: File | null;
}

/** Skema input formulir ubah rincian profil toko */
export interface UpdateStoreInput {
  storeName: string;
  location?: string;
  description?: string;
  bannerFile?: File | null;
}

/** Struktur ringkas data transaksi pemesanan untuk halaman order */
export interface Order {
  id: string;
  shopName: string;
  productTitle: string;
  condition: string;
  quantity: number;
  totalPrice: number;
  status: "Belum Bayar" | "Dikemas" | "Dikirim" | "Selesai" | "Dibatalkan";
  productImage?: string;
  date?: string;
}

/** Rincian transaksi pesanan dari sudut pandang dashboard penjual (Seller) */
export interface SellerOrder {
  id: string;
  orderCode: string;
  idempotencyKey?: string | null;
  buyerUserId: string;
  storeId: string;
  storeName?: string;
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  subtotal: number;
  shippingFee: number;
  appFee: number;
  productCount: number;
  status: BuyerOrderStatusValue;
  date: string;
  courier: string;
  shippingEtd: string;
  paidAt: string | null;
  items: SellerOrderItem[];
}

/** Rincian produk dalam transaksi pesanan penjual (Seller) */
export interface SellerOrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  qty: number;
  totalPrice: number;
  condition: ProductCondition;
  image?: string | null;
}

/** Kontak inbox pesan obrolan */
export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  msg: string;
  time: string;
  unread: number;
  sellerId?: string;
  buyerId?: string;
  storeId?: string;
}

/** Obrolan pesan chat individual */
export interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  createdAt?: string;
  isRead: boolean;
  senderUserId: string;
  receiverUserId: string;
}

/** Item notifikasi individual untuk halaman Inbox Notifikasi */
export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "order" | "promo" | "system" | "chat" | "alert" | "message";
  read: boolean;
  label?: string;
  actionUrl?: string | null;
}

/** Pengelompokan notifikasi berdasarkan waktu (misal: "Hari Ini", "Kemarin") */
export interface NotificationGroup {
  group: string;
  items: NotificationItem[];
}

/** Folder koleksi kartu user */
export interface Collection {
  id: string;
  title: string;
  count: number;
}

/** Item produk favorit user (Wishlist) */
export interface FavoriteItem {
  id: string;
  productId: string;
  storeId?: string;
  title: string;
  shopName: string;
  price: number;
  image?: string | null;
}

/** Kartu/Item yang tersemat di dalam sebuah folder koleksi */
export interface CollectionItem {
  id: string;
  collectionId: string;
  productId?: string | null;
  title: string;
  price: number;
  condition: ProductCondition;
  image?: string | null;
}

/** Rincian mutasi saldo/transaksi keuangan untuk dompet/penarikan saldo seller */
export interface TransactionDetail {
  id: string;
  orderId: string;
  date: string;
  productName: string;
  grossAmount: number;
  serviceFee: number;
  netAmount: number;
  status: "Completed" | "Processing";
}

/** Perangkat terdaftar yang sedang mengakses akun pengguna (Keamanan Sesi) */
export interface Device {
  id: string;
  name: string;
  location: string;
  time: string;
  isCurrent: boolean;
}
