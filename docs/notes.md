# CardToo

Website CardToo merupakan marketplace untuk JUAL/BELI Kartu.

---

## 🚀 Fitur Utama (akan diupdate)
- Daftar fitur website (None)
- Teknologi: HTML, Tailwind CSS, Next.Js
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
│   │   ├── layout.jsx       # Struktur kerangka aplikasi
│   │   ├── page.jsx         # Halaman utama website
│   │   ├── global.css       # File utama Tailwind CSS
│   │   └── products/        # Rute halaman daftar produk
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
│       └── useCart.js       # Logika sistem keranjang belanja
│    
├── docs/                    # Dokumentasi, panduan tugas, dsb
│   ├── feature_guide.md     # Panduan fitur
│   ├── notes.md             # Catatan
│   └── Guide.md             # Panduan kerja 
│   
├── .env.local               # Variabel environment\API Key Appwrite
├── .gitignore               # File yang diabaikan oleh Git
├── tailwind.config.js       # Pengaturan warna kustom Tailwind CSS
└── README.md                # Dokumentasi utama, petunjuk setup/progress kelompok
```