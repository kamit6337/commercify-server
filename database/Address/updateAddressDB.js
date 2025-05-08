import Address from "../../models/AddressModel.js";

const updateAddressDB = async (obj) => {
  if (!obj) {
    throw new Error("Obj is not provided");
  }

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

  return updateAdd;
};

export default updateAddressDB;
