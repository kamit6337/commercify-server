import Address from "../../models/AddressModel.js";

const getAddressByID = async (addressId) => {
  if (!addressId) {
    throw new Error("AddressId is not provided");
  }

  const address = await Address.findOne({ _id: addressId }).lean();

  return address;
};

export default getAddressByID;
