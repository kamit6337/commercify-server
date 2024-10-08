import redisClient from "../redisClient.js";

// NOTE: GET PRODUCT RATINGS WITH PAGINATION
export const getProductRatingsRedis = async (productId, page, limit) => {
  const ratingKey = `Product-Rating:${productId}`;

  const skip = (page - 1) * limit;

  const ratingIds = await redisClient.zrevrange(
    ratingKey,
    skip,
    skip + limit - 1
  );

  if (ratingIds.length === 0) return [];

  const ratingPromises = ratingIds.map((ratingId) =>
    redisClient.get(`Ratings:${ratingId}`)
  );

  const ratings = await Promise.all(ratingPromises);
  return ratings.map((rating) => JSON.parse(rating));
};

// NOTE: STORE PRODUCT RATINGS IN ONE GO
export const storeRatingInRedis = async (productId, ratings) => {
  const ratingKey = `Product-Rating:${productId}`;

  if (ratings.length === 0) return;

  try {
    const multi = redisClient.multi(); // Use Redis multi for batch processing

    // Loop through each rating and add to Redis commands
    for (const rating of ratings) {
      // Store ratingId in a sorted set with score based on createdAt timestamp
      multi.zadd(ratingKey, rating.createdAt.getTime(), rating._id.toString());

      // Store rating in a Redis hash
      multi.set(`Ratings:${rating._id.toString()}`, JSON.stringify(rating));
    }

    // Execute all Redis commands in a batch
    await multi.exec();
  } catch (err) {
    console.error("Error storing ratings in Redis:", err);
    throw new Error("Failed to store ratings in Redis");
  }
};

// NOTE: STORE SINGLE RATINGS
export const storeSingleRatingInRedis = async (productId, rating) => {
  const ratingKey = `Product-Rating:${productId}`;

  // Store ratingId in a sorted set with score based on createdAt timestamp
  await redisClient.zadd(ratingKey, rating.createdAt.getTime(), rating._id);

  // Store rating in a Redis hash
  await redisClient.set(
    `Ratings:${rating._id.toString()}`,
    JSON.stringify(rating)
  );
};

// NOTE: UPDATE SINGLE RATING
export const updateProductRatingRedis = async (rating) => {
  const get = await redisClient.get(`Ratings:${rating._id.toString()}`);

  if (!get) return null;

  await redisClient.set(
    `Ratings:${rating._id.toString()}`,
    JSON.stringify(rating)
  );
};

// NOTE: DELETE SINGLE RATING
export const deleteProductRatingRedis = async (productId, ratingId) => {
  const ratingKey = `Product-Rating:${productId}`;

  // Remove ratingId from the sorted set
  await redisClient.zrem(ratingKey, ratingId);

  // Remove rating from Redis hash
  await redisClient.del(`Ratings:${ratingId}`);
};
