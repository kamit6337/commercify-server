import redisClient from "../redisClient.js";

export const getUserByIdRedis = async (userId) => {
  const get = await redisClient.get(`User:${userId}`);
  return get ? JSON.parse(get) : null;
};

export const getUserByMobileRedis = async (mobile) => {
  const userId = await redisClient.get(`User-Mobile:${mobile}`);

  if (!userId) return null;

  const get = await redisClient.get(`User:${userId}`);

  return get ? JSON.parse(get) : null;
};

export const setUserIntoRedis = async (user) => {
  await redisClient.set(
    `User:${user._id.toString()}`,
    JSON.stringify(user),
    "EX",
    3600
  );

  await redisClient.set(
    `User-Mobile:${user.mobile}`,
    user._id.toString(),
    "EX",
    3600
  );
};
