#### 📅 Update: 14 Mei 2026 (Sesi Dev God Mode Utility untuk QA Internal)
**Waktu Eksekusi:** Siang (14:20 WIB)


#### Update: 15 Mei 2026 (Sesi Audit Kepatuhan Repo & Design System)
**Waktu Eksekusi:** Malam

**1. Perbaikan Arsitektur & Routing**
- Menghapus route duplikat anomali pada path `src/app/collections/ [id]/page.tsx` yang sebelumnya memicu route build tidak valid `/collections/ [id]`.
- Merapikan beberapa halaman sederhana agar tidak bergantung pada client handler yang tidak diperlukan (`login`, `register`, `forgot-password`, `reset`, `about`, `help`, `privacy`).

**2. Normalisasi Design System**
- Menyelaraskan page-layer prioritas ke token semantik project:
  - `src/app/about/page.tsx`
  - `src/app/help/page.tsx`
  - `src/app/privacy/page.tsx`
  - `src/app/test-components/page.tsx`
- Mengurangi penggunaan warna mentah `gray` / `black` pada halaman demo dan halaman informasional agar lebih konsisten dengan `globals.css` dan `docs/design_system`.
- Mengganti input manual pada halaman bantuan dengan komponen `Input` reusable sesuai aturan project.

**3. Konsistensi Flow Auth**
- Menyesuaikan halaman forgot-password agar tombol back tetap mengikuti frame mobile saat dibuka di desktop.
- Membersihkan callback debug `console.log` pada halaman verifikasi forgot-password.

**4. Validasi**
- `npm run lint` - lulus

---
**🧪 1. Implementasi God Mode (Development Only)**
- Menambahkan mode bypass auth internal di `src/context/AuthContext.tsx` untuk kebutuhan QA flow tanpa login berulang.
- God Mode dikunci ketat dengan 2 lapis guard:
  - `NODE_ENV !== "production"`
  - `NEXT_PUBLIC_ENABLE_GOD_MODE === "true"`
- Jika salah satu syarat tidak terpenuhi, mode otomatis nonaktif (hard-stop production-safe).

**🧩 2. Panel Kontrol Internal**
- Menambahkan `src/components/layout/DevGodModePanel.tsx` sebagai panel toggle cepat untuk tim dev.
- Panel hanya dirender saat environment development + env flag aktif.
- Panel di-inject pada root `src/app/layout.tsx` agar berlaku global lintas route.

**🔐 3. Dampak ke Auth Guard**
- `isGuest`, `isAuthenticated`, dan `isSeller` kini memakai `effectiveAuth` berbasis `useMemo`:
  - Saat God Mode aktif: dianggap authenticated + seller access untuk simulasi jalur fitur.
  - Saat nonaktif: kembali murni ke status login normal.
- Tidak ada hardcode secret/token tambahan; seluruh state disimpan lokal untuk sandbox dev.

---

#### 📅 Update: 14 Mei 2026 (Sesi Audit Root Cause Footer Putih Menutupi Konten Auth)
**Waktu Eksekusi:** Siang (13:52 WIB)

**🔍 1. Root Cause Analysis (Global Layout)**
- Ditemukan akar masalah di `src/app/layout.tsx` pada wrapper konten utama:
  - `<main className="flex-1 flex flex-col relative pb-32">`
- `pb-32` global tersebut selalu menambah ruang bawah besar, termasuk pada halaman yang **tidak menampilkan** `BottomNav` (contoh: Auth).
- Efek samping di viewport mobile:
  - area bawah terlihat seperti “footer putih”
  - link penting (Sign Up / Log in / CTA bawah) terdorong dan tampak tertutup/terpotong.

**🛠️ 2. Perbaikan Implementasi**
- Menghapus padding bawah global paksa:
  - dari: `pb-32`
  - menjadi: tanpa padding bawah tambahan (`<main className="flex-1 flex flex-col relative">`)
- Dampak:
  - halaman Auth (`/login`, `/register`, `/forgot-password`) kembali punya alur vertikal natural tanpa tertutup area kosong bawah.
  - halaman lain tidak lagi mewarisi spacing bawah yang tidak relevan.

**✅ 3. Validasi**
- Menjalankan `npm run lint` dengan hasil **lulus** (tanpa error lint baru).
- Verifikasi visual berdasarkan kasus yang dilaporkan: komponen bawah pada auth tidak lagi terdorong ke area tertutup.

---

#### 📅 Update: 14 Mei 2026 (Sesi Hardening Rules AI Skala Industri)
**Waktu Eksekusi:** Siang (13:35 WIB)

**📘 1. Upgrade Rules Utama AI Agent**
- File `docs/AI/AGENTS.md` direstruktur total menjadi standar **industry scale**.
- Menambahkan pilar aturan enterprise:  
  - Session bootstrap & context discipline  
  - Workflow eksekusi terukur  
  - Strict Next.js architecture boundary  
  - Component reuse governance  
  - Design system governance  
  - Security/privacy hygiene  
  - Performance & UX standards  
  - Quality gates (Definition of Done)  
  - Documentation/changelog discipline  
  - Anti-patterns & prioritas saat konflik

**🔗 2. Sinkronisasi Referensi CLAUDE**
- Verifikasi `docs/AI/CLAUDE.md` tetap mengarah ke `@AGENTS.md` (single source of truth rules).
- Tidak diperlukan perubahan isi karena sudah sesuai pola referensi yang benar.

**🗂️ 3. Sinkronisasi Tracking Progress**
- Menambahkan seksi baru di `docs/to-do.md`:  
  `## 🏭 Fase 5: Hardening Rules Skala Industri (14 Mei 2026)`
- Menandai task hardening rules sebagai selesai, menyisakan item sosialisasi contributor sebagai tindak lanjut.

---

#### 📅 Update: 14 Mei 2026 (Sesi Audit Kepatuhan Rules & Stabilitas Build)
**Waktu Eksekusi:** Siang (13:20 WIB)

**✅ 1. Re-Audit Kepatuhan Styling & Typography**
- Menjalankan refactor lanjutan untuk memastikan kepatuhan pada rule `STRICT TAILWIND STYLING` di `docs/AI/AGENTS.md`.
- Normalisasi penggunaan `font-black` menjadi `font-bold` pada area yang terdampak audit.
- Normalisasi nilai bayangan *arbitrary* `shadow-[...]` ke token design system (`shadow-soft`, `shadow-medium`, `shadow-inner`).

**✅ 2. Validasi Teknis Project (Gate Check)**
- Menjalankan `npm run lint` dengan hasil **lulus** (tanpa error lint baru).
- Menjalankan `npm run build` dengan hasil **lulus** (compile, TypeScript, dan prerender routes sukses).

**✅ 3. Perbaikan Form Pattern Prioritas**
- Melakukan sinkronisasi form di `src/app/seller/settings/page.tsx` agar field berbasis `Input` menggunakan `label` prop bawaan komponen (bukan label manual eksternal untuk field tersebut).
- Menjaga konsistensi dengan template komponen reusable yang sudah ada.

**📝 4. Dokumentasi Progress**
- Update status audit ditambahkan ke `docs/to-do.md` pada seksi baru: **Fase 4: Audit Kepatuhan UI Rules (14 Mei 2026)**.
- Menandai item lint/build, typography, strict shadow, dan perbaikan form prioritas sebagai selesai.

---

#### 📅 Update: 14 Mei 2026 (Sesi Full Codebase Audit & Cleanup)
**Waktu Eksekusi:** Dini Hari (02:30 WIB)

**🔍 1. Full Codebase Audit (Pre-Backend Integration)**
- Melakukan audit menyeluruh terhadap seluruh codebase (50+ file) sebelum integrasi Appwrite.
- Membuat laporan temuan lengkap (Kritis, Sedang, Info).

**🧬 2. TypeScript: Centralized Types (`src/types/index.ts`)** [NEW]
- Membuat file tipe sentral berisi semua interface entity: `Product`, `Store`, `Order`, `SellerOrder`, `CartItem`, `ChatContact`, `ChatMessage`, `NotificationItem`, `NotificationGroup`, `Collection`, `FavoriteItem`, `Address`, `TransactionDetail`, `Device`.
- Mengganti **9 instance** `any[]` dan `any` yang tersebar di 9 file berbeda dengan tipe eksplisit dari file sentral ini.

**🧹 3. Data Dummy Purge (Round 2)**
- Membersihkan 5 file yang masih menyimpan data dummy aktif:
  - `ChatClient.tsx` (4 pesan palsu)
  - `messages/[id]/page.tsx` (7 user palsu)
  - `seller/reports/detail/page.tsx` (3 transaksi palsu)
  - `profile/security/devices/page.tsx` (2 perangkat palsu)
  - `search/page.tsx` ("Pokemon Official Store" hardcoded)
  - `seller/products/edit/[id]/EditProductClient.tsx` (3 mock produk)

**🛡️ 4. Native App Feel: Hapus alert() Browser**
- Menghapus **7 instance** `alert()` native dari seluruh codebase:
  - `seller/dashboard/page.tsx`, `seller/settings/page.tsx`, `seller/orders/page.tsx`
  - `seller/products/add/page.tsx`, `seller/products/edit/[id]/EditProductClient.tsx`
  - `orders/[id]/review/ReviewClient.tsx`
- Diganti dengan `// TODO` untuk integrasi komponen Toast UI saat backend siap.

**🎨 5. Design System Compliance**
- Menghapus hardcoded values: rating "4.9" dan waktu balas "± 5 Menit" di `seller/settings/page.tsx`.
- Menghapus file sampah `temp.js`.

---

#### 📅 Update: 13 Mei 2026 (Sesi UI Re-Architecture - Premium Product Detail)
**Waktu Eksekusi:** Sesi Malam (22:50 WIB)

**✨ 1. Premium Product Detail (Buyer POV)**
- **`src/app/product/[id]/ProductDetailClient.tsx`**
  - *Features:* Implementasi halaman detail produk TCG premium dengan image carousel (Dots indicator), pricing logic (diskon & strike-through), dan stock info.
  - *TCG Specific:* Menambahkan seksi "Grading Details" khusus untuk kartu TCG bersertifikat (ARS Japan) dan grid rincian spesifikasi kartu.
  - *Interactive:* Implementasi sistem akordion menggunakan `framer-motion` untuk Deskripsi dan Info Pengiriman.
  - *Logic:* Memfungsikan tombol Chat (navigasi ke ChatRoom Seller), "Add to Cart" (Direct Navigation ke Cart Page), "Buy Now" (navigasi ke Checkout Page), dan Checkout pada Cart.
  - *Navigation:* Sinkronisasi dengan `StickyHeader` varian "Detail Produk" dan penambahan fitur Share & Favorite.
  - *Action Bar:* Implementasi fixed bottom bar dengan chat button, "Add to Cart", dan "Buy Now" sesuai standar industri.

