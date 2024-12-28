import redisClient from "../redisClient.js";

export const getLocationKeyFromRedis = async () => {
  const get = await redisClient.get("Location-Key");
  return get;
};

export const setLocationKetIntoRedis = async (key) => {
  if (!key) return;

  await redisClient.set("Location-Key", key, "EX", 60 * 60 * 24);
};
