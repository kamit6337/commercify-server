import redisClient from "../redisClient.js";

export const getUserBuysRedis = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  const buyIds = await redisClient.zrevrange(
    `User-Buys:${userId}`,
    skip,
    skip + limit - 1
  );

  if (!buyIds || buyIds.length === 0) return null;

  let getBuys = buyIds.map((buyId) => redisClient.get(`Buy:${buyId}`));
  getBuys = await Promise.all(getBuys);
  return getBuys.map((buy) => JSON.parse(buy));
};

export const setUserBuysRedis = async (userId, buys) => {
  const multi = redisClient.multi();

  for (const buy of buys) {
    multi.zadd(
      `User-Buys:${userId}`,
      buy.createdAt.getTime(),
      buy._id.toString()
    );

    multi.expire(`User-Buys:${userId}`, 3600);

    multi.set(`Buy:${buy._id.toString()}`, JSON.stringify(buy), "EX", 3600);
  }

  await multi.exec();
};

export const updateUserBuysRedis = async (buy) => {
  const get = await redisClient.get(`Buy:${buy._id.toString()}`);

  if (!get) return null;

  const updated = {
    ...JSON.parse(get),
    ...buy,
  };

  await redisClient.set(`Buy:${buy._id.toString()}`, JSON.stringify(updated));
};
