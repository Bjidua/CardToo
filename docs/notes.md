Urutan terbaik sekarang:

Auth + role dulu
Store onboarding seller
Product CRUD seller
Catalog buyer (list/detail/search)
Cart + checkout
Order + payment status
Alasannya: semua fitur marketplace nempel ke identitas user. Kalau auth/role belum jadi, fitur lain bakal banyak bongkar ulang.

Kita mulai Flow Auth & Role (yang paling minimal tapi scalable).

Flow target
User register/login via Appwrite Auth.
Setelah register, buat row users_profile.
Default role buyer.
User bisa “upgrade jadi seller”.
Middleware/blok akses halaman berdasarkan role.
Struktur yang perlu kalian bikin dulu di codebase
src/lib/appwrite/client.ts
src/lib/appwrite/server.ts
src/lib/auth.ts
src/lib/roles.ts
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
src/app/(seller)/onboarding/page.tsx
src/middleware.ts