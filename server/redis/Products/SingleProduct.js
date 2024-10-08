import redisClient from "../redisClient.js";

export const getSingleProductRedis = async (productId) => {
  const get = await redisClient.get(`Product:${productId}`);
  return get ? JSON.parse(get) : null;
};

export const setSingleProductRedis = async (product) => {
  await redisClient.set(
    `Product:${product._id.toString()}`,
    JSON.stringify(product),
    "EX",
    3600
  );
};
