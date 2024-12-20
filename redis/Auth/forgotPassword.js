import redisClient from "../redisClient.js";

export const getUserIdFromRedis = async (secretToken) => {
  if (!secretToken) {
    throw new Error("Secret Token is not provided");
  }

  const get = await redisClient.get(secretToken);

  return get;
};

export const setUserIdIntoRedis = async (
  secretToken,
  userId,
  time = 60 * 15 // 15 minutes
) => {
  if (!secretToken || !userId) return;

  await redisClient.set(secretToken, userId.toString(), "EX", time);
};

export const deleteKeyFromRedis = async (secretToken) => {
  if (!secretToken) {
    throw new Error("Secret Token is not provided");
  }

  const deleted = await redisClient.del(secretToken);

  if (deleted === 0) {
    console.log("Key not found or already deleted");
  }

  return "Key successfully deleted";
};
