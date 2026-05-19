export const buildProductDetailHref = (productId: string) =>
  `/product/detail?productId=${encodeURIComponent(productId)}`;

export const buildStoreDetailHref = (storeId: string) =>
  `/store/detail?storeId=${encodeURIComponent(storeId)}`;

export const buildSellerEditProductHref = (productId: string) =>
  `/seller/products/edit?productId=${encodeURIComponent(productId)}`;
