import redisClient from "../redisClient.js";

export const getProductFromIdsRedis = async (productIds) => {
  if (!productIds?.length) return null;

  let promises = productIds.map((productId) =>
    redisClient.get(`Product:${productId}`)
  );

  const products = await Promise.all(promises);

  const isNullPresent = products.some((product) => !product);

  if (isNullPresent) return null;

  return products.map((product) => JSON.parse(product));
};

export const setProductFromIdsRedis = async (products) => {
  if (!products?.length) return;

  const promises = products.map((product) =>
    redisClient.set(
      `Product:${product._id.toString()}`,
      JSON.stringify(product),
      "EX",
      3600
    )
  );

  await Promise.all(promises);
};
