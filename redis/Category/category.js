import redisClient from "../redisClient.js";

export const getAllCategoryRedis = async () => {
  const get = await redisClient.get("Category:all");
  return get ? JSON.parse(get) : null;
};

export const setAllCategoryRedis = async (data) => {
  await redisClient.set("Category:all", JSON.stringify(data), "EX", 3600);
};
