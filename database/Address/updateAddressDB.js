import Address from "../../models/AddressModel.js";
import { setSingleUserAddressRedis } from "../../redis/Address/address.js";

const updateAddressDB = async (userId, obj) => {
  const updateAdd = await Address.findOneAndUpdate(
    {
      _id: obj._id,
    },
    {
      ...obj,
      mobile: Number(obj.mobile),
    },
    {
      new: true,
    }
  );

  await setSingleUserAddressRedis(userId, updateAdd);

  return updateAdd;
};

export default updateAddressDB;
