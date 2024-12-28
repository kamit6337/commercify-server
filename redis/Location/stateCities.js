import redisClient from "../redisClient.js";

export const getStateCitiesFromRedis = async (state) => {
  if (!state) return null;

  const get = await redisClient.get(`State-Cities:${state}`);
  return get ? JSON.parse(get) : null;
};

export const setStateCitiesIntoRedis = async (state, cities) => {
  if (!state || !cities?.length) return;

  await redisClient.set(
    `State-Cities:${state}`,
    JSON.stringify(cities),
    "EX",
    60 * 60 * 24
  );
};
