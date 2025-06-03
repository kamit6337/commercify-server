import redisClient from "../redisClient.js";

export const getCurrencyExchangeFromRedis = async () => {
  const get = await redisClient.get("Currency-Exchange");

  return get ? JSON.parse(get) : null;
};

export const setCurrencyExchangeIntoRedis = async (data) => {
  if (!data) return;

  await redisClient.set(
    "Currency-Exchange",
    JSON.stringify(data),
    "EX",
    60 * 60 * 24 // 1 day
  );
};
