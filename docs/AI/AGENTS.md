<!-- BEGIN:nextjs-agent-rules -->
# CardToo

Website CardToo merupakan marketplace untuk JUAL/BELI Kartu.

---

## 🚀 Fitur Utama (akan diupdate)
- Daftar fitur website (None)
- Teknologi: Next.js, Tailwind CSS
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
│   │   ├── home/            # Halaman Dashboard Utama
│   │   ├── cart/            # Halaman Keranjang Belanja
│   │   ├── categories/      # Halaman Semua Kategori
│   │   ├── search/          # Halaman Pencarian Produk
│   │   ├── messages/        # Halaman Pesan
│   │   ├── collections/     # Halaman Koleksi TCG
│   │   ├── profile/         # Halaman Profil User
│   │   ├── notifications/   # Halaman Notifikasi
│   │   ├── seller/          # Halaman seller suite
│   │   ├── test-components/ # Laboratorium Component
│   │   ├── layout.tsx       # Struktur kerangka aplikasi
│   │   ├── page.tsx         # Halaman utama (Landing)
│   │   └── globals.css      # File utama Tailwind CSS v4
│   │
│   ├── components/          # Potongan antarmuka visual
│   │   ├── ui/              # Atom/Molecule UI reusable
│   │   └── layout/          # Layout reusable (StickyHeader, BottomNav, dst)
│   │
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Skrip utilitas, auth, API client
│   ├── context/             # React context provider
│   └── types/               # TypeScript shared types
│
├── docs/                    # Dokumentasi, panduan tugas, dsb
│   ├── AI/                  # Rules AI agent
│   ├── design_system/       # Guideline utama design project
│   ├── feature_guide.md
│   ├── notes.md
│   ├── to-do.md
│   └── Guide.md
│
├── .env.local
├── .gitignore
└── README.md
```

## AI AGENTS RULES (INDUSTRY SCALE)

### 1) 🧠 SESSION BOOTSTRAP & CONTEXT (WAJIB)
- Saat mulai sesi baru, WAJIB baca: `README.md`, `docs/to-do.md`, `docs/notes.md`, `docs/Guide.md`, dan `docs/AI/AGENTS.md`.
- WAJIB pahami progres terakhir sebelum menyentuh kode.
- WAJIB cek struktur folder & file terkait scope task terlebih dahulu.
- Jika task menyentuh area lintas fitur, lakukan mini-audit dampak ke file terkait sebelum edit.
- Setiap selesai task, WAJIB update `docs/to-do.md` (status checklist) dan `docs/notes.md` (log teknis singkat).

### 2) 🤝 WORKFLOW EKSEKUSI (WAJIB)
- DILARANG inisiatif implementasi tanpa instruksi user.
- WAJIB konfirmasi scope sebelum perubahan besar/arsitektural.
- Prioritaskan perubahan kecil, terukur, dan bisa diverifikasi.
- Setiap perubahan wajib punya validasi minimal:
  1. lint
  2. build (untuk perubahan signifikan)
  3. uji alur utama yang terdampak
- Jika ada trade-off, tampilkan opsi + risiko secara ringkas.

### 3) 🏗️ NEXT.JS ARCHITECTURE (STRICT)
- `page.tsx` wajib diprioritaskan sebagai **Server Component**.
- `"use client"` hanya untuk komponen yang butuh state/effect/browser API.
- Pisahkan UI interaktif ke Client Component terpisah (hindari client-heavy page).
- Untuk dynamic route pada static export, WAJIB siapkan `generateStaticParams` bila dibutuhkan.
- Hindari fetch/data transform berulang di banyak komponen; sentralisasi di layer yang tepat (`lib/`, hooks, atau server boundary).

### 4) 🧩 COMPONENT SYSTEM & REUSE (STRICT)
- WAJIB cek `src/components/ui` sebelum membuat komponen baru.
- DILARANG duplikasi komponen/pola UI yang sudah ada.
- Jika pola UI dipakai >1 tempat, ekstrak jadi reusable component.
- Setiap komponen baru WAJIB:
  - typed props (tanpa `any`)
  - punya varian bila ada lebih dari 1 gaya penggunaan
  - konsisten naming & API props
- Jika komponen baru dibuat, WAJIB tambahkan showcase minimal di `src/app/test-components/page.tsx`.

### 5) 🎨 DESIGN SYSTEM & STYLING GOVERNANCE (STRICT)
- DILARANG hardcoded hex (`#xxxxxx`) dan arbitrary value tidak perlu (`shadow-[...]`, dsb).
- WAJIB gunakan token semantik dari `globals.css` / design system:
  - contoh: `text-primary`, `bg-surface-light`, `shadow-soft`, `shadow-medium`.
