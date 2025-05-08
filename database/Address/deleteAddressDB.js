import Address from "../../models/AddressModel.js";

const deleteAddressDB = async (id) => {
  if (!id) {
    throw new Error("Id is not provided");
  }

  const response = await Address.deleteOne({
    _id: id,
  });

  return response;
};

export default deleteAddressDB;
