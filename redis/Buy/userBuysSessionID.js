import redisClient from "../redisClient.js";

export const getUserBuysBySessionID = async (sessionId) => {
  if (!sessionId) return null;

  const buyIds = await redisClient.zrevrange(
    `Buys-SessionId:${sessionId}`,
    0,
    -1
  );

  if (!buyIds || buyIds.length === 0) return null;

  let promises = buyIds.map((buyId) => redisClient.get(`Buy:${buyId}`));
  const buys = await Promise.all(promises);

  const isNullPresent = buys.some((buy) => !buy);
  if (isNullPresent) return null;

  return buys.map((buy) => JSON.parse(buy));
};

export const setUserBuysBySessionID = async (sessionId, buys) => {
  if (!sessionId || !buys.length) {
    throw new Error("sessionId or Buys is not provided");
  }

  const multi = redisClient.multi();

  for (const buy of buys) {
    const newDate = new Date(buy.createdAt);
    const score = newDate.getTime();

    multi.zadd(`Buys-SessionId:${sessionId}`, score, buy._id);

    multi.set(`Buy:${buy._id}`, JSON.stringify(buy), "EX", 3600);
  }

  multi.expire(`Buys-SessionId:${sessionId}`, 3600);
  await multi.exec();
};
