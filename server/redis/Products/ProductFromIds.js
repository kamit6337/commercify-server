import {
  getSingleProductRedis,
  setSingleProductRedis,
} from "./SingleProduct.js";

export const getProductFromIdsRedis = async (productIds) => {
  let getProducts = productIds.map((productId) =>
    getSingleProductRedis(productId)
  );
  getProducts = await Promise.all(getProducts);

  const get = getProducts.some((product) => product === null);
  if (get) return null;

  return getProducts;
};

export const setProductFromIdsRedis = async (products) => {
  const promises = products.map((product) => setSingleProductRedis(product));
  await Promise.all(promises);
};