**✨ 2. Premium Checkout Page (Buyer POV)**
- **`src/app/checkout/page.tsx`** [NEW]
  - *Features:* Alur checkout satu halaman yang mencakup:
    - Alamat Pengiriman (Card Style).
    - Review Pesanan (Item Details).
    - Opsi Pengiriman (Reguler/Ekspres dengan estimasi).
    - Metode Pembayaran (VA & E-Wallet dengan seleksi interaktif).
    - Summary Biaya (Subtotal, Ongkir, Biaya Layanan).
  - *UX:* Desain "Native App Feel" dengan pemilihan item yang reaktif dan visual footer summary yang melayang.

**💳 3. QRIS Payment System (Buyer POV)**
- **`src/app/checkout/payment/page.tsx`** [NEW]
  - *Features:* Halaman pembayaran QRIS mandiri dengan:
    - Countdown Timer (24h) dengan visual progress bar merah.
    - Status Badge (Menunggu Pembayaran).
    - QRIS Card dengan integrasi gambar QR dan instruksi langkah-demi-langkah.
    - Total Tagihan yang jelas dan terformat.
  - *Interactivity:* Fitur "Simpan ke Galeri" dan "Saya Sudah Bayar" (Direct navigation ke Order History).
  - *UI/UX:* Mengadopsi referensi industri dengan layout clean, tipografi bold, dan elemen visual yang memandu pengguna secara intuitif.

**🏠 4. Address Management (`/profile/address`)** [UPGRADED]
- *Features:* Daftar alamat dengan kartu radius 32px, indikator "Utama", dan tombol "Konfirmasi Alamat" yang melayang.
- *Integration:* Terhubung dengan tombol "Ubah" di halaman Checkout.

**🏪 5. Store Profile (`/store/[id]`)** [NEW]
- *Features:* Header banner dinamis, statistik toko (rating, followers), dan katalog produk seller dalam grid.
- *Integration:* Terhubung melalui nama toko di halaman Detail Produk.

**⭐ 6. Review System (`/orders/[id]/review`)** [NEW]
- *Features:* Pemilihan rating bintang interaktif (1-5), input ulasan teks, dan simulasi unggah foto.
- *Integration:* Terhubung melalui tombol "Nilai" pada pesanan dengan status "Selesai".

**📜 2. Rules Compliance & Updates**
- Mengikuti mandat `docs/AI/AGENTS.md` untuk mencatat progres di setiap sesi.
- **Database Simulation:** Mengimplementasikan **Dummy Data Engine** untuk `ProductDetailClient`, memisahkan data (Logic) dari tampilan (UI).
- **Rules Update:** Menambahkan aturan **DUMMY DATA ENGINE** ke `docs/AI/AGENTS.md` sebagai standar proyek.
- Penggunaan `mx-auto max-w-[440px]` untuk konsistensi layout mobile di layar lebar.
- Menggunakan variabel CSS semantik (`primary`, `secondary`, `surface-muted`) tanpa hardcoded hex.

---

Urutan terbaik sekarang:

Auth + role dulu
Store onboarding seller
Product CRUD seller
Catalog buyer (list/detail/search)
Cart + checkout
Order + payment status
Alasannya: semua fitur marketplace nempel ke identitas user. Kalau auth/role belum jadi, fitur lain bakal banyak bongkar ulang.

Kita mulai Flow Auth & Role (yang paling minimal tapi scalable).

Flow target
User register/login via Appwrite Auth.
Setelah register, buat row users_profile.
Default role buyer.
User bisa “upgrade jadi seller”.
Middleware/blok akses halaman berdasarkan role.
Struktur yang perlu kalian bikin dulu di codebase
src/lib/appwrite/client.ts
src/lib/appwrite/server.ts
src/lib/auth.ts
src/lib/roles.ts
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/app/(seller)/onboarding/page.tsx
src/middleware.ts

---

### 📝 PROGRESS LOG & TECH NOTES

**🛠️ 3. Typography Overhaul (Design System Compliance)**
- *Modern Font:* Implementasi font **Outfit** (Google Fonts) via `next/font/google` menggantikan font sistem default (Arial).
- *Header Standardization:* Menyesuaikan berat font dari `font-black` ke `font-bold` dan ukuran font ke standard 24px (H1) & 20px (H2) sesuai `typography-spacing.md`.
- *Global Cleanup:* Menghapus hardcoded font family di `globals.css` untuk memastikan konsistensi font di seluruh aplikasi.

**🧹 4. Full UI Components Audit & Refactoring**
- *Strict Tailwind:* Menghapus ratusan *hardcoded* HEX colors (`#4CB6C4`, `#E9E9E9`, `#FAFAFA`, dll) dari semua `src/components/ui/` dan menggunakan variabel standar (`text-primary`, `bg-surface-hover`).
- *Shadow Standard:* Mengganti nilai *arbitrary shadow* (`shadow-[0px_4px_4px_...]`) menjadi standard design system (`shadow-soft`, `shadow-medium`).
- *Rule Upgrades:* Memperbarui `docs/design_system/typography-spacing.md` untuk melegalkan desain modern (pill-shape radius 24px-26px).
- *Architectural Upgrades:* Memperbarui `docs/AI/AGENTS.md` dengan larangan keras menggunakan *arbitrary UI values* dan mandat ketat penggunaan *Server Components* untuk Next.js App Router menuju standar *Production*.

---

#### 📅 Update: 6 Mei 2026 (Sesi UI Re-Architecture - Header & Search)
**Waktu Eksekusi:** Sesi Malam (01:17 WIB)

**🛠️ 1. Diversifikasi Header (`StickyHeader`)**
- *Variants System:* Menambahkan 3 varian: `logo` (Premium with pattern), `minimal` (Clean glass), dan `solid`.
- *Aesthetic Improvement:* Varian `logo` kini memiliki glow radial, gradient mask, dan scale effect untuk tampilan lebih premium.
- *Size Options:* Menambahkan prop `size` (`sm` h:72px, `lg` h:140px) untuk fleksibilitas antar halaman utama dan sub-halaman.

**🛠️ 2. Functional Search Filter**
- *Logic:* Implementasi filter berdasarkan kondisi kartu (Mint, Near Mint, dll) dan rentang harga (Min-Max) menggunakan `useMemo`.
- *UI Drawer:* Menambahkan bottom drawer animasi untuk pemilihan filter yang responsif dan mengikuti standar mobile apps modern.
- *Sticky Fix:* Penyesuaian posisi sticky input agar sinkron dengan perubahan tinggi header baru.

---

#### 📅 Update: 6 Mei 2026 (Sesi UX Improvement - Sticky Search)
**Waktu Eksekusi:** Sesi Malam (01:09 WIB)

**🛠️ 1. Sticky Search & Filters**
- **`src/app/messages/page.tsx`**
  - *UX Fix:* Bar pencarian dan tab filter sekarang menjadi **sticky** (menempel) di bawah header saat di-scroll.
  - *Visual:* Menambahkan efek `backdrop-blur-md` dan gradien background agar konten pesan yang lewat di bawahnya tetap terlihat elegan namun tidak mengganggu keterbacaan input.

---

#### 📅 Update: 6 Mei 2026 (Sesi UI Correction - MessageCard)
**Waktu Eksekusi:** Sesi Malam (01:08 WIB)

**🛠️ 1. MessageCard Responsiveness**
- **`src/components/ui/MessageCard.tsx`**
  - *Fix:* Menghapus batasan lebar (`max-w-[361px]`) dan tinggi (`h-[91px]`) yang kaku. Sekarang kartu pesan akan mengisi seluruh lebar kontainer yang tersedia secara dinamis. Hal ini memperbaiki masalah kartu yang terlihat kekecilan atau tidak simetris pada daftar pesan.

---

#### 📅 Update: 6 Mei 2026 (Sesi UI Correction - Chat Input)
**Waktu Eksekusi:** Sesi Malam (01:06 WIB)

**🛠️ 1. Chat Input Mobile Standard**
- **`src/components/chat/ChatClient.tsx`**
  - *Fix:* Mengatur bar input pesan agar mengikuti standar lebar mobile (`max-w-[440px]`) dan rata tengah. Sebelumnya bar input meluas ke seluruh lebar layar (full-width) yang merusak estetika desain mobile-first.

---

#### 📅 Update: 6 Mei 2026 (Sesi Next.js Architecture Fix - Messages)
**Waktu Eksekusi:** Sesi Malam (01:04 WIB)

**🏗️ 1. Server/Client Component Split**
- **`src/app/messages/[id]/page.tsx`**: Diubah menjadi **Server Component** murni agar bisa mengekspor `generateStaticParams()` sesuai aturan Next.js (Static Export).
- **`src/components/chat/ChatClient.tsx`**: Logika interaktif (state, hooks, motion) dipindahkan ke komponen klien terpisah.
  - *Result:* Memperbaiki error `Next.js can't recognize generateStaticParams in a client component`.

---

#### 📅 Update: 6 Mei 2026 (Sesi Static Export Fix - Messages)
**Waktu Eksekusi:** Sesi Malam (01:03 WIB)

**🛠️ 1. Static Export Compatibility**
- **`src/app/messages/[id]/page.tsx`**
  - *Fix:* Menambahkan fungsi `generateStaticParams()` agar Next.js bisa melakukan build statis pada route dinamis.
  - *Improvement:* Menggunakan data dummy `DUMMY_CHATS` sebagai database simulasi sehingga judul chat berubah sesuai dengan user yang diklik di halaman daftar pesan.

---

#### 📅 Update: 6 Mei 2026 (Sesi Messaging System - POV Buyer)
**Waktu Eksekusi:** Sesi Malam (01:01 WIB)

**💬 1. Messages List Refinement**
- **`src/app/messages/page.tsx`**
  - *Features:* Menambahkan fitur pencarian pesan dan filter (Semua, Belum Dibaca).
  - *Interactivity:* Implementasi link navigasi ke detail chat menggunakan ID pesan.
  - *Empty State:* Menambahkan visual "Pesan Tidak Ditemukan" untuk user experience yang lebih baik.

