import Address from "../../models/AddressModel.js";
import {
  getUserAddressRedis,
  setUserAddressRedis,
} from "../../redis/Address/address.js";

const getUserAddressDB = async (userId) => {
  const get = await getUserAddressRedis(userId);

  if (get) {
    return get;
  }

  const userAddress = await Address.find({
    user: userId,
  })
    .sort("-updatedAt")
    .lean();

  await setUserAddressRedis(userId, userAddress);

  return userAddress;
};

export default getUserAddressDB;
