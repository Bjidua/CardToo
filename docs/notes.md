# CardToo Progress & Technical Notes

> [!NOTE]
> Dokumen ini mencatat detail arsitektur teknis, peta folder, cakupan database backend, audit progres terkini, serta analisis risiko untuk CardToo. Dokumen ini wajib dibaca oleh semua kontributor dan AI asisten (`Pi`) sebelum memulai pengerjaan fitur baru.

---

## 1. Konteks Project & Target Persona

CardToo adalah aplikasi marketplace/e-commerce TCG (*Trading Card Game*) yang dirancang khusus untuk kebutuhan *mobile-first*. Platform ini memfasilitasi transaksi jual-beli kartu koleksi seperti Pokemon, One Piece, Boboiboy, Yu-Gi-Oh!, dan sejenisnya.

Aplikasi ini dikembangkan dengan target alur kerja yang jelas untuk tiga persona utama:
1. **Guest**: Menelusuri produk, melihat kategori, pencarian, dan diarahkan untuk login/register saat ingin bertransaksi.
2. **Buyer**: Melakukan pembelian (end-to-end), mengelola keranjang, menambahkan produk ke daftar favorit/koleksi, berkirim pesan dengan penjual, melakukan checkout, pembayaran, serta memantau status pesanan dan memberikan ulasan.
3. **Seller**: Mengupgrade akun buyer menjadi seller, mengelola informasi toko (nama, deskripsi, banner, lokasi), mengelola produk (tambah, edit, hapus), melacak pesanan masuk, serta melihat laporan pendapatan toko.

---

## 2. Folder Structure Tree

Berikut adalah struktur folder proyek CardToo beserta penjelasan fungsinya:

```text
CardToo/
├── .github/                  # Konfigurasi GitHub Actions untuk CI/CD dan workflow otomasi
├── appwrite-functions/       # Serverless cloud functions untuk di-deploy ke Appwrite
│   └── commerce-gateway/     # Gateway backend untuk operasi database lintas buyer/seller secara aman
├── docs/                     # Dokumentasi project (panduan, arsitektur, catatan progres)
│   ├── AI/                   # Panduan pengerjaan & aturan pengembangan untuk asisten AI (AGENTS.md)
│   └── design_system/        # Token desain, arsitektur visual, dan pedoman UI/UX
├── public/                   # Aset statis aplikasi yang bisa diakses langsung via URL (favicon, dll.)
│   └── assets/               # File gambar PNG/SVG untuk logo, banner, dan ikon UI
├── scripts/                  # Skrip otomasi untuk deploy database, migrasi, dan pembantu development
├── src/                      # Source code utama aplikasi web Next.js
│   ├── app/                  # Next.js App Router (sistem routing berbasis folder)
│   │   ├── (auth)/           # Route group untuk modul autentikasi (login, register, OTP)
│   │   ├── checkout/         # Alur transaksi checkout dan pembayaran (payment)
│   │   ├── seller/           # Modul dashboard toko dan pengelolaan pesanan oleh seller
│   │   ├── test-components/  # Halaman pengujian komponen UI/UX selama masa pengembangan
│   │   └── ...               # Halaman fitur pembeli/publik (cart, product, profile, dll.)
│   ├── components/           # Kumpulan komponen React reusable
│   │   ├── auth/             # Komponen UI spesifik proses login/register
│   │   ├── chat/             # Komponen UI untuk fitur obrolan pembeli-penjual
│   │   ├── collections/      # Komponen penampil daftar koleksi TCG
│   │   ├── layout/           # Tata letak global (BottomNav, StickyHeader, DevGodModePanel)
│   │   └── ui/               # Komponen UI dasar / atomik (Button, Input, Card, dll.)
│   ├── context/              # React Context untuk state management global (AuthContext, LanguageContext)
│   ├── hooks/                # Custom React Hooks (seperti useFavorites untuk mengelola favorit)
│   ├── lib/                  # Inisialisasi library pihak ketiga dan layer integrasi API
│   │   ├── appwrite/         # Setup client SDK Appwrite dan konfigurasi environment
│   │   └── services/         # Layer komunikasi API per sub-modul (auth, cart, order, product, dll.)
│   └── types/                # Berisi deklarasi/definisi type & interface TypeScript global (index.ts)
└── tests/                    # Pengujian otomatis aplikasi (integration/unit testing)
```

