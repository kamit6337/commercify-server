import redisClient from "../redisClient.js";

export const getUserBuysCountRedis = async (userId) => {
  const get = await redisClient.get(`User-Buys-Count:${userId}`);
  return get ? get : null;
};

export const setUserBuysCountRedis = async (userId, buysCount) => {
  await redisClient.set(`User-Buys-Count:${userId}`, buysCount, "EX", 3600);
};
