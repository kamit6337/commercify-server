import redisClient from "../redisClient.js";

export const getSingleProductRedis = async (productId) => {
  const get = await redisClient.get(`Product:${productId}`);
  return get ? JSON.parse(get) : null;
};

export const setSingleProductRedis = async (product) => {
  if (!product) return;

  await redisClient.set(
    `Product:${product._id.toString()}`,
    JSON.stringify(product),
    "EX",
    3600
  );
};

export const deleteSingleProductRedis = async (productId) => {
  if (!productId) return;

  await redisClient.del(`Product:${productId.toString()}`);
};
