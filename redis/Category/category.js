import redisClient from "../redisClient.js";

export const getAllCategoryRedis = async () => {
  const categoryIds = await redisClient.zrevrange(`All-Category`, 0, -1);

  if (!categoryIds || categoryIds.length === 0) return null;

  const promises = categoryIds.map((categoryId) =>
    redisClient.get(`Category:${categoryId}`)
  );

  const categories = await Promise.all(promises);

  const isNullPresent = categories.some((category) => !category);

  if (isNullPresent) return null;

  return categories.map((category) => JSON.parse(category));
};

export const getSingleCategoryFromRedis = async (categoryId) => {
  if (!categoryId) return null;

  const category = await redisClient.get(`Category:${categoryId}`);
  return category ? JSON.parse(category) : null;
};

export const setAllCategoryRedis = async (categories) => {
  if (!categories || categories.length === 0) return;

  const multi = redisClient.multi();

  for (const category of categories) {
    const newDate = new Date(category.createdAt);
    const score = newDate.getTime();

    multi.zadd(`All-Category`, score, category._id.toString());

    multi.set(
      `Category:${category._id.toString()}`,
      JSON.stringify(category),
      "EX",
      3600
    );
  }

  multi.expire(`All-Category`, 3600);

  await multi.exec();
};

export const setNewCategoryIntoRedis = async (category) => {
  if (!category) return;

  const newDate = new Date(category.createdAt);
  const score = newDate.getTime();

  await redisClient.zadd(`All-Category`, score, category._id.toString());

  await redisClient.set(
    `Category:${category._id.toString()}`,
    JSON.stringify(category),
    "EX",
    3600
  );

  await redisClient.expire(`All-Category`, 3600);
};

export const updateSingleCategoryIntoRedis = async (category) => {
  if (!category) return;

  await redisClient.set(
    `Category:${category._id.toString()}`,
    JSON.stringify(category),
    "EX",
    3600
  );
};
