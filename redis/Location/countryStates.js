import redisClient from "../redisClient.js";

export const getCountryStatesFromRedis = async (country, code) => {
  if (!country || !code) return null;

  const get = await redisClient.get(`Country-States:${country}:${code}`);
  return get ? JSON.parse(get) : null;
};

export const setCountryStatesIntoRedis = async (country, code, data) => {
  if (!country || !code || !data?.length) return;

  await redisClient.set(
    `Country-States:${country}:${code}`,
    JSON.stringify(data),
    "EX",
    60 * 60 * 24
  );
};
