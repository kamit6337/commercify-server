import redisClient from "../redisClient.js";

export const getCountryStatesFromRedis = async (country) => {
  if (!country) return null;

  const get = await redisClient.get(`Country-States:${country}`);
  return get ? JSON.parse(get) : null;
};

export const setCountryStatesIntoRedis = async (country, data) => {
  if (!country || !data?.length) return;

  await redisClient.set(
    `Country-States:${country}`,
    JSON.stringify(data),
    "EX",
    60 * 60 * 24
  );
};
