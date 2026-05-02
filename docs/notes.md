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
│   │   ├── layout.tsx       # Struktur kerangka aplikasi
│   │   ├── page.tsx         # Halaman utama website
│   │   ├── global.css       # File utama Tailwind CSS
│   │   └── products/        # Rute halaman daftar produk (blm ada)
│   │       └── [id]/        # Rute dinamis detail kartu
│   │           └── page.jsx # Halaman detail kartu
│   │ 
│   └── components/          # Potongan antarmuka visual
│   │   ├── ui/              # Tombol dan elemen desain kecil
│   │   └── layout/          # Navbar dan Footer
│   │ 
│   └── lib/                 # Skrip eksternal pendukung
│   │   └── appwrite.js      # Koneksi ke Appwrite
│   │ 
│   └── hooks/               # Fungsi pengatur data internal
│       └── useCart.js       # Logika sistem keranjang belanja(blm ada)
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