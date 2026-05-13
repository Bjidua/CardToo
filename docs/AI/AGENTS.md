<!-- BEGIN:nextjs-agent-rules -->
# CardToo

Website CardToo merupakan marketplace untuk JUAL/BELI Kartu.

---

## 🚀 Fitur Utama (akan diupdate)
- Daftar fitur website (None)
- Teknologi:  Next.Js, Tailwind CSS
- Framework: React

## 📂 Struktur Repo
```plaintext
📦 CardToo (Project Structure)
├── public/                  # Aset statis akses langsung
│   ├── images/              # Gambar
│   └── favicon.ico          # Icon website
│ 
├── src/                     # Source code aplikasi
│   ├── app/                 # Rute halaman web Next.js
│   │   ├── (auth)/          # Rute autentikasi
│   │   │   ├── login/       # Halaman Login
│   │   │   ├── register/    # Halaman Register
│   │   │   └── forgot-password/ # Alur Lupa Password
│   │   │       ├── page.tsx     # Form Email
│   │   │       ├── verify/      # Verifikasi OTP
│   │   │       └── reset/       # Reset Password Baru
│   │   ├── home/            # Halaman Dashboard Utama
│   │   ├── cart/            # Halaman Keranjang Belanja
│   │   ├── categories/      # Halaman Semua Kategori
│   │   ├── search/          # Halaman Pencarian Produk
│   │   ├── messages/        # Halaman Pesan
│   │   ├── collections/     # Halaman Koleksi TCG
│   │   ├── profile/         # Halaman Profil User
│   │   ├── notifications/   # Halaman Notifikasi
│   │   ├── test-components/ # Laboratorium Component
│   │   ├── layout.tsx       # Struktur kerangka aplikasi
│   │   ├── page.tsx         # Halaman utama (Landing)
│   │   ├── globals.css      # File utama Tailwind CSS v4
│   │   └── products/        # Rute halaman daftar produk (blm ada)
│   │ 
│   └── components/          # Potongan antarmuka visual
│   │   ├── ui/              # Atom components (Button, Input, Icons, NotificationCard, CartItemCard, CategoryCard, BackgroundLogo, dll)
│   │   └── layout/          # Organism components (StickyHeader, BottomNav)
│   │ 
│   └── lib/                 # Skrip eksternal pendukung
│   │   ├── appwrite.ts      # Koneksi ke Appwrite
│   │   └── utils.ts         # Utility functions (cn, dll)
│   │ 
│   └── hooks/               # Custom hooks
│    
├── docs/                    # Dokumentasi, panduan tugas, dsb
│	├── design_system        # Guideline utama design project
│   ├── feature_guide.md     # Panduan fitur ada apa aja
│   ├── notes.md             # Catatan
│   ├── to-do.md             # Fitur yang ingin di kerjakan
│   └── guide.md             # Panduan kerja 
│   
├── .env.local               # Variabel environment\API Key Appwrite
├── .gitignore               # File yang diabaikan oleh Git
└── README.md                # Dokumentasi utama, petunjuk setup/progress kelompok
```

## AI AGENTS RULES

### 🧠 PEMAHAMAN KONTEKS & PROGRESS (WAJIB SAAT MULAI SESI)
- SAAT MEMULAI SESI BARU, AI AGENT WAJIB MEMBACA `README.md`, `docs/to-do.md`, dan `docs/notes.md` TERLEBIH DAHULU UNTUK MEMAHAMI PROGRESS TERAKHIR.
- AI AGENT WAJIB MENGECEK STRUKTUR FILE TERBARU (Membaca file codebase utama jika diperlukan) UNTUK MENYAMAKAN KONTEKS SEBELUM MENULIS KODE.
- SETIAP KALI SELESAI MENGERJAKAN FITUR/TUGAS BERSAMA USER, AI AGENT WAJIB MENG-UPDATE `docs/to-do.md` DAN `docs/notes.md` AGAR PROGRESS TEREKAM UNTUK SESI BERIKUTNYA.

