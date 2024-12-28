import redisClient from "../redisClient.js";

export const getCurrencyExchangeFromRedis = async () => {
  const get = await redisClient.get("Cuurency-Exchange");

  return get ? JSON.parse(get) : null;
};

export const setCurrencyExchangeIntoRedis = async (data) => {
  if (!data) return;

  await redisClient.set(
    "Cuurency-Exchange",
    JSON.stringify(data),
    "EX",
    60 * 60 * 24 // 1 day
  );
};
