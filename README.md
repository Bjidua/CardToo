# CardToo

CardToo adalah marketplace TCG web-based untuk jual beli kartu seperti Pokemon, One Piece, Boboiboy, Yu-Gi-Oh!, dan kategori lain yang relevan untuk tugas matkul kelompok.

## Status Project

- Progress keseluruhan: sekitar `93%`
- Core flow sudah hidup:
  - guest onboarding + auth
  - buyer catalog, favorite, collection, cart, checkout, orders, review, chat, notifications
  - seller onboarding, dashboard, CRUD produk, seller orders, reports, store settings
- Backend utama sudah terhubung ke Appwrite
- Static export sudah di-hardening untuk runtime data lewat route query-based

## Tech Stack

- `TypeScript`
- `Next.js 16`
- `React 19`
- `Tailwind CSS v4`
- `Appwrite` untuk auth, tables, dan storage
- `Appwrite Functions` untuk trusted backend lintas buyer/seller
- `Framer Motion` untuk motion/UI transitions

## Appwrite Coverage

### Tables aktif

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

### Buckets aktif

- `profile-avatars`
- `store-assets`
- `product-images`

### Function aktif

- `commerce-gateway`

## Route Model

Project ini memakai `output: 'export'`, jadi runtime detail route yang bergantung pada ID Appwrite tidak diarahkan ke dynamic route build-time.

Route runtime-safe yang dipakai in-app:

- `/product/detail?productId=...`
- `/store/detail?storeId=...`
- `/seller/products/edit?productId=...`
- `/messages/room?...`
- `/orders/track?orderId=...`
- `/orders/review?orderId=...`
- `/seller/orders/detail?orderId=...`
- `/collections/detail?collectionId=...`

Dynamic route lama tetap ada untuk sample static build compatibility, tetapi navigasi in-app utama sudah berhenti mengandalkannya.

## Flow yang Sudah Live

### Guest

- landing page
- onboarding
- login
- register
- forgot password UI flow

### Buyer

- home
- search
- category listing
- product detail
- store detail
- favorites
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

- seller onboarding
- seller dashboard
- seller products
- add product
- edit product
- seller orders
- seller reports
- seller settings

## Honest Read-only / Informational Areas

Fitur berikut sengaja dibuat jujur sebagai status informasional, bukan pura-pura transactional:

- `/profile/payments`
- `/profile/security/2fa`
- `/profile/security/pin`
- payout / withdraw seller
- response time toko otomatis

## Struktur Penting Repo

```text
src/
  app/                  App Router pages
  components/           Reusable UI + layout components
  context/              Auth provider dan shared app state
  hooks/                Custom hooks
  lib/
    appwrite/           Appwrite client/config
    services/           Domain service layer
    routes.ts           Runtime-safe route builders
    slug.ts             Deterministic slug helpers
  types/                Shared TypeScript domain types
docs/
  AI/AGENTS.md          Aturan kerja agent / contributor AI
  design_system/        Token, spacing, typography, component guidance
  to-do.md              Tracker status kerja
  notes.md              Progress + audit + konteks arsitektur
```

## Menjalankan Project

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Validasi utama:

```bash
npm run lint
npm run build
```

## Environment

Project memakai `.env.local` untuk Appwrite config. Minimal env yang dibutuhkan:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_TABLE_USER_PROFILES_ID=
NEXT_PUBLIC_APPWRITE_TABLE_STORES_ID=
NEXT_PUBLIC_APPWRITE_TABLE_PRODUCTS_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_PROFILE_AVATARS_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_STORE_ASSETS_ID=
NEXT_PUBLIC_APPWRITE_BUCKET_PRODUCT_IMAGES_ID=
```

Tambahan table env lain dipakai untuk buyer/seller domain yang sudah hidup.

## Current Priorities

Fase polishing tersisa:

- smoke test permission Appwrite dengan akun buyer/seller terpisah
- upload logo toko bila UI affordance-nya disepakati
- domain payout seller bila memang masuk scope final
- final QA end-to-end untuk demo kelompok
- verifikasi deployment `commerce-gateway` setelah perubahan flow order/chat/review

## Reference Docs

- [Agent Rules](C:/Users/hafiz/Documents/Kampus/CardToo/docs/AI/AGENTS.md)
- [Progress Notes](C:/Users/hafiz/Documents/Kampus/CardToo/docs/notes.md)
- [To Do Tracker](C:/Users/hafiz/Documents/Kampus/CardToo/docs/to-do.md)