### 🛠 ATURAN KERJA & CODING
- AI AGENTS DILARANG INISIATIF (kecuali ada ijin)
- BERTANYA TERLEBIH DAHULU SEBELUM MEMBUAT APA PUN
- SELALU KONFIRMASI SEBELUM MEMBUAT
- SELALU MEMBACA FILE "guide.md" SEBELUM MEMBUAT APA PUN
- SELALU MEMBACA FILE "design_system" SEBELUM MEMBUAT APA PUN
- SELALU MEMBACA FILE "AGNETS.md" SEBELUM MEMBUAT APA PUN
- AI AGENTS HANYA MEMBANTU PROSES CODING / PENULISAN KODE
- AI AGENTS BUKAN PEMUTUS KEPUTUSAN AKHIR
- SELALU PAKE RULES YANG SUDAH DI BUAT
- SELALU MENGIKUTI TEMPLATE YANG SUDAH DI BUAT
- SELALU MENGIKUTI TEMPLATE COMPONENT YANG SUDAH DI BUAT UNTUK MENCEGAH REDUNDANSI CODE (JADI HARUS MENGIKUTIN DESIGN SYSTEM).
- **WAJIB MENGECEK `src/components/ui` SEBELUM MEMBUAT COMPONENT BARU.** Jika sudah ada (seperti `Button`, `Input`, `Icons`), gunakan yang sudah ada.
- **DILARANG membuat styling manual untuk elemen yang sudah ada di template.** Contoh: Gunakan `<Button variant="danger">` daripada membuat button merah manual dengan Tailwind.
- **IDENTIFIKASI POLA BERULANG**: Jika ada elemen UI yang digunakan di lebih dari satu halaman (misal: menu list, card produk), **WAJIB** mengekstraknya menjadi component template di `src/components/ui/`.
- FOKUS DI UKURAN MOBILE TERLEBIH DAHULU (UKURAN HP) (PAKSA WIDESCREEN MEMAKAI UKURAN MOBILE)
- SELALU UPDATE COMPONENT BARU SETIAP ADA TAMBAHAN DI test-components/page.tsx 
- JIKA ADA COMPONENT CODING YANG BERULANG BUAT SARAN KE DEVELOPER AGAR MEMBUAT COMPONENT TEMPLATE AGAR MENCEGAH REDUNDANSI CODE
- DILARANG menggunakan tag label manual untuk Input. WAJIB menggunakan prop 'label' yang tersedia di component Input.
- IDENTIFIKASI pola UI yang berulang dan buatkan component template-nya (seperti AuthCard, Checkbox, dll) sebelum implementasi massal.
- PASTIKAN aplikasi memiliki "Native App Feel" (APK Vibe) dengan mematikan seleksi teks dan drag gambar secara global (kecuali pada input).
- **STRICT NEXT.JS ARCHITECTURE:** Selalu prioritaskan penggunaan Server Components pada `page.tsx`. Gunakan `"use client";` hanya pada komponen anak yang membutuhkan state/interaktivitas (ekstrak komponen ke file terpisah).
- **STRICT TAILWIND STYLING:** DILARANG KERAS menggunakan *hardcoded hex colors* (misal `#4CB6C4`) atau *arbitrary values* yang tidak perlu (misal `shadow-[0_4px_4px_...]`). WAJIB menggunakan variabel CSS dari `globals.css` (misal `text-primary`, `bg-surface-light`, `shadow-soft`, `shadow-medium`).
- **DUMMY DATA ENGINE:** Selalu gunakan struktur data objek atau record (`DUMMY_DATA`) untuk mensimulasikan data yang seharusnya berasal dari database. Hindari menulis nilai teks/angka statis langsung di dalam JSX untuk elemen yang bersifat dinamis (seperti harga, nama produk, detail seller). Hal ini mempermudah migrasi ke Appwrite/API di masa depan.
<!-- END:nextjs-agent-rules -->
