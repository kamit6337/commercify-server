import Address from "../../models/AddressModel.js";
import { setSingleUserAddressRedis } from "../../redis/Address/address.js";

const createNewAddressDB = async (obj, userId) => {
  const addNewAddress = await Address.create({
    ...obj,
    user: userId,
    mobile: Number(obj.mobile),
  });

  await setSingleUserAddressRedis(userId, addNewAddress);

  return addNewAddress;
};

export default createNewAddressDB;
