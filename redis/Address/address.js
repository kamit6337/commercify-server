import redisClient from "../redisClient.js";

export const getAddressByIDRedis = async (addressId) => {
  if (!addressId) return null;

  const get = await redisClient.get(`Address:${addressId}`);
  return get ? JSON.parse(get) : null;
};

export const setAddressByIDRedis = async (address) => {
  if (!address) return;

  await redisClient.set(
    `Address:${address._id}`,
    JSON.stringify(address),
    "EX",
    3600
  );
};

export const getUserAddressRedis = async (userId) => {
  if (!userId) return null;

  const addressIds = await redisClient.zrevrange(
    `User-Adresses:${userId}`,
    0,
    -1
  );

  if (!addressIds?.length) return null;

  const promises = addressIds.map((addressId) =>
    redisClient.get(`Address:${addressId}`)
  );

  const addresses = await Promise.all(promises);

  const isNullPresent = addresses.some((address) => !address);

  if (isNullPresent) {
    return null;
  }

  return addresses.map((address) => JSON.parse(address));
};

export const setUserAddressRedis = async (userId, addresses) => {
  if (!userId || !addresses?.length) return;

  const multi = redisClient.multi();

  for (const address of addresses) {
    const newDate = new Date(address.updatedAt);
    const score = newDate.getTime();

    multi.zadd(`User-Adresses:${userId}`, score, address._id);

    multi.set(`Address:${address._id}`, JSON.stringify(address), "EX", 3600);
  }

  multi.expire(`User-Adresses:${userId}`, 3600);
  await multi.exec();
};

export const setSingleUserAddressRedis = async (userId, address) => {
  if (!userId || !address) {
    throw new Error("UserId or Address is not provided");
  }

  const newDate = new Date(address.updatedAt);
  const score = newDate.getTime();

  await redisClient.zadd(`User-Adresses:${userId}`, score, address._id);

  await redisClient.set(
    `Address:${address._id}`,
    JSON.stringify(address),
    "EX",
    3600
  );
};

export const deleteSingleUserAddressRedis = async (userId, addressId) => {
  if (!userId || !addressId) {
    throw new Error("UserId or AddressId is not provided");
  }

  await redisClient.zrem(`User-Adresses:${userId}`, addressId);

  await redisClient.del(`Address:${addressId}`);
};
