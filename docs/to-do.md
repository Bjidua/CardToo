# CardToo To Do

## Sudah Selesai

### UI foundation

- [x] Mobile wrapper dan layout dasar
- [x] Auth pages, onboarding, profile, cart, search, categories, notifications
- [x] Seller dashboard, seller products, seller reports, seller settings
- [x] Shared UI cleanup ke token design system

### Appwrite core

- [x] Auth login/register + sync `AuthContext`
- [x] Trusted backend `commerce-gateway` untuk flow lintas user
- [x] `user_profiles`, `stores`, `products`
- [x] `addresses`, `cart_items`, `orders`, `order_items`
- [x] `reviews`
- [x] `conversations`, `chat_messages`
- [x] `notifications`
- [x] `favorites`
- [x] `collections`, `collection_items`
- [x] `profile-avatars`, `store-assets`, `product-images`

### Buyer live flow

- [x] Home membaca produk Appwrite
- [x] Search dan categories membaca produk Appwrite
- [x] Product detail membaca produk/toko/review nyata
- [x] Store detail membaca toko, produk, dan review nyata
- [x] Favorite Appwrite-backed
- [x] Collections Appwrite-backed
- [x] Cart, checkout, payment, orders, tracking
- [x] Review submit + summary
- [x] Messages inbox + room
- [x] Notifications
- [x] Edit profile + avatar upload

### Seller live flow

- [x] Upgrade buyer jadi seller
- [x] Seller dashboard membaca order dan product count nyata
- [x] Add product
- [x] Edit product
- [x] Delete product
- [x] Seller orders
- [x] Seller reports
- [x] Seller settings baca/tulis nama, deskripsi, banner, lokasi

### Static export hardening

- [x] Query-based runtime route untuk collection detail
- [x] Query-based runtime route untuk order tracking/review/detail seller
- [x] Query-based runtime route untuk messages room
- [x] Query-based runtime route untuk product detail
- [x] Query-based runtime route untuk store detail
- [x] Query-based runtime route untuk seller edit product
- [x] Navigasi in-app berhenti memakai route dinamis lama untuk entity runtime Appwrite

### Maintainability hardening

- [x] Shared route helper untuk runtime-safe navigation
- [x] Shared deterministic slug helper
- [x] Hapus fallback slug berbasis `Date.now()`
- [x] Hapus shim Appwrite lama yang sudah mati
- [x] Seller withdrawal diubah jadi honest informational state
- [x] Response time toko diubah jadi informational copy
- [x] `stores.location` ditambahkan ke schema Appwrite dan dipakai di app

## Sedang / Perlu QA Final

- [ ] Smoke test guest, buyer, seller dengan akun terpisah
- [ ] Smoke test permission Appwrite:
  - owner bisa update data sendiri
  - non-owner tidak bisa modifikasi data privat
  - public read hanya bekerja untuk data/asset yang memang publik
- [ ] Verifikasi execution `commerce-gateway`:
  - create order buyer -> seller
  - mark paid / shipped / completed
  - create / send chat lintas akun
  - create review + notify seller
- [ ] Verifikasi visual route detail baru di browser lokal:
  - `/product/detail`
  - `/store/detail`
  - `/seller/products/edit`

## Belum Selesai

### Storage & seller profile polish

- [ ] Upload logo toko belum dibuat karena affordance UI belum dipastikan

### Domain tambahan

- [ ] Payout / withdraw seller belum punya backend payout domain
- [ ] Response time toko otomatis belum dihitung dari data chat/SLA

## Out of Scope / Honest Read-only

- [x] `/profile/payments` tetap read-only informational
- [x] `/profile/security/2fa` tetap informational
- [x] `/profile/security/pin` tetap informational

## Prioritas Berikutnya

1. QA end-to-end seluruh flow
2. permission smoke test Appwrite
3. putuskan apakah logo toko dan payout seller masuk scope final demo
