# CardToo Progress Notes

## 1. Konteks Project

CardToo adalah project ecommerce/marketplace TCG untuk tugas kelompok kampus. Produk utamanya adalah kartu koleksi seperti Pokemon, One Piece, Boboiboy, Yu-Gi-Oh!, dan kategori serupa.

Repo ini dibangun sebagai web app mobile-first dengan target:

- flow guest jelas
- flow buyer bisa transaksi end-to-end
- flow seller bisa mengelola toko dan pesanan

## 2. Status Saat Ini

- Tanggal audit/progress acuan: `18 Mei 2026`
- Estimasi kesiapan: `~93%`
- `npm run lint`: lulus
- `npm run build`: lulus
- Build App Router statis terakhir menghasilkan `85 routes`

## 3. Arsitektur Saat Ini

### Frontend

- `Next.js 16 App Router`
- `React 19`
- `Tailwind CSS v4`
- `Framer Motion`

### Backend

- `Appwrite Auth`
- `Appwrite TablesDB`
- `Appwrite Storage`
- `Appwrite Functions` (`commerce-gateway`) untuk write lintas buyer/seller

### Routing penting

Project memakai `output: 'export'`, sehingga detail entity runtime Appwrite dipindahkan ke route statis berbasis query param.

Route runtime-safe aktif:

- `/product/detail?productId=...`
- `/store/detail?storeId=...`
- `/seller/products/edit?productId=...`
- `/messages/room?...`
- `/orders/track?orderId=...`
- `/orders/review?orderId=...`
- `/seller/orders/detail?orderId=...`
- `/collections/detail?collectionId=...`

## 4. Coverage Appwrite

### Tables

- `user_profiles`
- `stores`
- `products`
- `addresses`
- `cart_items`
- `orders`
- `order_items`
- `reviews`
- `conversations`
- `chat_messages`
- `notifications`
- `favorites`
- `collections`
- `collection_items`

### Buckets

- `profile-avatars`
- `store-assets`
- `product-images`

### Permission snapshot

Hasil audit Appwrite live:

- semua table domain utama memakai `rowSecurity = true`
- `stores` dan `products` punya table permission public read + `create("users")`
- table privat lain memakai `create("users")` dan owner-scoped row permissions saat row dibuat dari service
- bucket `profile-avatars`, `store-assets`, `product-images` memakai `fileSecurity = true`
- file permission owner/public diatur saat upload pada service terkait
- flow lintas user untuk `orders`, `chat`, dan notifikasi review/order penting sekarang dipindahkan ke trusted backend `commerce-gateway`

## 5. Flow Audit

### Guest

Status: `live`

Sudah jalan:

- landing
- onboarding
- login
- register
- auth guard ke halaman private

### Buyer

Status: `live`

Sudah jalan:

- home
- search
- categories
- product detail
- store detail
- favorite
- collections
- cart
- checkout
- payment
- orders
- tracking
- review
- messages
- notifications
- profile edit
- address management

### Seller

Status: `live`

Sudah jalan:

- onboarding seller
- dashboard
- add/edit/delete product
- seller orders
- seller reports
- seller settings

## 6. Honest Read-only / Informational Features

Fitur berikut sengaja tidak dipura-purakan menjadi live:

- `profile/payments`
- `profile/security/2fa`
- `profile/security/pin`
- withdraw seller
- response time toko otomatis

## 7. Hardening yang Baru Ditutup

### Final hardening batch

Perubahan penting yang baru selesai:

- semua link in-app ke detail produk/toko/edit produk seller pindah ke route statis query-based
- `profile/edit` sekarang mendukung upload avatar nyata ke bucket `profile-avatars`
- tampilan avatar ikut sinkron di header home dan halaman profile
- `stores.location` ditambahkan ke schema Appwrite live dan dipersist dari seller settings
- tanggal gabung toko sekarang memakai data nyata dari Appwrite
- withdraw seller tidak lagi mock timeout; sekarang jujur sebagai informational state
- fallback slug `Date.now()` dihapus dan diganti helper deterministik reusable
- trusted backend `commerce-gateway` ditambahkan untuk menghindari masalah permission cross-user di checkout dan chat

## 8. Maintainability Assessment

Status maintainability: `baik, tetapi belum selesai total`

Yang sudah bagus:

- service Appwrite sudah dipisah per domain
- shared types terpusat
- route helper runtime-safe sudah ada
- design-system debt besar sudah banyak dibersihkan

Yang masih perlu dipantau:

- QA permission nyata antar akun
- keputusan scope final untuk logo toko
- keputusan scope final untuk payout seller

## 9. Remaining Risk

### Risk rendah

- utility page informasional dianggap “kurang lengkap” oleh reviewer non-teknis, meski sekarang sudah jujur

### Risk sedang

- belum ada smoke test formal antar dua akun berbeda untuk semua permission path
- seller payout dan logo toko bisa dianggap gap bila tim ingin demo “fitur penuh”

## 10. Rekomendasi Next Step

1. jalankan QA guest/buyer/seller end-to-end
2. cek permission Appwrite dengan akun buyer dan seller berbeda
3. putuskan apakah:
   - logo toko
   - payout seller
   masuk scope final atau tetap `out of scope`

## 11. Ringkasan Kesiapan Demo

Kalau targetnya adalah demo marketplace TCG yang terasa hidup dan tidak sekadar slicing UI, repo ini sudah sangat dekat:

- auth nyata: siap
- buyer flow inti: siap
- seller flow inti: siap
- Appwrite core: siap
- static export compatibility: siap
- polish remaining: minor sampai menengah

Kesimpulan saat ini:

> CardToo sudah layak disebut hampir selesai untuk scope tugas kuliah, dengan sisa pekerjaan utama berupa QA akhir, permission smoke test, dan keputusan scope fitur minor.
