import redisClient from "../redisClient.js";
import { getSingleProductRedis } from "./SingleProduct.js";

export const getLatestProductsRedis = async (page, limit) => {
  const skip = (page - 1) * limit;

  const productIds = await redisClient.zrevrange(
    `Latest-Products`,
    skip,
    skip + limit - 1
  );

  if (!productIds || productIds.length === 0) return null;

  let getProducts = productIds.map((productId) =>
    getSingleProductRedis(productId)
  );

  getProducts = await Promise.all(getProducts);

  return getProducts;
};

export const setLatestProductsRedis = async (products) => {
  if (!products || products.length === 0) return;

  try {
    const multi = redisClient.multi();

    for (const product of products) {
      multi.zadd(
        `Latest-Products`,
        product.createdAt.getTime(),
        product._id.toString()
      );

      multi.expire(`Latest-Products`, 3600);

      multi.set(
        `Product:${product._id.toString()}`,
        JSON.stringify(product),
        "EX",
        3600
      );
    }

    await multi.exec();
  } catch (error) {
    console.log("error", error);
  }
};
