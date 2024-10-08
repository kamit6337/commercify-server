import getUserAddressDB from "../../databases/Address/getUserAddressDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getUserAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const userAddress = await getUserAddressDB(userId);

  res.json(userAddress);
});

export default getUserAddress;
