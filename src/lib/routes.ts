/**
 * Membuat URL untuk halaman Detail Produk berdasarkan ID-nya.
 * Menggunakan URL Parameter (?productId=...) agar Next.js dapat mengenali produk yang di-load.
 * @param productId ID unik produk TCG
 */
export const buildProductDetailHref = (productId: string) =>
  // encodeURIComponent digunakan untuk mengamankan karakter khusus dalam URL parameter
  `/product/detail?productId=${encodeURIComponent(productId)}`;

/**
 * Membuat URL untuk halaman Detail Toko/Seller berdasarkan ID Toko.
 * Menggunakan URL Parameter (?storeId=...) untuk memuat detail toko terkait.
 * @param storeId ID unik toko penjual
 */
export const buildStoreDetailHref = (storeId: string) =>
  // Mengarahkan ke rute detail toko dengan storeId yang sudah disanitasi
  `/store/detail?storeId=${encodeURIComponent(storeId)}`;

/**
 * Membuat URL menuju halaman form Edit Produk untuk penjual (Seller Dashboard).
 * Menggunakan URL Parameter (?productId=...) untuk memuat data lama produk yang akan diedit.
 * @param productId ID unik produk yang ingin disunting
 */
export const buildSellerEditProductHref = (productId: string) =>
  // Mengarahkan ke form edit produk di dashboard seller
  `/seller/products/edit?productId=${encodeURIComponent(productId)}`;

