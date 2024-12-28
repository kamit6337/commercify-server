import redisClient from "../redisClient.js";

export const getSingleRatingFromRedis = async (ratingId) => {
  if (!ratingId) return null;

  const get = await redisClient.get(`Ratings:${ratingId}`);
  return get ? JSON.parse(get) : null;
};

// NOTE: GET PRODUCT RATINGS WITH PAGINATION
export const getProductRatingsRedis = async (productId, page, limit) => {
  if (!productId || !page || !limit) return null;

  const skip = (page - 1) * limit;

  const ratingIds = await redisClient.zrevrange(
    `Product-Rating:${productId}`,
    skip,
    skip + limit - 1
  );

  if (!ratingIds?.length) return null;

  const promises = ratingIds.map((ratingId) =>
    redisClient.get(`Ratings:${ratingId}`)
  );

  const ratings = await Promise.all(promises);

  const isNullPresent = ratings;

  if (isNullPresent) return null;

  return ratings.map((rating) => JSON.parse(rating));
};

// NOTE: STORE PRODUCT RATINGS IN ONE GO
export const setProductRatingsIntoRedis = async (productId, ratings) => {
  if (!productId || !ratings?.length) return;

  const multi = redisClient.multi();

  for (const rating of ratings) {
    const newDate = new Date(rating.createdAt);
    const score = newDate.getTime();

    multi.zadd(`Product-Rating:${productId}`, score, rating._id.toString());

    multi.set(
      `Ratings:${rating._id.toString()}`,
      JSON.stringify(rating),
      "EX",
      3600
    );
  }

  multi.expire(`Product-Rating:${productId}`, 3600);
  await multi.exec();
};

// NOTE: STORE SINGLE RATINGS
export const setSingleRatingInRedis = async (productId, rating) => {
  if (!productId || !rating) return;

  const newDate = new Date(rating.createdAt);
  const score = newDate.getTime();

  await redisClient.zadd(
    `Product-Rating:${productId}`,
    score,
    rating._id.toString()
  );

  await redisClient.expire(`Product-Rating:${productId}`, 3600);

  await redisClient.set(
    `Ratings:${rating._id.toString()}`,
    JSON.stringify(rating),
    "EX",
    3600
  );
};

// NOTE: UPDATE SINGLE RATING
export const updateProductRatingRedis = async (rating) => {
  if (!rating) return;

  await redisClient.set(
    `Ratings:${rating._id.toString()}`,
    JSON.stringify(rating),
    "EX",
    3600
  );
};

// NOTE: DELETE SINGLE RATING
export const deleteProductRatingRedis = async (productId, ratingId) => {
  if (!productId || !ratingId) return;

  await redisClient.zrem(`Product-Rating:${productId}`, ratingId);

  // Remove rating from Redis hash
  await redisClient.del(`Ratings:${ratingId}`);
};
