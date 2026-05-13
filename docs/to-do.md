# Project To Do List

## 🎨 Fase 1: Slicing UI & Layout (Selesai)
- [x] **Asset Management**: Export semua icon, logo, dan gambar dari Figma ke folder `public/assets`.
- [x] **Global Wrapper**: Buat layout khusus mobile biar tampilan konsisten di semua device (`layout.tsx` dengan `max-w-[440px]`).
- [x] **Page Slicing (Core Tabs)**: Rakit halaman utama (Home, Messages, Collections, Profile).
- [x] **Page Slicing (Auth)**: Rakit halaman Login, Register, Forgot Password.
- [x] **Page Slicing (Notifications)**: Rakit halaman Notifikasi dengan pengelompokan waktu.
- [x] **Page Slicing (Cart)**: Rakit halaman Keranjang dengan interaksi kuantitas & checkout summary.
- [x] **Page Slicing (Categories)**: Rakit halaman Semua Kategori dengan daftar kartu kategori.
- [x] **Page Slicing & Logic (Search)**: Rakit halaman Pencarian dengan filter produk *real-time*.
- [x] **Page Slicing (Order History)**: Rakit halaman Riwayat Order (Buyer) dengan sistem tab interaktif.
- [x] **Page Slicing (My Favorite)**: Rakit halaman Wishlist dengan fitur quick "Add to Cart".
- [x] **Page Slicing (Settings)**: Rakit halaman Pengaturan lengkap dengan kategori akun, keamanan, dan bantuan.
- [x] **Tech Debt**: Refactor `StickyHeader` berulang menjadi satu komponen *reusable*.

## 🧹 Fase 2: Clean Slate & TypeScript (Selesai)
- [x] **Store onboarding seller**: Rakit form onboarding dan verifikasi.
- [x] **Product CRUD seller**: Rakit Dashboard Seller, Manajemen Produk, dan Form Tambah Produk.
- [x] **Catalog buyer**: Product Detail, Checkout Page, Cart, Address Management, Store Profile, Review System.
- [x] **Order + Payment Status**: Slicing halaman pembayaran QRIS dan detail pesanan.
- [x] **Penghapusan Data Dummy**: Membersihkan seluruh data tiruan dari UI (Home, Store, Product, Checkout, Dashboard) untuk mencegah kebocoran data simulasi.
- [x] **TypeScript Fixes**: Menambahkan antarmuka (Interfaces) yang kuat di seluruh komponen untuk mencegah tipe `any` dan `never`.
- [x] **Audit Kesiapan Backend**: Menganalisis kebutuhan skema koleksi untuk integrasi nyata.

## ⚙️ Fase 3: Integrasi Backend Appwrite (Sedang Berjalan)
- [ ] **Sistem Auth**: Koneksi input form Login/Register ke `Account.createEmailPasswordSession()` dan simpan state di `AuthContext`.
- [ ] **Role Management**: Sistem upgrade user menjadi *Seller* dengan merekam data di koleksi `Users` dan `Stores`.
- [ ] **Database Setup**: Buat koleksi `Products`, `Orders`, `Carts`, `Addresses`, dan `Messages` di konsol Appwrite.
- [ ] **Data Fetching**: Ganti status *empty arrays* dengan fungsi ambil data langsung dari database menggunakan *custom hooks* atau SWR.
- [ ] **Storage Integration**: Fungsi unggah *banner* toko dan gambar produk ke *Appwrite Storage Bucket*.