import redisClient from "../redisClient.js";

export const getCaterogyProductsRedis = async (categoryId, page, limit) => {
  const skip = (page - 1) * limit;

  const productIds = await redisClient.zrevrange(
    `Category-Products:${categoryId}`,
    skip,
    skip + limit - 1
  );

  if (!productIds || productIds.length === 0) return null;

  const promises = productIds.map((productId) =>
    redisClient.get(`Product:${productId}`)
  );

  const products = await Promise.all(promises);

  const isNullPresent = products.some((product) => !product);

  if (isNullPresent) return null;

  return products.map((product) => JSON.parse(product));
};

export const setCaterogyProductsRedis = async (categoryId, products) => {
  if (!categoryId || !products?.length) return;

  const multi = redisClient.multi();

  for (const product of products) {
    const newDate = new Date(product.createdAt);
    const score = newDate.getTime();

    multi.zadd(
      `Category-Products:${categoryId}`,
      score,
      product._id.toString()
    );

    multi.set(
      `Product:${product._id.toString()}`,
      JSON.stringify(product),
      "EX",
      3600
    );
  }

  multi.expire(`Category-Products:${categoryId}`, 3400);

  // Execute all the commands atomically
  await multi.exec();
};
