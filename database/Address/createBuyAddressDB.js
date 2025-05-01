import Address from "../../models/AddressModel.js";
import { setAddressByIDRedis } from "../../redis/Address/address.js";

const createBuyAddressDB = async (obj) => {
  const addNewAddress = await Address.create({
    ...obj,
  });

  await setAddressByIDRedis(addNewAddress);

  return addNewAddress;
};

export default createBuyAddressDB;
