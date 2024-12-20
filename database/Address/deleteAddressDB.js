import Address from "../../models/AddressModel.js";
import { deleteSingleUserAddressRedis } from "../../redis/Address/address.js";

const deleteAddressDB = async (userId, id) => {
  await Address.deleteOne({
    _id: id,
  });

  await deleteSingleUserAddressRedis(userId, id);
};

export default deleteAddressDB;
