import Address from "../../models/AddressModel.js";
import {
  getUserAddressRedis,
  setUserAddressRedis,
} from "../../redis/Address/address.js";

const getUserAddressDB = async (userId) => {
  const get = await getUserAddressRedis(userId);

  const userAddress = await Address.find({
    user: userId,
  }).lean();

  await setUserAddressRedis(userId, userAddress);

  return userAddress;
};

export default getUserAddressDB;
