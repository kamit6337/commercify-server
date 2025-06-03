import redisClient from "../redisClient.js";

export const getCountriesFromRedis = async () => {
  const get = await redisClient.get("All-Countries");

  return get ? JSON.parse(get) : null;
};

export const setCountriesIntoRedis = async (data) => {
  if (!data) return;

  await redisClient.set(
    "All-Countries",
    JSON.stringify(data),
    "EX",
    24 * 60 * 60
  );
};
