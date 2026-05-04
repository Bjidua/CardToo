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
│   │   ├── onboarding/      # Halaman Onboarding awal
│   │   ├── test-components/ # Laboratorium Component
│   │   ├── layout.tsx       # Struktur kerangka aplikasi
│   │   ├── page.tsx         # Halaman utama (Landing)
│   │   ├── globals.css      # File utama Tailwind CSS v4
│   │   └── products/        # Rute halaman daftar produk (blm ada)
│   │ 
│   └── components/          # Potongan antarmuka visual
│   │   ├── ui/              # Atom components (CollectionCard, MessageCard, NotificationCard, CartItemCard, CategoryCard, Icons, ProfilePicture, BackgroundLogo, dll)
│   │   └── layout/          # Organism components (StickyHeader, BottomNav, AuthCard)
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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