**💬 2. Chat Room Interface**
- **`src/app/messages/[id]/page.tsx`**
  - *Layout:* Header dengan info toko, area pesan scrollable, dan input bar melayang (floating).
  - *Bubbles:* Desain bubble chat yang premium (Primary color untuk user, White untuk store) dengan sistem "rounding" yang membedakan pengirim.
  - *Logic:* Fitur kirim pesan real-time (frontend state) dengan fitur auto-scroll ke pesan terbaru.

---

#### 📅 Update: 6 Mei 2026 (Sesi Component Lab Bugfix)
**Waktu Eksekusi:** Sesi Malam (01:00 WIB)

**🛠️ 1. Component Lab Fix**
- **`src/app/test-components/page.tsx`**
  - *Bugfix:* Memperbaiki passing props pada `OrderItemCard`. Sebelumnya props dikirim secara individual, sedangkan komponen mengharapkan satu objek `order`. Hal ini menyebabkan runtime error `shopName of undefined`.
  - *Verification:* Menyelaraskan seluruh data dummy di katalog komponen agar sesuai dengan interface terbaru.

---

#### 📅 Update: 6 Mei 2026 (Sesi Component Lab Update)
**Waktu Eksekusi:** Sesi Malam (00:59 WIB)

**🧪 1. Component Lab (Katalog UI)**
- **`src/app/test-components/page.tsx`**
  - *Update:* Menambahkan koleksi komponen baru ke dalam lab: `MenuListItem`, `FavoriteItemCard`, `OrderItemCard`, dan `CartItemCard`.
  - *Organization:* Membuat kategori baru untuk "Profile & Settings", "Shopping", dan "Orders" agar katalog tetap rapi seiring bertambahnya komponen.

---

#### 📅 Update: 6 Mei 2026 (Sesi Explicit Navigation Fix)
**Waktu Eksekusi:** Sesi Malam (00:57 WIB)

**🛠️ 1. Explicit Back Navigation**
- **`src/app/onboarding/seller/page.tsx`**
  - *Fix:* Mengganti penggunaan `router.back()` (default) dengan `router.push("/profile")` pada Step 0. Hal ini menjamin pengguna selalu kembali ke halaman profil meskipun riwayat browser tidak tersedia atau terhapus.

---

#### 📅 Update: 6 Mei 2026 (Sesi Navigation Fix - BackButton)
**Waktu Eksekusi:** Sesi Malam (00:56 WIB)

**🛠️ 1. BackButton Flexibility**
- **`src/components/ui/BackButton.tsx`**
  - *Fix:* Mengubah `onClick` agar lebih fleksibel. Sekarang komponen ini akan menggunakan `onClick` custom jika diberikan, atau otomatis menggunakan `router.back()` jika tidak ada prop `onClick`.
- **`src/app/onboarding/seller/page.tsx`**
  - *Logic Fix:* Memperbaiki navigasi balik pada pendaftaran penjual. Jika di Step 0, tombol back akan kembali ke profil. Jika di Step 1-3, tombol back akan kembali ke tahap sebelumnya.

---

#### 📅 Update: 6 Mei 2026 (Sesi Stepper UI Correction)
**Waktu Eksekusi:** Sesi Malam (00:55 WIB)

**🏗️ 1. Stepper UI Fix**
- **`src/app/onboarding/seller/page.tsx`**
  - *Fix:* Mengganti sistem garis stepper dari `absolute` dengan unit `vw` menjadi flex-based. Hal ini mencegah garis "balapan" keluar dari batas layar (horizontal overflow) pada perangkat mobile.
  - *Animation:* Menambahkan animasi pengisian garis yang halus saat user berpindah antar step.

---

#### 📅 Update: 6 Mei 2026 (Sesi Seller Registration - Industry Scale)
**Waktu Eksekusi:** Sesi Malam (00:52 WIB)

**🏬 1. Seller Onboarding Flow**
- **`src/app/onboarding/seller/page.tsx`**
  - *Multi-Step Experience:* Implementasi 4 tahap pendaftaran (Welcome -> Info Toko -> KYC -> Success).
  - *Industry Standard:* Menambahkan fitur verifikasi identitas (KYC) dengan upload foto KTP dan Selfie, serta input NIK.
  - *Store Branding:* Input nama toko, deskripsi, dan upload logo toko.
  - *Premium UI:* Menggunakan Stepper dinamis dengan progress bar, animasi `AnimatePresence` antar langkah, dan komponen `BenefitItem` untuk meningkatkan conversion rate pendaftaran.

**📜 2. Rules Compliance**
- Menggunakan komponen global `Input`, `Button`, `Icons`, dan `StickyHeader` secara maksimal.

---

#### 📅 Update: 5 Mei 2026 (Sesi Full Settings Completion)
**Waktu Eksekusi:** Sesi Malam (00:48 WIB)

**⚙️ 1. Completion Sub-Pages Settings**
- **`src/app/profile/language/page.tsx`**: Halaman pemilihan bahasa dengan visual indikator pilihan yang interaktif.
- **`src/app/privacy/page.tsx`**: Halaman kebijakan privasi dengan desain tipografi yang bersih untuk teks hukum.
- **`src/app/about/page.tsx`**: Halaman info aplikasi dengan branding logo, versi aplikasi, dan link sosial media resmi.

**📜 2. Architectural Integrity**
- Semua halaman baru sudah terintegrasi dengan `StickyHeader` responsif yang baru diperbaiki.
- Konsistensi komponen global (`MenuListItem`, `Icons`, `BackButton`) terjaga 100%.

---

#### 📅 Update: 5 Mei 2026 (Sesi Header Polish & Full Security Slicing)
**Waktu Eksekusi:** Sesi Malam (00:46 WIB)

**🏗️ 1. Responsive Header Polish**
- **`src/components/layout/StickyHeader.tsx`**
  - *Improvement:* Judul header sekarang responsif terhadap panjang karakter. Jika judul panjang (seperti "Keamanan & Password"), font size otomatis mengecil agar tidak wrapping berantakan.
  - *Layout:* Memperbaiki flex ratio agar judul tetap di tengah tanpa tertutup tombol back.

**🔐 2. Full Security Sub-Pages**
- **`src/app/profile/security/2fa/page.tsx`**: Fitur Verifikasi 2 Langkah dengan toggle status dan daftar metode (SMS/App).
- **`src/app/profile/security/pin/page.tsx`**: UI input 6 digit PIN transaksi dengan auto-focus logic.
- **`src/app/profile/security/devices/page.tsx`**: Daftar perangkat terhubung lengkap dengan fitur "Logout dari Semua Perangkat".

---

#### 📅 Update: 5 Mei 2026 (Sesi Security & Password)
**Waktu Eksekusi:** Sesi Malam (00:43 WIB)

**🔐 1. Keamanan & Password (E-commerce Standard)**
- **`src/app/profile/security/page.tsx`**: Menambah fitur keamanan industri seperti Verifikasi Dua Langkah (2FA) dan Riwayat Aktivitas Login.
- **`src/app/profile/security/password/page.tsx`**: Slicing halaman Ganti Password dengan form validasi (Current Password, New Password, Confirm) dan fitur Show/Hide password.
- **Logic:** Implementasi state `showPassword` dan pemisahan kategori antara Autentikasi Utama dan Akses Perangkat.

---

#### 📅 Update: 5 Mei 2026 (Sesi UI Standard Correction - Address)
**Waktu Eksekusi:** Sesi Malam (00:41 WIB)

**🎨 1. Perbaikan Standar Tombol**
- **`src/app/profile/address/page.tsx`**
  - *Fix:* Mengubah tombol "Tambah Alamat Baru" dari `fullWidth` menjadi proporsional (centered) sesuai standar navigasi utama project. 
  - *UX:* Memberikan padding `px-12` dan tinggi `h-[58px]` agar tombol terasa lebih solid dan premium sebagai *Floating Action Button*.

---

#### 📅 Update: 5 Mei 2026 (Sesi Full Settings Functionality)
**Waktu Eksekusi:** Sesi Malam (00:39 WIB)

**🛠 1. Slicing Sub-Pages Settings**
- **`src/app/profile/edit/page.tsx`**: Halaman edit profil dengan form input (Nama, Email, HP) dan fitur ganti avatar.
- **`src/app/profile/address/page.tsx`**: Manajemen alamat pengiriman dengan label "Default" dan animasi list.
- **`src/app/profile/security/page.tsx`**: Menu keamanan terpusat (Ganti Password, PIN, Biometrik).
- **`src/app/profile/payments/page.tsx`**: Halaman manajemen rekening bank dan kartu pembayaran.
- **`src/app/help/page.tsx`**: Pusat bantuan dengan fitur pencarian dan topik populer.

**✨ 2. Functional Improvements**
- Semua halaman menggunakan `StickyHeader` dan `BackButton` yang konsisten.
- Menggunakan `AnimatePresence` untuk transisi list alamat yang smooth.
- Integrasi penuh dengan komponen `Input` dan `Button` global.

---

#### 📅 Update: 5 Mei 2026 (Sesi Refactor & Strict Rules)
**Waktu Eksekusi:** Sesi Malam (00:36 WIB)

**🛠 1. Refactor Component Template**
- **`src/components/ui/MenuListItem.tsx`**
  - *New Component:* Mengekstrak pola menu list yang berulang dari Profile dan Settings menjadi komponen global yang reusable. Mendukung icon, label, subValue, dan link/button mode.
- **`src/app/profile/settings/page.tsx`**
  - *Fix:* Mengganti tombol Logout manual dengan `<Button variant="danger">` sesuai template yang sudah ada. Menggunakan `MenuListItem` global.
- **`src/app/profile/page.tsx`**
  - *Cleanup:* Menggunakan `MenuListItem` global dan menghapus definisi internal untuk mencegah redundansi kode.

**📜 2. Update Rules**
- **`docs/AI/AGENTS.md`**
  - *Strict Rules:* Menambahkan aturan wajib cek `src/components/ui` sebelum coding dan larangan keras duplikasi styling jika template sudah tersedia.

---

#### 📅 Update: 5 Mei 2026 (Sesi E-commerce Settings Page)
**Waktu Eksekusi:** Sesi Malam (00:33 WIB)

