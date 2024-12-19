import redisClient from "../redisClient.js";

export const getUserAddressRedis = async (userId) => {
  const getAddressId = await redisClient.smembers(`user-addresses:${userId}`);

  if (!getAddressId || getAddressId.length === 0) return null;

  let getAddress = getAddressId.map((addressId) =>
    redisClient.get(`address:${addressId}`)
  );

  getAddress = await Promise.all(getAddress);
  const get = getAddress.map((address) => JSON.parse(address));

  return get;
};

export const setUserAddressRedis = async (userId, addresses) => {
  const addressIds = addresses.map((address) => address._id.toString());

  await redisClient.sadd(`user-addresses:${userId}`, ...addressIds);

  // Set expiration for the set (e.g., 1 hour)
  await redisClient.expire(`user-addresses:${userId}`, 3400); // 3600 seconds = 1 hour

  const setAddress = addresses.map((address) =>
    redisClient.set(
      `address:${address._id.toString()}`,
      JSON.stringify(address),
      "EX",
      3600
    )
  );

  await Promise.all(setAddress);
};

export const setSingleUserAddressRedis = async (userId, address) => {
  await redisClient.sadd(`user-addresses:${userId}`, address._id.toString());

  await redisClient.expire(`user-addresses:${userId}`, 3400); // 3600 seconds = 1 hour

  await redisClient.set(
    `address:${address._id.toString()}`,
    JSON.stringify(address),
    "EX",
    3600
  );
};

export const updateSingleUserAddressRedis = async (address) => {
  const get = await redisClient.get(`address:${address._id.toString()}`);

  if (!get) return;

  const getTtl = await getRemainingTTL(`address:${address._id.toString()}`);

  await redisClient.set(
    `address:${address._id.toString()}`,
    JSON.stringify(address),
    "EX",
    getTtl ? getTtl : 3600
  );
};

export const deleteSingleUserAddressRedis = async (userId, addressId) => {
  await redisClient.srem(`user-addresses:${userId}`, addressId);

  await redisClient.del(`address:${addressId}`);
};
