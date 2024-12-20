import redisClient from "../redisClient.js";

export const getSearchProductsRedis = async (query, page, limit) => {
  if (!query || !page || !limit) return null;

  const skip = (page - 1) * limit;

  const productIds = await redisClient.zrevrange(
    `Product-Search-Query:${query}`,
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

export const setSearchProductsRedis = async (query, products) => {
  if (!query || !products?.length) return;

  const multi = redisClient.multi();

  for (const product of products) {
    const newDate = new Date(product.createdAt);
    const score = newDate.getTime();

    multi.zadd(`Product-Search-Query:${query}`, score, product._id);

    multi.set(
      `Product:${product._id.toString()}`,
      JSON.stringify(product),
      "EX",
      3600
    );
  }

  multi.expire(`Product-Search-Query:${query}`, 3600);

  await multi.exec();
};
