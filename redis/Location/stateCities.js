import redisClient from "../redisClient.js";

export const getStateCitiesFromRedis = async (state, code) => {
  if (!state || !code) return null;

  const get = await redisClient.get(`State-Cities:${state}:${code}`);
  return get ? JSON.parse(get) : null;
};

export const setStateCitiesIntoRedis = async (state, code, cities) => {
  if (!state || !code || !cities?.length) return;

  await redisClient.set(
    `State-Cities:${state}:${code}`,
    JSON.stringify(cities),
    "EX",
    60 * 60 * 24
  );
};
