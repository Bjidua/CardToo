# Project To Do List

## Fase 1: Slicing UI & Layout (Selesai)
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

## Fase 2: Clean Slate & TypeScript (Selesai)
- [x] **Store onboarding seller**: Rakit form onboarding dan verifikasi.
- [x] **Product CRUD seller**: Rakit Dashboard Seller, Manajemen Produk, dan Form Tambah Produk.
- [x] **Catalog buyer**: Product Detail, Checkout Page, Cart, Address Management, Store Profile, Review System.
- [x] **Order + Payment Status**: Slicing halaman pembayaran QRIS dan detail pesanan.
- [x] **Penghapusan Data Dummy**: Membersihkan seluruh data tiruan dari UI (Home, Store, Product, Checkout, Dashboard) untuk mencegah kebocoran data simulasi.
- [x] **TypeScript Fixes**: Menambahkan antarmuka (interfaces) yang kuat di seluruh komponen untuk mencegah tipe `any` dan `never`.
- [x] **Audit Kesiapan Backend**: Menganalisis kebutuhan skema koleksi untuk integrasi nyata.

## Fase 3: Integrasi Backend Appwrite (Sedang Berjalan)
- [x] **Sistem Auth**: Koneksi input form Login/Register ke Appwrite Auth dan sinkronisasi state nyata di `AuthContext`.
- [x] **Role Management**: Sistem upgrade user menjadi *Seller* dengan update `user_profiles` dan pembuatan row `stores`.
- [x] **Core Schema V1**: `user_profiles`, `stores`, `products` dan bucket inti Appwrite sudah siap dengan index serta permission dasar.
- [x] **Catalog & Seller Wiring V1**: Home, search, category, profile, store detail, product detail, seller onboarding, dashboard, dan CRUD produk sudah membaca/menulis Appwrite.
- [x] **Buyer Commerce Schema V1.5**: Table `addresses`, `cart_items`, `orders`, dan `order_items` Appwrite sudah dibuat lengkap dengan index query inti.
- [x] **Buyer Flow Wiring V1.5**: Cart, checkout, payment, daftar alamat, dan daftar pesanan buyer sudah membaca/menulis Appwrite nyata.
- [x] **Seller Order Wiring V1.6**: Dashboard seller, daftar pesanan seller, detail pesanan seller, dan tracking buyer sekarang membaca status order nyata dari Appwrite.
- [x] **Review Persistence V1.7**: Table `reviews`, submit ulasan, dan summary rating produk/toko sudah terhubung ke Appwrite.
- [x] **Messaging Persistence V1.8**: Inbox, room chat, percakapan buyer-seller, dan pengiriman pesan sudah terhubung ke Appwrite.
- [x] **Notification Persistence V1.9**: Halaman notifikasi dan event order/chat/review sudah terhubung ke Appwrite.
- [x] **Seller Analytics & Store Settings V2.0**: Laporan penjualan seller, detail transaksi, rating toko, dan update metadata banner/nama/deskripsi toko sudah membaca/menulis Appwrite nyata.
- [ ] **Data Fetching Lanjutan**: Migrasikan halaman tersisa yang masih memakai state placeholder ke data Appwrite nyata, terutama metadata profil toko minor dan area informasional non-transaksional.
- [ ] **Storage Integration Lanjutan**: Sambungkan upload avatar dan logo toko ke bucket Appwrite.
- [ ] **Permission Hardening Lanjutan**: Rapikan permission row/table untuk flow buyer-seller lanjutan setelah QA integrasi dasar selesai.

## Fase 4: Audit Kepatuhan UI Rules (14 Mei 2026)
- [x] Audit lint & build setelah refactor (`npm run lint`, `npm run build`) - status lulus.
- [x] Refactor pelanggaran typography (`font-black` ke `font-bold`) untuk konsistensi `design_system`.
- [x] Refactor pelanggaran strict shadow (hapus `shadow-[...]` arbitrary ke token design system).
- [x] Perbaikan form pattern prioritas di `seller/settings` (gunakan `label` prop pada `Input`).
- [x] Perbaikan global overlap footer putih: hapus `pb-32` paksa di `src/app/layout.tsx` agar halaman non-BottomNav (khususnya Auth) tidak ketutup area bawah.
- [ ] Lanjutan normalisasi label manual non-`Input` (textarea/upload section labels) secara bertahap lintas halaman sesuai template final UI.

## Fase 5: Hardening Rules Skala Industri (14 Mei 2026)
- [x] Upgrade `docs/AI/AGENTS.md` ke standar *industry scale* (arsitektur, quality gates, security, performance, documentation discipline).
- [x] Pertahankan sinkronisasi `docs/AI/CLAUDE.md` ke `@AGENTS.md`.
- [x] Tetapkan *Definition of Done* berbasis validasi teknis (scope, lint/build, kepatuhan design system, update docs).
- [ ] Sosialisasi rules baru ke seluruh contributor dan terapkan sebagai baseline review PR.

## Fase 6: Developer Test Utilities (14 Mei 2026)
- [x] Tambahkan fitur **God Mode (dev-only)** berbasis env flag untuk bypass guest lock saat QA/testing flow lintas fitur.
- [x] Tambahkan panel toggle internal (`DevGodModePanel`) yang hanya aktif di development + `NEXT_PUBLIC_ENABLE_GOD_MODE=true`.
- [x] Terapkan hard-stop keamanan production: God Mode auto nonaktif total di `NODE_ENV=production`.

## Fase 7: Audit Kepatuhan Repo (15 Mei 2026)
- [x] Hapus route duplikat anomali `src/app/collections/ [id]/page.tsx` dari tree App Router.
- [x] Rapikan page statis/auth sederhana agar lebih dekat ke aturan server-first dan tidak memakai handler client yang tidak perlu.
- [x] Normalisasi page-layer prioritas (`about`, `help`, `privacy`, `test-components`) ke token design system semantik.
- [x] Rapikan flow forgot-password agar positioning back button tetap mengikuti frame mobile di desktop.

## Fase 8: Audit Flow, Coverage, & Maintainability (18 Mei 2026)
- [x] Audit coverage Appwrite vs seluruh route utama dan identifikasi gap nyata pada profile, favorites, collections, dan route dummy lama.
- [x] Phase 1: Rapikan blocker flow nyata (`profile/edit`, `profile/settings`, `profile/security`) dan hapus route dummy `messages/[id]` yang tidak lagi dipakai.
- [x] Phase 2: Sambungkan fitur non-core yang masih placeholder ke Appwrite (`favorites`, `collections`, `collection_items`) dan pindahkan detail koleksi runtime ke route statis berbasis query param.
- [x] Phase 3: Jadikan halaman utility account lebih production-like (`security/password`, `security/devices`, `security/2fa`, `security/pin`, `payments`, `language`) tanpa CTA palsu dan link mati.
- [x] Phase 4A: Rapikan debt design-system pada shared components prioritas (`Button`, `Input`, `StickyHeader`, `AuthCard`, `SocialButton`, `MenuListItem`, `FavoriteItemCard`, `MessageCard`, `CategoryList`, `Separator`, `Checkbox`) dan auth pages utama.
- [x] Phase 5A: Hapus shim mati `src/lib/appwrite.js` dan finalkan inventory Appwrite + route audit matrix di dokumentasi.
- [x] Phase 4B: Hardening design-system debt lanjutan pada page/component legacy yang masih banyak memakai token `black/gray` mentah.
- [ ] Phase 5B: Maintainability sweep terakhir untuk helper/shape lokal tersisa dan finalisasi label `out of scope` per fitur minor.