**⚙️ 1. Halaman Settings (Full Experience)**
- **`src/app/profile/settings/page.tsx`**
  - *Structure:* Membagi pengaturan menjadi 3 kategori utama (Akun & Keamanan, Pengaturan, Bantuan & Info).
  - *Interactive Elements:* Menambahkan custom **Toggle Switch** dengan animasi Framer Motion untuk pengaturan notifikasi.
  - *Visual:* Menggunakan kartu-kartu berkelompok dengan shadow lembut dan divider yang tipis sesuai estetika premium.
  - *Red Action:* Tombol Logout diberikan visual khusus dengan warna merah (danger) untuk mencegah kesalahan klik.
- **`src/components/ui/Icons.tsx`**
  - *Library:* Menambahkan icon `Logout`, `Lock`, `MapPin`, `CreditCard`, `Help`, dan `Info`.

---

#### 📅 Update: 5 Mei 2026 (Sesi My Favorite / Wishlist)
**Waktu Eksekusi:** Sesi Malam (00:30 WIB)

**💖 1. Halaman My Favorite (Wishlist)**
- **`src/app/profile/favorites/page.tsx`**
  - *UI:* Implementasi daftar wishlist dengan kartu produk horizontal yang bersih dan premium.
  - *Interactivity:* Fitur hapus favorit dengan animasi `AnimatePresence` (popLayout) yang sangat halus.
  - *Quick Action:* Menambahkan tombol "Add to Cart" langsung dari wishlist untuk meningkatkan konversi belanja.
- **`src/components/ui/FavoriteItemCard.tsx`**
  - *Component:* Kartu wishlist khusus dengan shadow yang lembut, shop name icon, dan layout yang dioptimalkan untuk mobile.

---

#### 📅 Update: 5 Mei 2026 (Sesi UI Polish - Orders)
**Waktu Eksekusi:** Sesi Malam (00:35 WIB)

**✨ 1. Refined Order Interface**
- **`src/app/orders/page.tsx`**
  - *Sub-Filters:* Memperhalus tampilan sub-filter dengan background `white/60` yang memiliki efek `backdrop-blur-xl` (glassmorphism).
  - *Sticky Logic:* Menyesuaikan posisi sticky sub-filter ke `top-[120px]` agar pas berada di bawah `StickyHeader`.
  - *Typography:* Meningkatkan kontras warna teks (Active vs Inactive) agar lebih mudah dibaca.
  - *Empty State:* Menambahkan efek animasi pulse pada elemen dekoratif di "No Orders" state agar UI terasa lebih "hidup".

---

#### 📅 Update: 5 Mei 2026 (Sesi Shopee Sub-Filters)
**Waktu Eksekusi:** Sesi Malam (00:30 WIB)

**⚙️ 1. Sub-Filter Status Order (Shopee Style)**
- **`src/app/orders/page.tsx`**
  - *Hybrid UI:* Menggabungkan desain Pill Tabs (Order/History) dengan sub-filter horizontal di bawahnya.
  - *Contextual Filtering:* Sub-filter berubah secara dinamis:
    - Tab **Order** menampilkan: `Semua`, `Belum Bayar`, `Dikemas`, `Dikirim`.
    - Tab **History** menampilkan: `Semua`, `Selesai`, `Dibatalkan`.
  - *Deep Linking:* Integrasi dengan `useSearchParams` sehingga navigasi dari menu Profil (misal klik icon "Dikirim") akan langsung mengaktifkan tab dan sub-filter yang sesuai.

---

#### 📅 Update: 5 Mei 2026 (Sesi Profile Menu Cleanup)
**Waktu Eksekusi:** Sesi Malam (00:27 WIB)

**🧹 1. Optimasi Menu Profil**
- **`src/app/profile/page.tsx`**
  - *Cleanup:* Menghapus menu "My Activity" sesuai instruksi Tuan.
  - *Reordering:* Menyusun ulang menu berdasarkan skala prioritas/kepentingan pengguna:
    1. **My Favorite**: Prioritas utama untuk akses koleksi yang disimpan.
    2. **Register as Seller**: Akses strategis untuk onboarding penjual.
    3. **Setting**: Pengaturan akun diletakkan di bagian akhir.

---

#### 📅 Update: 5 Mei 2026 (Sesi UI Reversion - Orders)
**Waktu Eksekusi:** Sesi Malam (00:25 WIB)

**🎨 1. Revert UI ke Desain Awal (Pill Tabs)**
- **`src/app/orders/page.tsx`**
  - *UI:* Mengembalikan tampilan tab ke model "Pill" (hanya 2 tab: Order & History) sesuai desain Figma awal Tuan.
  - *Logic:* Tetap mempertahankan logic filtering Shopee di balik layar. Tab "Order" otomatis memfilter status aktif (Belum Bayar, Dikemas, Dikirim), sedangkan tab "History" memfilter status selesai (Selesai, Dibatalkan).
  - *UX:* Menghapus search bar internal agar tampilan tetap bersih dan fokus pada daftar produk.

---

#### 📅 Update: 5 Mei 2026 (Sesi Shopee-Style Order Logic)
**Waktu Eksekusi:** Sesi Malam (00:22 WIB)

**📦 1. Logic Navigasi Order (Shopee Style)**
- **`src/app/orders/page.tsx`**
  - *Tabs:* Menambahkan sistem tab lengkap: `Semua`, `Belum Bayar`, `Dikemas`, `Dikirim`, `Selesai`, `Dibatalkan`.
  - *UX:* Implementasi horizontal scrolling pada tab agar muat banyak status tanpa merusak layout.
  - *Search:* Menambahkan bar pencarian khusus di dalam halaman order untuk mencari berdasarkan nama toko, produk, atau ID pesanan.
  - *Filtering:* Logic `useMemo` untuk memfilter data secara *real-time* berdasarkan tab aktif dan input pencarian.

---

#### 📅 Update: 5 Mei 2026 (Sesi Data Order & History)
**Waktu Eksekusi:** Sesi Malam (00:18 WIB)

**📦 1. Komponen OrderItemCard**
- **`src/components/ui/OrderItemCard.tsx`**
  - *Design:* Kartu detail order dengan informasi toko, produk, harga, dan status.
  - *Dynamic UI:* Mendukung berbagai status (Belum Bayar, Dikemas, Dikirim, Selesai) dengan skema warna dan icon yang berbeda.
  - *Actions:* Menambahkan tombol aksi kontekstual seperti "Bayar Sekarang", "Lacak", "Nilai", dan "Beli Lagi".

**✨ 2. Update Halaman Orders**
- **`src/app/orders/page.tsx`**
  - *Logic:* Menambahkan dummy data untuk tab "Order" (Active) dan "History" (Completed).
  - *Experience:* Transisi antar tab kini lebih halus dengan animasi slide horizontal pada daftar produk.

---

#### 📅 Update: 5 Mei 2026 (Sesi Link Correction)
**Waktu Eksekusi:** Sesi Malam (00:15 WIB)

**🔧 1. Fix Broken Links di Profile**
- **`src/app/profile/page.tsx`**
  - *Fix:* Mengarahkan link "Order history" dan icon status order ke URL yang benar (`/orders`) alih-alih `/profile/orders` yang menyebabkan 404.

---

#### 📅 Update: 4 Mei 2026 (Sesi Order History)
**Waktu Eksekusi:** Sesi Malam (23:59 WIB)

**✨ 1. Halaman Order History (Buyer)**
- **`src/app/orders/page.tsx`**
  - *UI:* Implementasi desain Figma dengan tab "Order" dan "History".
  - *Experience:* Menggunakan Framer Motion untuk transisi sliding background pada tab (Premium feel).
  - *Empty State:* Menambahkan visual "No Records" dengan icon file yang estetik sesuai instruksi Tuan.
  - *Navigation:* Terintegrasi dengan `StickyHeader` dan `BackButton` standar project.

**🔧 2. Library Update**
- **`src/components/ui/Icons.tsx`**
  - *Icon:* Menambahkan icon `File` untuk kebutuhan halaman history/empty state.

---

#### 📅 Update: 4 Mei 2026 (Sesi Fix Static Export & Path)
**Waktu Eksekusi:** Sesi Malam (23:55 WIB)

**🔧 1. Fix Path & Missing generateStaticParams**
- **`src/app/categories/[slug]/page.tsx` & `src/app/product/[id]/page.tsx`**
  - *Fix:* Memperbaiki kesalahan path folder yang sebelumnya terpecah karena masalah escaping bracket di Windows.
  - *Architecture:* Mengimplementasikan pola Hybrid (Server Page + Client UI) untuk mendukung `output: export`.
  - *Result:* Error `generateStaticParams` sudah teratasi dan navigasi kategori dinamis sudah berfungsi kembali di lingkungan development.

---
- **`src/app/categories/[slug]/page.tsx` & `src/app/product/[id]/page.tsx`**
  - *Fix:* Memisahkan UI ke Client Component (`CategoryProductsClient` & `ProductDetailClient`) dan menjadikan `page.tsx` sebagai Server Component.
  - *Requirement:* Menambahkan fungsi `generateStaticParams()` yang wajib ada karena project menggunakan konfigurasi `output: export`. Hal ini memberitahu Next.js daftar URL mana saja yang harus di-build secara statis.
  - *Data:* Menambahkan daftar dummy slug ("Pokemon", "Onepiece", dll.) agar halaman kategori bisa diakses saat mode development maupun build.

---

#### 📅 Update: 4 Mei 2026 (Sesi Fix Missing Icon)
**Waktu Eksekusi:** Sesi Malam (23:40 WIB)

**🔧 1. Fix Element Type Invalid**
- **`src/components/ui/Icons.tsx`**
  - *Fix:* Menambahkan definisi icon `Filter` ke dalam objek `Icons`. Sebelumnya error terjadi karena `Icons.Filter` dipanggil di halaman pencarian tapi belum didefinisikan di library icon internal kita.

---

#### 📅 Update: 4 Mei 2026 (Sesi Bug Fix Search)
**Waktu Eksekusi:** Sesi Malam (23:35 WIB)

**🔧 1. Fix ReferenceError**
- **`src/app/search/page.tsx`**
  - *Fix:* Menambahkan import `cn` dari `@/lib/utils` yang terlewat pada sesi sebelumnya. Hal ini memperbaiki error `cn is not defined` saat user berinteraksi dengan tab filter di halaman pencarian.

---

#### 📅 Update: 4 Mei 2026 (Sesi Search UI ala Shopee)
**Waktu Eksekusi:** Sesi Malam (23:30 WIB)

