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

## 🧾 Fase 4: Audit Kepatuhan UI Rules (14 Mei 2026)
- [x] Audit lint & build setelah refactor (`npm run lint`, `npm run build`) — status lulus.
- [x] Refactor pelanggaran typography (`font-black` ➜ `font-bold`) untuk konsistensi `design_system`.
- [x] Refactor pelanggaran strict shadow (hapus `shadow-[...]` arbitrary ➜ token design system).
- [x] Perbaikan form pattern prioritas di `seller/settings` (gunakan `label` prop pada `Input`).
- [x] Perbaikan global overlap footer putih: hapus `pb-32` paksa di `src/app/layout.tsx` agar halaman non-BottomNav (khususnya Auth) tidak ketutup area bawah.
- [ ] Lanjutan normalisasi label manual non-`Input` (textarea/upload section labels) secara bertahap lintas halaman sesuai template final UI.

## 🏭 Fase 5: Hardening Rules Skala Industri (14 Mei 2026)
- [x] Upgrade `docs/AI/AGENTS.md` ke standar *industry scale* (arsitektur, quality gates, security, performance, documentation discipline).
- [x] Pertahankan sinkronisasi `docs/AI/CLAUDE.md` ➜ `@AGENTS.md`.
- [x] Tetapkan *Definition of Done* berbasis validasi teknis (scope, lint/build, kepatuhan design system, update docs).
- [ ] Sosialisasi rules baru ke seluruh contributor dan terapkan sebagai baseline review PR.

## 🧪 Fase 6: Developer Test Utilities (14 Mei 2026)
- [x] Tambahkan fitur **God Mode (dev-only)** berbasis env flag untuk bypass guest lock saat QA/testing flow lintas fitur.
- [x] Tambahkan panel toggle internal (`DevGodModePanel`) yang hanya aktif di development + `NEXT_PUBLIC_ENABLE_GOD_MODE=true`.
- [x] Terapkan hard-stop keamanan production: God Mode auto nonaktif total di `NODE_ENV=production`.
- [ ] Lanjutkan cleanup route anomali `/collections/ [id]` setelah utilitas testing stabil.

## Fase 7: Audit Kepatuhan Repo (15 Mei 2026)
- [x] Hapus route duplikat anomali `src/app/collections/ [id]/page.tsx` dari tree App Router.
- [x] Rapikan page statis/auth sederhana agar lebih dekat ke aturan server-first dan tidak memakai handler client yang tidak perlu.
- [x] Normalisasi page-layer prioritas (`about`, `help`, `privacy`, `test-components`) ke token design system semantik.
- [x] Rapikan flow forgot-password agar positioning back button tetap mengikuti frame mobile di desktop.
