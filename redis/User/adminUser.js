import redisClient from "../redisClient.js";

export const getAdminUsersFromRedis = async () => {
  const get = await redisClient.smembers("Admin-Users");

  if (!get || get.length === 0) return [];

  return get;
};

export const setAdminUsersIntoRedis = async (userId) => {
  if (!userId) return;

  await redisClient.sadd("Admin-Users", userId);

  await redisClient.expire("Admin-Users", 3600);
};