**🛠 1. Upgrade Search Experience**
- **`src/app/search/page.tsx`**
  - *Layout:* Menerapkan filter tabs bergaya Shopee ("Terkait", "Terbaru", "Terlaris", "Harga") yang sticky di bagian atas.
  - *Feature:* Menambahkan section "Toko Berkaitan" (Official Store) jika user mencari kata kunci tertentu (e.g. "Pokemon"), lengkap dengan badge "MALL" dan tombol kunjungi toko.
  - *Logic:* Menambahkan mock sorting logic untuk filter "Terbaru" dan "Harga".
  - *Design:* Menggunakan desain input yang lebih minimalis (`!bg-[#F2F2F2]`) dan interaksi tab dengan animasi `layoutId` dari Framer Motion.

---

#### 📅 Update: 4 Mei 2026 (Sesi Navigasi & Detail Produk)
**Waktu Eksekusi:** Sesi Malam (23:25 WIB)

**🛠 1. Dinamisasi Halaman Kategori**
- **`src/app/categories/page.tsx`**
  - *Fix:* Menghapus "Double Header" (StickyHeader + h1) agar tampilan lebih bersih dan mengikuti desain standar.
  - *Navigation:* Sekarang mengarahkan user ke halaman list produk spesifik kategori (`/categories/[slug]`).
- **`src/app/categories/[slug]/page.tsx`** (New)
  - *Page:* Membuat halaman baru bergaya Shopee yang menampilkan grid produk berdasarkan kategori yang dipilih.
- **`src/app/product/[id]/page.tsx`** (New)
  - *Page:* Membuat placeholder halaman detail produk yang lengkap dengan tombol "Add to Cart" dan "Buy Now".

**🛠 2. Integrasi Search & Card**
- **`src/components/ui/ProductCard.tsx`**
  - *Interaction:* Mengaktifkan fungsi klik pada kartu produk di manapun (Home, Search, Categories) untuk mengarahkan user ke halaman Detail Produk.
- **`src/components/ui/CategoryList.tsx`**
  - *Flow:* Menghubungkan tombol kategori di Home agar bisa langsung berpindah ke halaman list kategori yang baru.

---

#### 📅 Update: 4 Mei 2026 (Sesi Perbaikan Scroll Kategori)
**Waktu Eksekusi:** Sesi Malam (23:20 WIB)

**🛠 1. Fix Scroll Horizontal & Clipping**
- **`src/components/ui/CategoryList.tsx`**
  - *Bug Fix:* Menghapus `ml-6 mr-6` pada kontainer scroll yang menyebabkan konten terpotong dan tidak bisa di-scroll.
  - *Fungsionalitas:* Menerapkan class `scrollbar-hide`, `whitespace-nowrap`, dan `flex-shrink-0` sesuai instruksi Tuan untuk memastikan kategori bisa di-scroll horizontal hingga ke ujung layar.
  - *UX:* Mempertahankan `snap-x` agar navigasi kategori tetap memiliki efek "mengunci" yang premium.
- **`src/app/globals.css`**
  - *Add:* Menambahkan utility `.scrollbar-hide` agar konsisten dengan standar yang diinginkan Tuan.

---

#### 📅 Update: 4 Mei 2026 (Sesi Maintenance & Build Fix)
**Waktu Eksekusi:** Sesi Malam (23:10 WIB)

**🔧 1. Fix Build Error**
- **`src/app/test-components/page.tsx`**
  - *Fix:* Mengganti import `Header` yang sudah usang dengan `StickyHeader`. Hal ini memperbaiki error `Module not found` yang muncul saat build karena file `Header.tsx` telah digantikan oleh sistem sticky header yang baru.

---

#### 📅 Update: 4 Mei 2026 (Sesi Perbaikan UX Kategori)
**Waktu Eksekusi:** Sesi Malam (23:05 WIB)

**🛠 1. Optimasi UX & Navigasi Kategori**
- **`src/components/ui/CategoryList.tsx`**
  - *Scrolling:* Menambahkan fungsionalitas `snap-x snap-mandatory` untuk pengalaman scroll horizontal yang lebih presisi dan premium (native feel).
  - *State Sync:* Menambahkan prop `activeCategory` agar pilihan kategori tetap terjaga saat kembali dari halaman lain.
- **`src/app/categories/page.tsx`**
  - *Visual:* Menambahkan background pattern "Floating Cards" di header sesuai referensi Figma.
  - *Fungsionalitas:* Menghubungkan kartu kategori ke halaman Home. Memilih kategori di halaman ini akan otomatis menyaring produk saat dialihkan kembali ke Home (menggunakan query params).
- **`src/app/home/page.tsx`**
  - *Logic:* Menambahkan sinkronisasi kategori melalui `useSearchParams` agar filter otomatis aktif berdasarkan navigasi dari halaman All Category.

---

#### 📅 Update: 4 Mei 2026 (Sesi Fungsionalitas & Filter)
**Waktu Eksekusi:** Sesi Malam (22:55 WIB)

**🛠 1. Implementasi Logika Filter & State**
- **`src/app/home/page.tsx`**
  - *Filter Kategori:* Menghubungkan `CategoryList` dengan daftar produk. Memilih kategori (Pokemon, Boboiboy, dll) kini otomatis menyaring produk yang tampil.
  - *Wishlist System:* Implementasi state lokal untuk menyimpan ID produk yang disukai.
- **`src/app/search/page.tsx`**
  - *Wishlist:* Menambahkan fungsionalitas tombol hati di hasil pencarian.
- **`src/app/profile/page.tsx`**
  - *Navigasi:* Menghubungkan semua menu (My Activity, Favorite, Settings, dll) dan status pesanan (Belum Bayar, dll) menggunakan `Link` ke rute yang sesuai.

**🔧 2. Update Komponen**
- **`src/components/ui/ProductCard.tsx`**
  - *Refactor:* Mengubah sistem wishlist dari internal state menjadi *controlled component* melalui props `isWishlisted` dan `onWishlistToggle` untuk konsistensi data antar halaman.

---

#### 📅 Update: 4 Mei 2026 (Sesi Implementasi Fitur Search)
**Waktu Eksekusi:** Sesi Malam (22:45 WIB)

**🛠 1. Pembuatan Halaman & Logika Pencarian**
- **`src/app/search/page.tsx`**
  - *Fitur:* Halaman pencarian interaktif dengan input yang mendukung filter produk secara *real-time*.
  - *UX:* Menampilkan state "Ketik untuk mencari" saat kosong, hasil pencarian saat ditemukan, dan state "Tidak ditemukan" jika tidak ada kecocokan.
- **`src/components/layout/BottomNav.tsx`**
  - *Koneksi:* Menghubungkan tombol pencarian (floating search button) ke rute `/search`.

---

#### 📅 Update: 4 Mei 2026 (Sesi Slicing Halaman Kategori)
**Waktu Eksekusi:** Sesi Malam (22:30 WIB)

**🛠 1. Pembuatan Halaman & Komponen Kategori**
- **`src/app/categories/page.tsx`**
  - *Fitur:* Halaman daftar semua kategori dengan header kustom dan tombol kembali bergaya premium.
- **`src/components/ui/CategoryCard.tsx`**
  - *Fitur:* Kartu kategori dengan ikon box, label teks, dan indikator panah kanan sesuai desain Figma.

**🔧 2. Bug Fix & Cleanup**
- **`src/app/home/page.tsx`**
  - *Cleanup:* Menghapus header teks "Catalog Product" dan tombol "See All" untuk menyederhanakan antarmuka, namun tetap mempertahankan grid produk agar katalog tetap terlihat langsung di Home.
- **`src/app/categories/page.tsx`**
  - *Fix:* Mengoreksi judul header menjadi "All Category".
  - *Fix:* Menambahkan import `Link` dari `next/link` yang sebelumnya terlewat untuk memperbaiki error navigasi "See All".

---

#### 📅 Update: 4 Mei 2026 (Sesi Slicing Halaman Keranjang)
**Waktu Eksekusi:** Sesi Malam (22:15 WIB)

**🛠 1. Pembuatan Halaman & Komponen Keranjang**
- **`src/app/cart/page.tsx`**
  - *Fitur:* Implementasi halaman keranjang belanja dengan fitur pilih semua (*select all*), hapus item, dan interaksi kuantitas.
  - *Checkout Summary:* Penambahan area ringkasan belanja (Subtotal, Fee, Total) yang *fixed* di bagian bawah dengan desain premium.
  - *Optimasi:* Menyesuaikan lebar kartu summary agar lebih proporsional dan responsif pada layar mobile.
- **`src/components/ui/CartItemCard.tsx`**
  - *Fitur:* Komponen kartu item keranjang dengan checkbox, gambar produk, info toko, harga, dan kontrol kuantitas (+/-).

**🔧 2. Update Navigasi**
- **`src/app/home/page.tsx`**
  - *Koneksi:* Menghubungkan ikon keranjang di header ke rute `/cart`.

---

#### 📅 Update: 4 Mei 2026 (Sesi Slicing Halaman Notifikasi)
**Waktu Eksekusi:** Sesi Malam (22:00 WIB)

**🛠 1. Pembuatan Halaman & Komponen Notifikasi**
- **`src/app/notifications/page.tsx`**
  - *Fitur:* Implementasi halaman notifikasi dengan pengelompokan waktu (Today, Yesterday, 1 Week ago).
  - *Desain:* Menggunakan `StickyHeader` dengan `BackButton` yang sudah diperbarui, serta background gradient linear sesuai Figma.
