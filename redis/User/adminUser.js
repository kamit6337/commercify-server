import redisClient from "../redisClient.js";

export const getAdminUsersFromRedis = async () => {
  const get = await redisClient.smembers("Admin-Users");

  if (!get || get.length === 0) return null;

  return get;
};

export const setAdminUsersIntoRedis = async (list) => {
  if (!list || list.length === 0) return;

  await redisClient.sadd("Admin-Users", ...list);

  await redisClient.expire("Admin-Users", 3600);
};
