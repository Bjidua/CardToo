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
- [x] **Tech Debt (Saran Audit)**: Refactor `StickyHeader` berulang di Profile, Collections, dan Messages menjadi satu komponen *reusable* di `components/layout/`.

## ⚙️ Fase 2: Logic & Integrasi Backend
- [ ] **Sistem Auth**: Koneksi input form Login/Register ke Appwrite.
- [ ] **Role Management**: Sistem upgrade user menjadi *Seller*.
- [ ] **Global State**: Ubah dummy data (koleksi, pesan, order status) menjadi Global State (Zustand/Context) sebelum digabung dengan API.

## 🛒 Fase 3: Fitur Marketplace Inti
- [ ] Store onboarding seller
- [ ] Product CRUD seller
- [ ] Catalog buyer (list/detail/search)
- [ ] Cart + checkout
- [ ] Order + payment status