- **`src/components/ui/NotificationCard.tsx`**
  - *Fitur:* Komponen kartu notifikasi reusable dengan dukungan label (e.g., TIME SENSITIVE), icon placeholder, title, description, dan timestamp.
  - *Responsivitas:* Menghapus `max-width` kaku, mengganti `height` menjadi `min-height`, dan mengizinkan teks untuk *wrap* agar tidak terpotong pada layar kecil.
  - *Styling:* Menggunakan border-radius 22px dan warna `bg-surface-muted` (#F2F2F2) untuk estetika premium.

**🔧 2. Update UI Komponen Reusable & Navigasi**
- **`src/components/layout/BottomNav.tsx`**
  - *Visibilitas:* Menambahkan logika untuk menyembunyikan navbar pada halaman selain core tabs (Home, Messages, Collection, Profile). Navbar kini otomatis tersembunyi di halaman Notification dan Cart.
- **`src/app/home/page.tsx`**
  - *Koneksi:* Menambahkan `Link` pada ikon notifikasi agar mengarah ke halaman `/notifications`.
- **`src/components/ui/BackButton.tsx`**
  - *Perubahan:* Mengganti icon `ChevronLeft` menjadi `ChevronsLeft` (double chevron) untuk akurasi desain Figma.

---

#### 📅 Update: 4 Mei 2026 (Sesi Slicing UI & Layout Optimasi)
**Waktu Eksekusi:** Sesi Malam (21:00 WIB)

**🛠 1. Pembuatan & Optimasi Halaman (Slicing UI)**
- **`src/app/profile/page.tsx`** (Dibuat & Disempurnakan)
  - *Fitur:* Membangun halaman profil dengan *Sticky Header*, BackgroundLogo animasi framer-motion, grid status pesanan (Belum Bayar, Dikemas, Dikirim, Penilaian), dan *Menu List*.
  - *Tech Logic:* Menambahkan asersi `as const` pada `itemVariants` dan `containerVariants` untuk mencegah error *Type-Safety* Framer Motion. Menggunakan *staggerChildren* untuk animasi masuk yang mulus.
- **`src/app/collections/page.tsx` & `src/app/messages/page.tsx`**
  - *Fitur:* Sinkronisasi desain Header agar sama persis secara global.

**🔧 2. Resolusi Bug Kritis Layout ("Sticky Header")**
- **`src/app/layout.tsx`** (Update Baris: ~24)
  - *Aksi:* Menghapus atribut `overflow-x-hidden` secara total dari tag `<body>`.
  - *Alasan:* Menyelamatkan fungsi `position: sticky` yang sebelumnya *break* di mesin berbasis WebKit/Safari akibat hierarki *overflow* tersembunyi.
- **`src/app/home/page.tsx`, `collections/page.tsx`, `messages/page.tsx`** (Update Baris: ~44-50)
  - *Aksi:* Migrasi semua layout *Header* dari posisi `fixed` (yang berantakan karena *scrollbar*) menjadi `sticky top-0`. Serta menghapus `overflow-x-hidden` di semua tag `<main>`.
  - *Hasil:* Header kini terkunci sempurna di dalam *container max-width 440px*.

**🎨 3. Pembersihan "Tech Debt" & Design Tokens**
- **`src/app/globals.css`** (Update Baris: 12-22)
  - *Fitur:* Menambahkan CSS Variables baru khusus *Grayscale/Surface* (`--color-skeleton`, `--color-surface-light`, `--color-surface-muted`, `--color-surface-hover`, `--color-surface-tint`) dan `--color-notification`.
- **Refactoring 10+ Komponen UI** (`ProductCard.tsx`, `SocialButton.tsx`, `ProfilePicture.tsx`, `Input.tsx`, dll)
  - *Aksi:* Mengganti nilai *hex hardcode* (seperti `bg-[#FAFAFA]` dan `bg-[#D9D9D9]`) menjadi kelas utilitas semantik (`bg-surface-light`, `bg-skeleton`).
  - *Bugfix:* Menambahkan prop opsional `isWishlisted` di `ProductCard.tsx` untuk mengakomodasi state dari `home/page.tsx`.

**⚡ 4. Image LCP & Responsiveness (Background Logo)**
- **`src/app/messages/page.tsx`, `collections/page.tsx`, `profile/page.tsx`**
  - *Performa:* Migrasi dari tag `<img>` klasik ke komponen `<Image>` Next.js menghilangkan *Warning* LCP dari ESLint.
  - *Responsivitas:* Mengubah posisi *BackgroundLogo.svg* dari *fixed pixel* (`w-[471px] left-[-52px]`) menjadi *relative percentage* (`w-[110%] h-[150%] top-[-45%] left-[-12%]`) dipadukan dengan prop `fill`. Logo kini meregang proporsional mengikuti lebar HP *user* tanpa keluar batas kontainer 440px.

**📄 5. Sinkronisasi Aturan Proyek (AGENTS.md & README.md)**
- **`docs/AI/AGENTS.md`** (Update Baris: 61-68): Menambahkan protokol wajib "Pemahaman Konteks & Progress" yang memerintahkan AI untuk membaca log ini secara otomatis di sesi baru.
- **`README.md`**: Menyelaraskan *File Tree* dengan menyisipkan rute folder `src/app/onboarding/`.
- **`postcss.config.mjs`**: Memperbaiki warning *anonymous default export* menjadi format *named variable export*.

---

#### 📅 Update: 4 Mei 2026 (Sesi Perbaikan Header & Konsistensi UI)
**Waktu Eksekusi:** Sesi Malam (21:30 WIB)

**🛠 1. Standarisasi Header (Consistency UI/UX)**
- **Pembuatan `src/components/layout/StickyHeader.tsx`**: Menyatukan semua variasi header ke dalam satu komponen *reusable* yang mendukung judul, aksi kiri/kanan, dan opsi latar belakang logo.
- **Konsistensi Global**: Mengupdate halaman `Home`, `Messages`, `Collections`, dan `Profile` untuk menggunakan `StickyHeader` dengan tinggi seragam `120px` dan efek *glassmorphism*.
- **Pembersihan**: Menghapus komponen `Header.tsx` lama untuk mengurangi redundansi kode.

**🎨 2. Optimasi Aset & Responsivitas**
- **Komponen `src/components/ui/BackgroundLogo.tsx`**: Mengimplementasikan SVG dengan `preserveAspectRatio="xMidYMid slice"` dan batasan `max-h-32/40` untuk memastikan logo tidak terpotong secara aneh di berbagai ukuran layar mobile.
- **Header Profile**: Memperbaiki masalah *full-width* pada header profil dengan menghapus padding global pada tag `<main>` dan mendistribusikannya ke masing-masing section konten.

**📄 3. Pemeliharaan Dokumentasi (Protokol AGENTS.md)**
- Memperbarui file tree di `README.md` dan `docs/AI/AGENTS.md`.
- Mengupdate status tugas di `docs/to-do.md`.

---

#### 📅 Update: 4 Mei 2026 (Sesi Optimasi Grid & Fix Berantakan)
**Waktu Eksekusi:** Sesi Malam (21:55 WIB)

**🛠 1. Perbaikan Rigiditas Grid Koleksi**
- **Fix "Card Berantakan"**: Menghapus `flex-1` pada Info Section dan menggantinya dengan tinggi tetap (`h-[35%]`) serta pembagian area background (`h-[65%]`). Ini memastikan semua kartu memiliki tinggi yang identik terlepas dari panjang teks.
- **Line Clamp**: Mengganti `truncate` dengan `line-clamp-1` pada judul kartu untuk mencegah pembungkusan teks (wrapping) yang bisa merusak tata letak flexbox.
- **Grid Alignment**: Menghapus `justify-items-center` pada grid agar setiap kartu meregang (stretch) mengisi lebar kolom secara penuh, memastikan keselarasan vertikal dan horizontal yang sempurna.
- **Placeholder Sync**: Menyelaraskan proporsi ikon dan teks pada tombol "New Folder" agar serasi dengan kartu koleksi yang kini lebih padat.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Notification Premium)
**Waktu Eksekusi:** Sesi Siang (14:50 WIB)

**🛠️ 1. Premium Notification UI Overhaul**
- **`src/components/ui/NotificationCard.tsx`**
  - *Aesthetic:* Implementasi desain premium dengan efek glassmorphism pada ikon, indikator unread dengan animasi pulse, dan standarisasi radius sesuai `design_system`.
  - *Variants:* Menambahkan sistem tipe (`promo`, `order`, `alert`, `message`, `system`) dengan skema warna semantik.
  - *Interactivity:* Menambahkan animasi `framer-motion` (entrance, hover lift, tap scale) untuk "Native App Feel".
  - *Strict Rules:* Menghapus *hardcoded values* dan beralih sepenuhnya ke variabel CSS (`shadow-soft`, `shadow-medium`, `rounded-card`).

**🛠️ 2. Data & Usage Sync**
- **`src/app/notifications/page.tsx`**
  - *Data:* Memperbarui `NOTIFICATIONS_DATA` dengan varian tipe baru dan status baca (isRead) untuk demonstrasi UI yang lebih komprehensif.
  - *UX:* Penyesuaian layout list agar tetap responsif dan bersih.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Cart Premium)
**Waktu Eksekusi:** Sesi Siang (15:00 WIB)

**🛒 1. Premium Cart UI Overhaul**
- **`src/app/cart/page.tsx`**
  - *Data Strategy:* Migrasi dari dummy data generik ke data TCG riil (Charizard, Pikachu, dll) untuk preview yang lebih akurat.
  - *UX Improvements:* Menambahkan indikator jumlah produk terpilih dan area checkout yang lebih premium dengan efek *glassmorphism*.
  - *Empty State:* Mendesain ulang tampilan keranjang kosong dengan visual yang lebih menarik dan tombol CTA "Mulai Belanja".

**🛒 2. Component Refinement**
- **`src/components/ui/CartItemCard.tsx`**
  - *Standardization:* Mengintegrasikan komponen global `Icons` dan `Checkbox`.
  - *Interactive:* Menambahkan animasi `layout` Framer Motion untuk transisi penambahan/pengurangan item yang mulus.
  - *Design:* Penyesuaian tipografi dan skema warna agar selaras dengan `design_system`.
- **`src/components/ui/Checkbox.tsx`**
  - *Visual Upgrade:* Menambahkan ikon *checkmark* SVG dan transisi skala untuk *Native App Feel*.
  - *Flexibility:* Menjadikan label opsional agar bisa digunakan di dalam kartu produk.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Collections Functional)
**Waktu Eksekusi:** Sesi Siang (15:25 WIB)

**📂 1. Premium Collections UI & Functionality**
- **`src/app/collections/page.tsx`**
  - *Features:* Implementasi fitur pencarian koleksi secara *real-time* dan sistem penambahan folder koleksi baru.
  - *Interactive Dialog:* Menambahkan *Bottom Sheet* premium untuk input nama koleksi baru dengan animasi `AnimatePresence`.
  - *UX Improvements:* Menambahkan *empty state* untuk hasil pencarian dan optimasi animasi *stagger* pada grid.
- **`src/components/ui/CollectionCard.tsx`**
  - *Visual:* Peningkatan estetika dengan gradien, indikator interaktif (chevron), dan standarisasi bayangan (`shadow-soft` & `hover:shadow-medium`).
  - *Visual:* Menghapus nilai bayangan manual dan beralih ke variabel desain sistem.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Collection Detail & Upload)
**Waktu Eksekusi:** Sesi Siang (15:30 WIB)

