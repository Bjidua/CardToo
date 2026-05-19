/**
 * Mengubah string teks biasa menjadi format slug URL (kecil, tanda hubung).
 * Contoh: "Pokemon Card! - Rare" menjadi "pokemon-card-rare"
 * 
 * @param value String teks masukan yang akan diubah menjadi slug
 * @returns String format slug URL yang sudah disanitasi
 */
export const slugifyValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Hapus semua karakter khusus kecuali huruf, angka, spasi, dan dash
    .replace(/\s+/g, "-")          // Gantikan satu atau lebih spasi berturut-turut menjadi tanda hubung (-)
    .replace(/-+/g, "-")          // Gantikan beberapa tanda hubung berturut-turut menjadi satu tanda hubung
    .replace(/^-|-$/g, "");       // Hapus tanda hubung di awal dan di akhir kata jika ada

/**
 * Membuat base slug dari suatu teks dengan fallback teks default jika hasil sanitasi kosong.
 * 
 * @param value String teks dasar (misal: nama toko/produk)
 * @param fallbackPrefix Teks default jika hasil konversi bernilai string kosong
 * @returns Base slug string
 */
export const buildSlugBase = (value: string, fallbackPrefix: string) =>
  slugifyValue(value) || `${fallbackPrefix}-cardtoo`;

/**
 * Menambahkan sufiks angka numerik ke akhir slug untuk membedakan slug yang duplikat (unik).
 * 
 * @param baseSlug Teks slug dasar
 * @param suffix Angka sufiks (0 jika tidak ada duplikat)
 * @returns Slug lengkap dengan sufiks (misal: "toko-kartu-1" jika suffix = 1)
 */
export const withSlugSuffix = (baseSlug: string, suffix: number) =>
  suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;
