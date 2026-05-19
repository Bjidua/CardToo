# CardToo Agent Rules

## 1. Tujuan Repo

CardToo adalah project marketplace TCG mobile-first berbasis web untuk tugas kelompok kampus. Fokus repo ini bukan eksperimen UI acak, tetapi menyelesaikan flow ecommerce yang masuk akal untuk tiga persona:

- `guest`
- `buyer`
- `seller`

Setiap perubahan harus memperjelas atau memperkuat flow salah satu dari tiga persona itu.

## 2. Source of Truth yang Wajib Dibaca

Sebelum kerja pada sesi baru, baca:

1. `README.md`
2. `docs/to-do.md`
3. `docs/notes.md`
4. `docs/design_system/`
5. file terkait scope task

Jangan mengandalkan asumsi dari sesi lama kalau kondisi file bisa berubah.

## 3. Non-Halu Rule

- Jangan klaim fitur “sudah jadi” kalau masih mock, local-only, atau hanya desain.
- Jangan bilang Appwrite sudah terhubung kalau page masih baca data placeholder.
- Jangan membuat CTA aktif untuk fitur yang belum punya backend/domain jelas.
- Kalau fitur belum final, ubah jadi salah satu status berikut:
  - `live`
  - `read-only`
  - `out of scope`

CardToo harus terasa jujur, bukan terlihat lengkap tapi bohong.

## 4. Arsitektur yang Harus Dipertahankan

### App Router

- Gunakan `Server Component` secara default.
- Tambahkan `"use client"` hanya bila butuh state, effect, browser API, atau interaksi nyata.

### Static Export

Project memakai `output: 'export'`.

Karena itu:

- runtime data Appwrite dengan ID yang lahir setelah build **tidak boleh** bergantung pada dynamic route build-time
- gunakan route query-based statis untuk detail runtime seperti:
  - `/product/detail?productId=...`
  - `/store/detail?storeId=...`
  - `/seller/products/edit?productId=...`
  - `/messages/room?...`
  - `/orders/track?orderId=...`

Kalau ada link baru ke entity Appwrite runtime, default-nya adalah route statis query-based, bukan dynamic route baru.

### Layering

Ikuti pola ini:

- `src/app/...` untuk page/client container
- `src/lib/services/...` untuk domain logic Appwrite
- `src/types/index.ts` untuk shared entity shape
- `src/lib/appwrite/...` untuk config/client

Jangan campur query Appwrite mentah ke banyak page kalau sudah bisa ditaruh di service.

## 5. Design System Rules

- Ikuti token semantik dari `globals.css` dan `docs/design_system/`
- Hindari:
  - hex hardcoded
  - `black/gray` mentah
  - shadow arbitrary tanpa alasan kuat
- Gunakan komponen reusable yang sudah ada sebelum membuat pola baru:
  - `Input`
  - `Button`
  - `StickyHeader`
  - `AuthCard`
  - `MenuListItem`
  - `ProductCard`
  - dll

Jangan mengubah desain yang sudah disetujui user kecuali diminta. Fokusnya wiring, consistency, dan hardening.

## 6. Data & Domain Rules

- Semua entity domain harus lewat `src/types/index.ts`
- Jangan pakai `any` tanpa alasan kuat
- Jangan pakai dummy entity untuk fitur yang sudah masuk scope backend
- Nilai default Appwrite yang tidak didukung untuk required column harus diisi di application layer
- Slug fallback harus deterministik, jangan pakai timestamp mentah sembarangan

## 7. Appwrite Rules

- Auth, tables, dan storage adalah backend utama repo ini
- Kalau ubah schema Appwrite, sinkronkan:
  - service layer
  - shared types
  - docs status
- Row/file permission harus masuk akal:
  - owner-scoped untuk data privat
  - public read hanya untuk data/asset yang memang harus tampil publik

## 8. Flow Integrity Rules

Setiap perubahan harus dicek dampaknya ke:

- guest flow
- buyer flow
- seller flow

Jangan memperbaiki satu halaman sambil memutus navigasi flow lain.

## 9. Quality Gates

Task dianggap selesai kalau:

1. scope user selesai
2. tidak merusak desain yang disepakati
3. `npm run lint` lulus
4. `npm run build` lulus untuk perubahan signifikan
5. `docs/to-do.md` dan `docs/notes.md` diperbarui bila ada progres penting

## 10. Documentation Discipline

`docs/to-do.md`
- berisi status kerja faktual
- pisahkan yang selesai, sedang berjalan, dan backlog

`docs/notes.md`
- berisi konteks project
- progress audit
- coverage Appwrite
- risiko / next steps

Jangan biarkan docs tertinggal jauh dari code nyata.

## 11. Anti-Pattern yang Dilarang

- route aktif yang sebenarnya dummy
- CTA palsu dengan `setTimeout`, `alert`, atau `console.log` pura-pura proses
- local state domain permanen untuk fitur yang seharusnya sudah Appwrite-backed
- refactor besar tanpa dampak yang dipahami
- edit visual besar tanpa permintaan user

## 12. Prioritas Keputusan

Jika ada konflik, urutan prioritasnya:

1. kebenaran flow user
2. stabilitas build/export
3. keamanan data & permission
4. maintainability arsitektur
5. kerapihan visual implementation
