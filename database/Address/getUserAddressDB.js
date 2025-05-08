import Address from "../../models/AddressModel.js";

const getUserAddressDB = async (userId) => {
  if (!userId) {
    throw new Error("UserId is not provided");
  }

  const userAddress = await Address.find({
    user: userId,
  })
    .sort("-updatedAt")
    .lean();

  return userAddress;
};

export default getUserAddressDB;