**📂 1. Collection Detail & Card Management**
- **`src/app/collections/[id]/page.tsx`**
  - *Dynamic Routing:* Implementasi halaman detail koleksi menggunakan Next.js Dynamic Routes.
  - *Server-Side:* Mendukung `generateStaticParams` untuk optimasi `output: export`.
- **`src/components/collections/CollectionDetailClient.tsx`**
  - *Gallery View:* Menampilkan daftar kartu di dalam folder koleksi menggunakan `ProductCard`.
  - *Upload System:* Implementasi fitur "Upload Kartu" melalui *Bottom Sheet* interaktif untuk menambah koleksi secara lokal.
  - *Visual Consistency:* Menggunakan variabel `--color-accent-soft` (#F6DFFF) untuk konsistensi gradien latar belakang.

**🎨 2. Design System Sync**
- **`src/app/globals.css`**
  - *Token:* Menambahkan `--color-accent-soft` (#F6DFFF) sebagai variabel tema resmi.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Collection Detail Refinement)
**Waktu Eksekusi:** Sesi Siang (15:35 WIB)

**📂 1. UI Consistency & Filtering**
- **`src/components/collections/CollectionDetailClient.tsx`**
  - *Header Evolution:* Memperhalus tata letak "Isi Koleksi" dengan aksen visual vertikal dan penyelarasan tipografi agar lebih premium.
  - *Filter System:* Implementasi bar filter horizontal (chips) untuk mengkategorikan kartu berdasarkan kondisi (*Mint*, *Near Mint*, dsb).
  - *Motion Refinement:* Meningkatkan kualitas animasi masuk (*entrance*) menggunakan fisika `spring` untuk transisi yang lebih organik.
  - *Filtering Logic:* Menambahkan logika filter kartu secara *real-time* dan *empty state* yang informatif untuk hasil pencarian/filter yang kosong.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Seller Dashboard)
**Waktu Eksekusi:** Sesi Sore (16:00 WIB)

**🏪 1. Seller Portal Slicing**
- **`/seller/dashboard/page.tsx`**: Pembuatan UI halaman beranda *Seller* dengan kartu saldo interaktif, ringkasan status pesanan (Pesanan Baru, Dikirim, Selesai), dan menu manajemen toko.
- **`/seller/products/page.tsx`**: Pembuatan halaman "Kelola Produk" yang menampilkan daftar inventaris penjual dengan indikator jumlah stok *real-time* di atas setiap kartu produk. Dilengkapi juga dengan fitur pencarian dan *empty state*.
- **`/seller/products/add/page.tsx`**: Slicing form "Tambah Produk" dengan desain form premium, meliputi:
  - Kotak unggah foto utama dengan format panduan batas file.
  - Input nama produk, kategori, harga, dan stok.
  - Sistem *chips* interaktif untuk penentuan "Kondisi Kartu".
  - Tombol aksi mengambang (FAB/Sticky Button) untuk kemudahan *submit* pada mode *mobile*.

**📝 2. Task Tracking**
- Mengubah status "Store onboarding seller" dan "Product CRUD seller" menjadi selesai pada `docs/to-do.md`.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Logic - Profile Conditional Menu)
**Waktu Eksekusi:** Sesi Sore (16:05 WIB)

**👤 1. Profile Context Logic**
- **`src/app/profile/page.tsx`**: Implementasi logika kondisional untuk membedakan tampilan profil antara *Buyer* dan *Seller*.
  - *Dynamic Menu:* Menu secara otomatis berganti antara "Register as Seller" (jika belum terdaftar) dan "Dashboard Seller" (jika sudah terdaftar).
  - *Identity Badge:* Menambahkan *badge* "Seller" di samping nama profil untuk identifikasi peran pengguna.
  - *Debug Toggle:* Menambahkan tombol simulasi *state* sementara di bagian bawah untuk mempermudah pengetesan perubahan UI tanpa harus login/logout.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Full Seller Suite)
**Waktu Eksekusi:** Sesi Sore (16:15 WIB)

**🏪 1. Seller Ecosystem Finalization**
- **`/seller/orders/page.tsx`**: Implementasi halaman manajemen pesanan dengan sistem tab (*Perlu Dikirim*, *Diproses*, *Selesai*) dan kartu pesanan interaktif.
- **`/seller/settings/page.tsx`**: Pembuatan halaman pengaturan toko untuk kustomisasi profil toko (nama, deskripsi) dan verifikasi metode pembayaran.
- **`/seller/dashboard/page.tsx` (Refinement)**: Peningkatan standar industri dengan penambahan seksi "Penjualan Terbaru" dan optimasi tata letak navigasi.
- **`src/app/profile/page.tsx`**: Sinkronisasi navigasi antara mode *Buyer* dan *Seller* menggunakan logika kondisional.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Seller Analytics & Reports)
**Waktu Eksekusi:** Sesi Sore (16:20 WIB)

**📊 1. Seller Analytics Suite**
- **`/seller/reports/page.tsx`**: Implementasi halaman analisis performa toko bergaya industri (*Tokopedia/Shopee style*).
  - *KPI Cards:* Metrik utama untuk Omzet, Profit, Jumlah Pesanan, dan Pengunjung dengan indikator persentase pertumbuhan.
  - *Data Visualization:* Grafik batang interaktif (simulasi) dengan animasi masuk menggunakan *Framer Motion*.
  - *Best Sellers:* Daftar produk terlaris dengan sistem peringkat dan total pendapatan per produk.
  - *Time Range Filtering:* Filter data berdasarkan rentang waktu (Hari, Minggu, Bulan).
- **`/seller/dashboard/page.tsx`**: Integrasi menu "Laporan Penjualan" ke dalam navigasi utama *Seller*.

---

#### 📅 Update: 12 Mei 2026 (Sesi Bugfix - Icons Sync)
**Waktu Eksekusi:** Sesi Sore (16:25 WIB)

**🛠️ 1. Icons Library Update**
- **`src/components/ui/Icons.tsx`**: Menambahkan definisi `Icons.Chart` untuk mendukung fitur visualisasi data pada Dashboard dan Laporan Seller.
- **Fix:** Menyelesaikan error `Element type is invalid` pada Dashboard Seller yang disebabkan oleh ikon yang belum didefinisikan.

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Sales Transaction Detail)
**Waktu Eksekusi:** Sesi Sore (16:30 WIB)

**💸 1. Sales Transaction Analytics**
- **`/seller/reports/detail/page.tsx`**: Implementasi halaman rincian transaksi penjualan untuk transparansi finansial *Seller*.
  - *Financial Breakdown:* Menampilkan rincian biaya per transaksi, termasuk Harga Produk, Potongan Biaya Layanan (1%), dan Penghasilan Bersih.
  - *Search & Filter:* Fitur pencarian *real-time* berdasarkan ID Pesanan atau Nama Produk.
  - *Status Tracking:* Indikator status transaksi (Selesai/Diproses) dengan skema warna industrial.
- **`/seller/reports/page.tsx`**: Integrasi navigasi ke halaman rincian transaksi melalui tombol "Lihat Detail Transaksi".

---

#### 📅 Update: 12 Mei 2026 (Sesi UI Re-Architecture - Seller Report Export)
**Waktu Eksekusi:** Sesi Sore (16:25 WIB)

**📥 1. Data Export Functionality**
- **`/seller/reports/page.tsx`**: Implementasi fitur ekspor data laporan penjualan.
  - *CSV Export:* Logika fungsional untuk menghasilkan file CSV dari data transaksi dan mengunduhnya langsung ke perangkat pengguna.
  - *PDF Export:* Simulasi penyiapan dokumen PDF menggunakan fungsi *native print* browser yang telah dioptimalkan.
  - *Loading UX:* Animasi *spinner* pada tombol header dan transisi menu pilihan format yang halus menggunakan *AnimatePresence*.

---











#### Update: 18 Mei 2026 (Sesi Integrasi Appwrite V1 - Auth, Store, Products)
**Waktu Eksekusi:** Malam

**1. Wiring Appwrite di Repo**
- Menambahkan config Appwrite modular di `src/lib/appwrite/config.ts` dan `src/lib/appwrite/client.ts`.
- Menambahkan service domain:
  - `src/lib/services/auth.ts`
  - `src/lib/services/profile.ts`
  - `src/lib/services/store.ts`
  - `src/lib/services/product.ts`
- Memperluas `src/types/index.ts` agar sinkron dengan schema Appwrite v1 (`user_profiles`, `stores`, `products`).

**2. AuthContext Nyata (Bukan Mock)**
- `src/context/AuthContext.tsx` diubah dari basis `localStorage` mock menjadi state nyata berbasis Appwrite Auth + TablesDB.
- Register sekarang:
  - membuat Auth user
  - membuat row `user_profiles` dengan row ID = Auth user ID
- Login sekarang:
  - membuat email/password session Appwrite
  - menarik profil dan toko dari Appwrite
- Seller onboarding sekarang:
  - mengubah role profile menjadi `seller`
  - membuat row `stores`

**3. Integrasi UI Tanpa Mengubah Desain**
- Halaman auth tetap mempertahankan layout yang sudah ada, tetapi sekarang submit ke backend nyata:
  - `src/app/(auth)/login/page.tsx`
  - `src/app/(auth)/register/page.tsx`
- Halaman berikut sekarang membaca/menulis data Appwrite tanpa mengubah struktur visual utama:
  - `src/app/home/page.tsx`
  - `src/app/search/page.tsx`
  - `src/app/categories/[slug]/CategoryProductsClient.tsx`
  - `src/app/product/[id]/ProductDetailClient.tsx`
  - `src/app/store/[id]/StoreProfileClient.tsx`
  - `src/app/profile/page.tsx`
  - `src/app/onboarding/seller/page.tsx`
  - `src/app/seller/dashboard/page.tsx`
  - `src/app/seller/products/page.tsx`
  - `src/app/seller/products/add/page.tsx`
  - `src/app/seller/products/edit/[id]/EditProductClient.tsx`

**4. Live Appwrite Permission Hardening**
- Menyalakan `rowSecurity = true` pada table:
  - `user_profiles`
  - `stores`
  - `products`
- Mengatur permission table:
  - `user_profiles`: `create("users")`
  - `stores`: `read("any")`, `create("users")`
  - `products`: `read("any")`, `create("users")`
- Mengatur bucket inti menjadi `fileSecurity = true`:
  - `profile-avatars`
  - `store-assets`
  - `product-images`
- Permission bucket saat ini:
  - `create("users")`
- Permission file produk dibuat per-file saat upload:
  - `read("any")`
  - `update("user:<owner>")`
  - `delete("user:<owner>")`

