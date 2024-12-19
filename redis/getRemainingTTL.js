const getRemainingTTL = async (key) => {
  const ttl = await redisClient.ttl(key);

  if (ttl === -1 || ttl === -2) {
    return null;
  }

  return ttl;
};

export default getRemainingTTL;