### Penjelasan Fungsi Masing-Masing Folder Utama:
- **`appwrite-functions/`**: Menyimpan fungsi serverless backend (FaaS) yang dieksekusi di lingkungan terisolasi Appwrite. Salah satu fungsi utama adalah `commerce-gateway` yang menjamin integritas transaksi dan operasi tulis (write) yang memerlukan validasi keamanan ketat di sisi server.
- **`docs/`**: Berisi seluruh file dokumentasi proyek. Hal ini mencakup pedoman standar asisten AI (`AI/AGENTS.md`), catatan perkembangan (`notes.md`), daftar tugas yang harus diselesaikan (`to-do.md`), dan panduan desain visual (`design_system`).
- **`public/`**: Menyimpan aset statis yang disajikan langsung oleh Next.js tanpa kompilasi tambahan, seperti berkas aset logo, banner hero, dan favicon.
- **`scripts/`**: Kumpulan skrip otomasi berbasis Node.js yang mempermudah deployment cloud functions ke Appwrite serta skrip migrasi database (misalnya, migrasi penambahan kunci idempotensi pesanan).
- **`src/`**: Tempat utama penulisan kode program (source code) aplikasi CardToo:
  - **`src/app/`**: Pusat routing Next.js berbasis file system. Folder ini menentukan path URL aplikasi. Halaman pembeli, seller, serta halaman admin dikelompokkan secara terstruktur di sini.
  - **`src/components/`**: Komponen antarmuka pengguna (UI) yang dirancang agar dapat digunakan kembali (reusable). Terbagi menjadi komponen tata letak (`layout/`), komponen spesifik fitur (`auth/`, `chat/`), serta komponen atomik/dasar (`ui/`).
  - **`src/context/`**: Mengelola state global aplikasi menggunakan React Context API, seperti menyimpan data autentikasi user aktif dan preferensi bahasa yang dipilih.
  - **`src/hooks/`**: Memisahkan logika bisnis atau operasi stateful dari tampilan UI ke dalam fungsi pembantu khusus React (Custom Hooks) agar kode UI tetap bersih dan modular.
  - **`src/lib/`**: Lapisan integrasi eksternal. Di dalamnya terdapat setup inisialisasi Appwrite SDK (`lib/appwrite`) serta layer `services` yang memisahkan logika database/API query (seperti fetch produk, simpan order, update keranjang) dari komponen visual Next.js.
  - **`src/types/`**: Menyediakan type-safety menggunakan TypeScript agar seluruh properti objek (misal: data `Product`, `Order`, `User`) yang mengalir dari database hingga ke antarmuka pengguna tervalidasi dengan benar secara statis.
- **`tests/`**: Berisi file pengujian otomatis untuk memvalidasi alur bisnis kritis agar aplikasi tetap stabil ketika terjadi perubahan atau penambahan fitur di kemudian hari.

---

## 3. Arsitektur Teknis & Konfigurasi

### Frontend
- **Framework**: `Next.js 16.2.4` (App Router)
- **Library Inti**: `React 19.2.4` & `React DOM 19.2.4`
- **Styling**: `Tailwind CSS v4.0.0` & `@tailwindcss/postcss`
- **Animasi & Transisi**: `Framer Motion v12.38.0`
- **Slider/Carousel**: `Swiper v12.1.4`
- **Ikon**: `Lucide React v1.14.0`

### Backend (Appwrite)
Integrasi backend sepenuhnya menggunakan **Appwrite SDK (`^25.0.0`)** yang mencakup:
- **Autentikasi**: Appwrite Auth (Email/Sandi + sinkronisasi state user ke `AuthContext`).
- **Database**: Appwrite TablesDB untuk penyimpanan data relasional terstruktur.
- **Storage**: Appwrite Storage Buckets untuk manajemen file media (avatar, gambar produk, banner toko).
- **Functions**: Appwrite Functions (`commerce-gateway`) sebagai lapisan trusted backend/API gateway untuk mengoordinasikan transaksi aman.

> [!IMPORTANT]
> **Static Export Hardening (`output: 'export'`)**
> Proyek ini menggunakan mode static export di Next.js. Karena halaman HTML diekspor secara statis saat waktu build (*build-time*), rute dinamis standar seperti `/product/[id]` tidak dapat digunakan untuk entitas database yang baru dibuat di Appwrite setelah build selesai.
> 
> Sebagai solusinya, semua detail entitas runtime wajib menggunakan rute statis dengan parameter query:
> - Detail Produk: `/product/detail?productId=...`
> - Detail Toko: `/store/detail?storeId=...`
> - Edit Produk Seller: `/seller/products/edit?productId=...`
> - Ruang Obrolan: `/messages/room?conversationId=...`
> - Pelacakan Pesanan: `/orders/track?orderId=...`

---

## 4. Cakupan Database & Storage (Appwrite Coverage)

Berdasarkan berkas konfigurasi `src/lib/appwrite/config.ts`, berikut adalah pemetaan tabel (koleksi), storage bucket, dan fungsi serverless yang digunakan:

### Tabel Database (`databaseId: "69f63b060014c2f96188"`)

