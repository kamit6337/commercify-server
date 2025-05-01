import redisClient from "../redisClient.js";

export const getSingleBuyFromRedis = async (buyId) => {
  if (!buyId) return null;

  const get = await redisClient.get(`Buy:${buyId}`);

  return get ? JSON.parse(get) : null;
};

export const getUserBuysRedis = async (userId, page, limit) => {
  if (!userId || !page || !limit) return null

  const skip = (page - 1) * limit;

  const buyIds = await redisClient.zrevrange(
    `User-Buys:${userId}`,
    skip,
    skip + limit - 1
  );

  if (!buyIds || buyIds.length === 0) return null;

  let promises = buyIds.map((buyId) => redisClient.get(`Buy:${buyId}`));
  const buys = await Promise.all(promises);

  const isNullPresent = buys.some((buy) => !buy);
  if (isNullPresent) return null;

  return buys.map((buy) => JSON.parse(buy));
};

export const setUserBuysRedis = async (userId, buys) => {
  if (!userId || !buys || buys.length === 0) return;

  const multi = redisClient.multi();

  for (const buy of buys) {
    const newDate = new Date(buy.createdAt);
    const score = newDate.getTime();

    multi.zadd(`User-Buys:${userId}`, score, buy._id);

    multi.set(`Buy:${buy._id}`, JSON.stringify(buy), "EX", 3600);
  }

  multi.expire(`User-Buys:${userId}`, 3600);
  await multi.exec();
};

export const setSingleUserBuyRedis = async (userId, buy) => {
  if (!userId || !buy) return;

  const newDate = new Date(buy.createdAt);
  const score = newDate.getTime();

  await redisClient.zadd(`User-Buys:${userId}`, score, buy._id);

  await redisClient.expire(`User-Buys:${userId}`, 3600);

  await redisClient.set(`Buy:${buy._id}`, JSON.stringify(buy), "EX", 3600);
};

export const updateUserBuysRedis = async (buy) => {
  if (!buy) return;

  const get = await redisClient.get(`Buy:${buy._id.toString()}`);

  if (!get) return null;

  const updated = {
    ...JSON.parse(get),
    ...buy,
  };

  await redisClient.set(`Buy:${buy._id.toString()}`, JSON.stringify(updated));
};