**5. Catatan Teknis Penting**
- Appwrite Tables saat ini tidak menerima default value pada column `required`; default logis dipindahkan ke application layer saat create row.
- `user_profiles.$id` dipakai sebagai identity user aplikasi.
- `stores.$id` dipakai sebagai `store_id`.
- `products.store_id` mengarah ke `stores.$id`.

**6. Validasi**
- `npm run lint` - lulus
- `npm run build` - lulus
- Static export berhasil menghasilkan 84 routes.

#### Update: 18 Mei 2026 (Lanjutan Integrasi Appwrite - Buyer Commerce V1.5)
**Waktu Eksekusi:** Larut Malam

**1. Schema Buyer Commerce di Appwrite**
- Menambahkan table baru di Appwrite untuk flow buyer:
  - `addresses`
  - `cart_items`
  - `orders`
  - `order_items`
- Menambahkan index query inti agar list buyer dan checkout tetap efisien:
  - `addresses.user_id_index`
  - `cart_items.user_id_index`
  - `cart_items.store_id_index`
  - `cart_items.user_product_unique`
  - `cart_items.user_selected_index`
  - `orders.order_code_index`
  - `orders.buyer_user_id_index`
  - `orders.seller_user_id_index`
  - `orders.store_id_index`
  - `orders.buyer_status_index`
  - `orders.seller_status_index`
  - `order_items.order_id_index`
  - `order_items.product_id_index`

**2. Service Layer Baru**
- Menambahkan service domain baru:
  - `src/lib/services/address.ts`
  - `src/lib/services/cart.ts`
  - `src/lib/services/order.ts`
- Menambahkan ID table baru di `src/lib/appwrite/config.ts`.
- Memperluas type di `src/types/index.ts` untuk:
  - alamat
  - cart item
  - order buyer
  - order item
  - shipping method
  - input create order

**3. Wiring UI Tanpa Mengubah Desain**
- Halaman buyer berikut sekarang sudah terhubung ke Appwrite nyata tanpa mengubah layout visual utama:
  - `src/app/cart/page.tsx`
  - `src/app/checkout/page.tsx`
  - `src/app/checkout/payment/page.tsx`
  - `src/app/profile/address/page.tsx`
  - `src/app/orders/page.tsx`
  - `src/app/product/[id]/ProductDetailClient.tsx`
- Detail implementasi:
  - tombol `Add to Cart` pada product detail sekarang membuat/memperbarui row cart Appwrite
  - tombol `Buy Now` sekarang memilih item checkout aktif lalu masuk ke `/checkout`
  - halaman checkout membaca item terpilih + alamat utama dari Appwrite
  - pembayaran QRIS membaca order nyata dan mengubah status order saat user menekan aksi bayar
  - daftar pesanan buyer membaca order + order item nyata dari Appwrite
  - daftar alamat sekarang create/update primary/delete ke Appwrite

**4. Aturan Data & Scope**
- Checkout masih mengikuti keputusan v1:
  - satu transaksi hanya untuk satu toko / satu seller
- Field default Appwrite yang tidak didukung pada required column tetap di-handle pada application layer.
- `products.store_id` tetap menjadi jembatan utama antara produk, toko, cart, dan order.

**5. Validasi**
- `npm run lint` - lulus
- `npm run build` - lulus
- Build produksi tetap menghasilkan 84 routes.

#### Update: 18 Mei 2026 (Lanjutan Integrasi Appwrite - Seller Orders & Runtime-Safe Tracking)
**Waktu Eksekusi:** Menjelang Pagi

**1. Seller Orders Nyata**
- Menyambungkan flow seller ke data order Appwrite melalui perluasan `src/lib/services/order.ts`.
- Menambahkan kemampuan baru:
  - list order seller
  - detail order seller
  - update status pesanan dari `packed` ke `shipped`
- Halaman berikut sekarang sudah membaca status order nyata:
  - `src/app/seller/orders/page.tsx`
  - `src/app/seller/orders/[id]/OrderDetailClient.tsx`
  - `src/app/seller/dashboard/page.tsx`

**2. Tracking Buyer Nyata**
- `src/app/orders/[id]/track/TrackClient.tsx` sekarang membaca data order Appwrite nyata dan membangun timeline berdasarkan:
  - `$createdAt`
  - `paid_at`
  - `status`
- Halaman review buyer juga sekarang membaca brief produk nyata dari pesanan:
  - `src/app/orders/[id]/review/ReviewClient.tsx`

**3. Route Runtime-Safe untuk Static Export**
- Karena project memakai `output: export`, order ID nyata yang lahir saat runtime tidak aman jika hanya mengandalkan dynamic route statis.
- Menambahkan route statis berbasis query param agar flow transaksi tetap aman untuk deploy statis:
  - `src/app/orders/track/page.tsx`
  - `src/app/orders/review/page.tsx`
  - `src/app/seller/orders/detail/page.tsx`
- Navigasi UI diperbarui agar order nyata diarahkan ke route statis tersebut tanpa mengubah desain.

**4. Validasi**
- `npm run lint` - lulus
- `npm run build` - lulus
- Jumlah route statis naik dari 84 menjadi 87 setelah penambahan halaman statis tracking/review/detail seller.

#### Update: 18 Mei 2026 (Lanjutan Integrasi Appwrite - Review Persistence)
**Waktu Eksekusi:** Pagi Dini Hari

**1. Schema Review di Appwrite**
- Menambahkan table baru `reviews` dengan `rowSecurity = true`.
- Struktur inti:
  - `order_id`
  - `product_id`
  - `store_id`
  - `user_id`
  - `rating`
  - `review_text`
- Index yang dibuat:
  - `order_id_unique`
  - `product_id_index`
  - `store_id_index`
  - `user_id_index`

**2. Service Layer Review**
- Menambahkan `src/lib/services/review.ts`.
- Fitur yang dicakup:
  - cek review per order
  - list review per produk
  - list review per toko
  - summary rating (average + breakdown)
  - create review dengan validasi satu review per order

**3. Wiring UI Review**
- `src/app/orders/[id]/review/ReviewClient.tsx`
  - sekarang membaca order nyata
  - mencegah submit ulang jika order sudah pernah diulas
  - submit sekarang menyimpan rating dan teks ulasan ke Appwrite
- `src/app/product/[id]/ProductDetailClient.tsx`
  - menampilkan rating rata-rata produk dari Appwrite
  - menampilkan daftar ulasan terbaru bila tersedia
- `src/app/store/[id]/StoreProfileClient.tsx`
  - menampilkan summary rating toko dari Appwrite
  - menampilkan ulasan publik terbaru pada tab `Ulasan`

**4. Validasi**
- `npm run lint` - lulus
- `npm run build` - lulus
- Static export tetap stabil dengan 87 routes.

#### Update: 18 Mei 2026 (Lanjutan Integrasi Appwrite - Messaging Persistence)
**Waktu Eksekusi:** Pagi

**1. Schema Chat di Appwrite**
- Menambahkan table baru:
  - `conversations`
  - `chat_messages`
- Struktur inti `conversations`:
  - `buyer_user_id`
  - `seller_user_id`
  - `store_id`
  - `last_message`
  - `last_message_at`
  - `last_sender_id`
  - `buyer_last_read_at`
  - `seller_last_read_at`
- Struktur inti `chat_messages`:
  - `conversation_id`
  - `sender_user_id`
  - `receiver_user_id`
  - `message_text`
  - `is_read`

**2. Service Layer Chat**
- Menambahkan `src/lib/services/chat.ts`.
- Fitur yang dicakup:
  - find/create conversation buyer-seller
  - list inbox conversations
  - load room messages
  - mark messages as read
  - send message dan update summary conversation

**3. Wiring UI Tanpa Ubah Desain**
- `src/app/messages/page.tsx`
  - inbox sekarang membaca conversation nyata dari Appwrite
- `src/components/chat/ChatClient.tsx`
  - room chat sekarang membaca dan mengirim pesan nyata
- Menambahkan route statis runtime-safe:
  - `src/app/messages/room/page.tsx`
- Tombol chat pada:
  - `src/app/product/[id]/ProductDetailClient.tsx`
  - `src/app/store/[id]/StoreProfileClient.tsx`
  kini mengarah ke room chat statis berbasis query param agar tetap aman untuk `output: export`

**4. Validasi**
- `npm run lint` - lulus
- `npm run build` - lulus
- Static export naik dari 87 menjadi 88 routes karena penambahan `/messages/room`.

#### Update: 18 Mei 2026 (Lanjutan Integrasi Appwrite - Notification Persistence)
**Waktu Eksekusi:** Pagi Menjelang Siang

**1. Schema Notification di Appwrite**
- Menambahkan table baru `notifications` dengan `rowSecurity = true`.
- Struktur inti:
  - `user_id`
  - `title`
  - `description`
  - `type`
  - `label`
  - `action_url`
  - `is_read`
- Index yang dibuat:
  - `user_id_index`
  - `user_read_index`
  - `type_index`

**2. Service Layer Notification**
- Menambahkan `src/lib/services/notification.ts`.
- Fitur yang dicakup:
  - create notification
  - list notifications
  - group notifications berdasarkan waktu
  - mark as read

**3. Wiring Event Nyata**
- `src/lib/services/order.ts`
  - seller mendapat notifikasi saat ada order baru
  - seller mendapat notifikasi saat pembayaran buyer terkonfirmasi
  - buyer mendapat notifikasi saat pesanan dikirim
  - buyer mendapat notifikasi saat pesanan selesai dan siap direview
- `src/lib/services/chat.ts`
  - user penerima mendapat notifikasi saat pesan baru masuk
- `src/lib/services/review.ts`
  - seller mendapat notifikasi saat pembeli mengirim ulasan

**4. Wiring UI Notifikasi**
- `src/app/notifications/page.tsx`
  - sekarang membaca notifikasi nyata dari Appwrite
  - mendukung group waktu (`Hari Ini`, `Kemarin`, `Minggu Ini`, `Sebelumnya`)
  - mendukung aksi klik untuk mark-as-read dan pindah ke route terkait

**5. Perbaikan Build Terselubung**
- Merapikan `src/app/about/page.tsx` agar `SocialButton` benar-benar menerima prop `href` dan memakai `Link`, sehingga build TypeScript kembali hijau.

**6. Validasi**
- `npm run lint` - lulus
- `npm run build` - lulus
- Static export tetap stabil di 88 routes.