| Nama Tabel / Koleksi ID | Model Layer Service | Deskripsi / Fungsi |
| :--- | :--- | :--- |
| `user_profiles` | `profile.ts` | Menyimpan metadata user seperti nama, avatar URL, role (buyer/seller), dll. |
| `stores` | `store.ts` | Menyimpan profil toko seller termasuk nama toko, deskripsi, banner, dan lokasi. |
| `products` | `product.ts` | Menyimpan data produk kartu TCG (nama, harga, kategori, stok, foto, deskripsi). |
| `addresses` | `address.ts` | Daftar alamat pengiriman yang didaftarkan oleh buyer. |
| `cart_items` | `cart.ts` | Item yang dimasukkan ke keranjang belanja oleh user aktif. |
| `orders` | `order.ts` | Menyimpan transaksi pesanan (ID, buyer ID, total, status, idempotency key). |
| `order_items` | `order.ts` | Detail item produk di dalam satu pesanan (kuantitas, harga saat dibeli). |
| `reviews` | `review.ts` | Ulasan dan rating bintang yang diberikan buyer untuk produk. |
| `conversations` | `chat.ts` | Kamar chat/percakapan utama yang menghubungkan akun buyer dan seller. |
| `chat_messages` | `chat.ts` | Isi pesan obrolan terperinci beserta relasi pengirim dan waktu kirim. |
| `notifications` | `notification.ts` | Notifikasi sistem untuk order, chat baru, dan info status akun. |
| `favorites` | `favorite.ts` | Daftar produk favorit yang disimpan oleh buyer (Wishlist). |
| `collections` | `collection.ts` | Daftar koleksi kartu/album yang dibuat secara khusus oleh user. |
| `collection_items` | `collection.ts` | Kartu/item produk yang dimasukkan ke dalam album koleksi spesifik. |

### Storage Buckets
- **`profile-avatars`**: Menyimpan file foto profil pengguna.
- **`store-assets`**: Menyimpan file gambar banner toko seller.
- **`product-images`**: Menyimpan berkas gambar kartu/produk TCG yang diunggah oleh seller.

### Serverless Functions
- **`commerce-gateway`**: Berfungsi mengeksekusi operasi penulisan lintas-koleksi yang memerlukan keamanan tinggi, seperti saat checkout (mengurangi stok produk secara atomik dan membuat record `orders` & `order_items` sekaligus secara transaksional).

---

## 5. Progres & Audit Kesiapan Produksi (Progress Audit)

### Modul yang Sudah Berfungsi Penuh (Production-Ready)
- [x] **Autentikasi & Sesi**: Login, registrasi, logout terintegrasi dengan status state global di `AuthContext`.
- [x] **Alur Pembelian (Buyer Flow)**: Menelusuri katalog, menambahkan ke favorit/keranjang, checkout, melakukan simulasi pembayaran, memantau status order, hingga memberikan ulasan/rating.
- [x] **Alur Penjualan (Seller Flow)**: Mengupgrade profile pembeli menjadi seller, membuat entitas toko baru, menambahkan produk dengan upload gambar langsung ke Appwrite, mengedit dan menghapus produk, serta memantau status pesanan masuk.
- [x] **Fitur Sosial**: Sistem chat real-time, ulasan produk, dan notifikasi perubahan status transaksi.
- [x] **Hardening Navigasi**: Transisi navigasi menggunakan route berbasis query parameter guna mendukung Next.js Static Export secara aman.

### Bagian yang Sedang & Perlu QA Akhir
- [ ] **Smoke Test Multi-Akun**: Melakukan pengujian alur secara menyeluruh menggunakan tiga akun terpisah (Guest, Buyer, Seller) secara bersamaan untuk mendeteksi konflik state.
- [ ] **Audit Izin Akses (Permissions Appwrite)**:
  - Memastikan dokumen sensitif seperti alamat pengiriman, keranjang, dan riwayat pesanan memiliki *read-write permission* yang terbatas hanya untuk pemilik dokumen (`owner-scoped`).
  - Memastikan data publik (produk, detail toko, review) memiliki izin *read* secara publik.
- [ ] **Validasi Validitas Gateway**: Pengujian ketahanan `commerce-gateway` dalam menangani pengurangan stok secara konkuren dan penanganan idempotency key pada pesanan.

---

## 6. Analisis Risiko & Langkah Berikutnya

### Identifikasi Risiko (Risiko & Tantangan)
1. **Pembatasan Static Export**: Segala penambahan fitur baru yang membutuhkan halaman detail harus mematuhi skema query-based routing (`?id=...`). Pembuatan dynamic path tradisional `/detail/[id]` akan merusak proses build static export di produksi.
2. **Ketergantungan Eksternal (Appwrite Cloud)**: Karena backend di-host di layanan cloud Appwrite SGP, responsivitas aplikasi sangat bergantung pada latensi jaringan eksternal. Perlu penanganan state loading yang halus di frontend menggunakan Framer Motion.
3. **Kebocoran Izin Dokumen**: Konfigurasi permission di sisi Appwrite Console harus dikunci dengan benar. Jika terjadi kelalaian dalam setelan permission di dashboard Appwrite, ada risiko user lain dapat membaca/mengubah pesanan atau alamat milik user lain.

### Langkah Berikutnya
1. **Melakukan QA End-to-End**: Melaksanakan pengujian fungsional lintas-peran secara menyeluruh sesuai daftar di `docs/to-do.md`.
2. **Uji Coba Lint & Build Lokal**: Menjalankan perintah `npm run lint` dan `npm run build` secara periodik selama pengembangan untuk memastikan static export terkompilasi tanpa error TypeScript.
3. **Penyempurnaan UI Polish**: Menyelesaikan affordance UI untuk pengunggahan logo toko dan konfirmasi integrasi alur payout seller.
