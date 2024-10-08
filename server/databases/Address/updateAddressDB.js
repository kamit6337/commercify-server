import Address from "../../models/AddressModel.js";
import { updateSingleUserAddressRedis } from "../../redis/Address/address.js";

const updateAddressDB = async (obj) => {
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

  await updateSingleUserAddressRedis(updateAdd);

  return updateAdd;
};

export default updateAddressDB;
