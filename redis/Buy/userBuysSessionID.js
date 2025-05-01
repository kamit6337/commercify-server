import redisClient from "../redisClient.js";

export const getUserBuysBySessionID = async (orderId) => {
  if (!orderId) return null;

  const buyIds = await redisClient.zrevrange(`Buys-OrderId:${orderId}`, 0, -1);

  if (!buyIds || buyIds.length === 0) return null;

  let promises = buyIds.map((buyId) => redisClient.get(`Buy:${buyId}`));
  const buys = await Promise.all(promises);

  const isNullPresent = buys.some((buy) => !buy);
  if (isNullPresent) return null;

  return buys.map((buy) => JSON.parse(buy));
};

export const setUserBuysBySessionID = async (orderId, buys) => {
  if (!orderId || !buys || buys.length === 0) return;

  const multi = redisClient.multi();

  for (const buy of buys) {
    const newDate = new Date(buy.createdAt);
    const score = newDate.getTime();

    multi.zadd(`Buys-OrderId:${orderId}`, score, buy._id);

    multi.set(`Buy:${buy._id}`, JSON.stringify(buy), "EX", 3600);
  }

  multi.expire(`Buys-OrderId:${orderId}`, 3600);
  await multi.exec();
};

export const setUserSingleBuyByOrderId = async (orderId, buy) => {
  if (!orderId || !buy) return;

  const newDate = new Date(buy.createdAt);
  const score = newDate.getTime();

  await redisClient.zadd(`Buys-OrderId:${orderId}`, score, buy._id);
  await redisClient.expire(`Buys-OrderId:${orderId}`, 3600);

  await redisClient.set(`Buy:${buy._id}`, JSON.stringify(buy), "EX", 3600);
};
