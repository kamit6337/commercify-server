import redisClient from "../redisClient.js";

export const getUserByIdRedis = async (userId) => {
  const get = await redisClient.get(`User-ID:${userId}`);
  return get ? JSON.parse(get) : null;
};

export const getUserByEmailRedis = async (email) => {
  const userId = await redisClient.get(`User-Email:${email}`);

  if (!userId) return null;

  const get = await redisClient.get(`User:${userId}`);

  return get ? JSON.parse(get) : null;
};

export const setUserIntoRedis = async (user) => {
  if (!user) return;

  await redisClient.set(
    `User-ID:${user._id.toString()}`,
    JSON.stringify(user),
    "EX",
    3600
  );

  await redisClient.set(
    `User-Email:${user.email}`,
    user._id.toString(),
    "EX",
    3600
  );
};