- DILARANG styling manual untuk elemen yang sudah punya template komponen.
- Input wajib memakai komponen `Input` + prop `label` (tanpa label manual untuk field Input).
- Mobile-first mandatory: layout widescreen tetap berperilaku seperti viewport mobile app.

### 6) 🧾 DATA, TYPES, DAN DOMAIN RULES
- Gunakan **DUMMY DATA ENGINE** (`DUMMY_DATA` object/record) untuk simulasi data dinamis.
- DILARANG menaruh teks/angka dinamis hardcoded langsung di JSX.
- Semua entitas domain WAJIB pakai type/interface dari shared types (`src/types`).
- DILARANG penggunaan `any` kecuali ada alasan kuat dan disetujui.
- Siapkan struktur agar migrasi ke Appwrite/API minim refactor (shape data konsisten).

### 7) 🔐 SECURITY, PRIVACY, DAN CONFIG HYGIENE
- DILARANG hardcode secret, token, API key, endpoint sensitif di source code.
- Gunakan env variables (`.env.local`) dan abstraction di `lib/`.
- Jangan logging data sensitif (email, token, credential, payload pribadi).
- Validasi input user di boundary penting (form kritikal / transaksi / auth flow).

### 8) ⚡ PERFORMANCE & UX STANDARDS
- Gunakan `next/image` untuk aset gambar non-dekoratif utama.
- Optimalkan render list panjang (batasi render berat, memoisasi saat perlu).
- Pertahankan “Native App Feel”:
  - minim text selection global (kecuali input/textarea),
  - interaksi sentuh responsif,
  - state loading/empty/error yang jelas.
- Hindari layout shift mencolok; jaga konsistensi spacing dan skeleton/loading state.

### 9) ✅ QUALITY GATES (DEFINITION OF DONE)
Task dianggap selesai jika:
1. Scope user terpenuhi.
2. Tidak melanggar rules AI + design system.
3. Lint lulus.
4. Build lulus (jika perubahan signifikan/struktur).
5. Dokumentasi progres di `docs/to-do.md` dan `docs/notes.md` terupdate.
6. Tidak meninggalkan TODO kritikal tanpa catatan tindak lanjut.

### 10) 🗂️ DOCUMENTATION & CHANGELOG DISCIPLINE
- Setiap task selesai WAJIB menambah log ringkas di `docs/notes.md`:
  - tanggal/jam sesi
  - file yang diubah
  - alasan perubahan
  - hasil validasi (lint/build/test flow)
- Update checklist di `docs/to-do.md` dengan status faktual (`[x]` / `[ ]`).
- Jangan overwrite history lama; tambahkan entri baru agar jejak keputusan terjaga.

### 11) 🚫 ANTI-PATTERN (DILARANG)
- Duplikasi komponen/styling.
- Menambah dependency tanpa alasan jelas.
- Refactor besar tanpa approval user.
- Mengubah behavior lintas halaman tanpa impact check.
- Menghapus code/documentation yang masih relevan tanpa catatan migrasi.
- Memperbaiki gejala tanpa menyentuh akar masalah (root cause).

### 12) 🧭 PRIORITAS SAAT KONFLIK
Jika ada konflik prioritas, urutan keputusan:
1. Keamanan & data integrity
2. Kebenaran bisnis/flow
3. Stabilitas build/lint
4. Konsistensi design system
5. Kecepatan implementasi

<!-- END:nextjs-agent-rules -->