import redisClient from "../redisClient.js";

export const getSearchProductsRedis = async (query) => {
  const getProductIds = await redisClient.smembers(
    `Search-ProductIds:${query}`
  );
  if (!getProductIds || getProductIds.length === 0) return null;

  let getProducts = getProductIds.map((productId) =>
    redisClient.get(`Product:${productId}`)
  );
  getProducts = await Promise.all(getProducts);
  return getProducts.map((product) => JSON.parse(product));
};

export const setSearchProductsRedis = async (query, products) => {
  const productIds = products.map((product) => product._id.toString());

  try {
    const multi = redisClient.multi();

    multi.sadd(`Search-ProductIds:${query}`, ...productIds);

    multi.expire(`Search-ProductIds:${query}`, 3600);

    for (const product of products) {
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
