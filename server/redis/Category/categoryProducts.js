import redisClient from "../redisClient.js";

export const getCaterogyProductsRedis = async (categoryId, page, limit) => {
  const skip = (page - 1) * limit;

  const productIds = await redisClient.zrevrange(
    `Category-ProductIds:${categoryId}`,
    skip,
    skip + limit - 1
  );

  if (!productIds || productIds.length === 0) return null;

  let getProducts = productIds.map((productId) =>
    redisClient.get(`Product:${productId}`)
  );

  getProducts = await Promise.all(getProducts);

  return getProducts.map((product) => JSON.parse(product));
};

export const setCaterogyProductsRedis = async (categoryId, products) => {
  if (!products || products.length === 0) return;

  try {
    // Start the multi command (transaction)
    const multi = redisClient.multi();

    for (const product of products) {
      multi.zadd(
        `Category-ProductIds:${categoryId}`,
        product.createdAt.getTime(),
        product._id.toString()
      );

      multi.expire(`Category-ProductIds:${categoryId}`, 3400);

      multi.set(
        `Product:${product._id.toString()}`,
        JSON.stringify(product),
        "EX",
        3600
      );
    }

    // Execute all the commands atomically
    await multi.exec();
  } catch (error) {
    console.error("Redis transaction failed:", error);
  }
};
