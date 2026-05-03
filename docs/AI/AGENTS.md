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
│   │   ├── test-components/ # Laboratorium Component
│   │   ├── layout.tsx       # Struktur kerangka aplikasi
│   │   ├── page.tsx         # Halaman utama (Landing)
│   │   ├── globals.css      # File utama Tailwind CSS v4
│   │   └── products/        # Rute halaman daftar produk (blm ada)
│   │ 
│   └── components/          # Potongan antarmuka visual
│   │   ├── ui/              # Atom components (Button, Input, dll)
│   │   └── layout/          # Organism components (Navbar, Footer)
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
- SELALU MENGIKUTI TEMPLATE COMPONENT YANG SUDAH DI BUAT UNTUK MENCEGAH REDUNDANSI CODE (JADI HARUS MENGIKUTIN DESIGN SYSTEM)
- SETIAP ADA UPDATE FILE TREE UPDATE JUGA STRUKTUR REPONYA DI README.md
- FOKUS DI UKURAN MOBILE TERLEBIH DAHULU (UKURAN HP) (PAKSA WIDESCREEN MEMAKAI UKURAN MOBILE)
- SELALU UPDATE COMPONENT BARU SETIAP ADA TAMBAHAN DI test-components/page.tsx 
- JIKA ADA COMPONENT CODING YANG BERULANG BUAT SARAN KE DEVELOPER AGAR MEMBUAT COMPONENT TEMPLATE AGAR MENCEGAH REDUNDANSI CODE
- DILARANG menggunakan tag label manual untuk Input. WAJIB menggunakan prop 'label' yang tersedia di component Input.
- IDENTIFIKASI pola UI yang berulang dan buatkan component template-nya (seperti AuthCard, Checkbox, dll) sebelum implementasi massal.
- PASTIKAN aplikasi memiliki "Native App Feel" (APK Vibe) dengan mematikan seleksi teks dan drag gambar secara global (kecuali pada input).
<!-- END:nextjs-agent-rules -->
