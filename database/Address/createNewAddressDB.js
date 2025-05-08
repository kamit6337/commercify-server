import Address from "../../models/AddressModel.js";

const createNewAddressDB = async (obj) => {
  if (!obj) {
    throw new Error("Obj is not provided");
  }

  const addNewAddress = await Address.create({
    ...obj,
  });

  return addNewAddress;
};

export default createNewAddressDB;
