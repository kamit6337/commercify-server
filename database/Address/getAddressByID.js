import Address from "../../models/AddressModel.js";
import {
  getAddressByIDRedis,
  setAddressByIDRedis,
} from "../../redis/Address/address.js";

const getAddressByID = async (addressId) => {
  if (!addressId) {
    throw new Error("AddressId is not provided");
  }

  const get = await getAddressByIDRedis(addressId);

  if (get) {
    return get;
  }

  const address = await Address.findOne({ _id: addressId }).lean();

  await setAddressByIDRedis(address);

  return address;
};

export default getAddressByID;
