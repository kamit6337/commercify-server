import deleteAddressDB from "../../database/Address/deleteAddressDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const deleteAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  await deleteAddressDB(userId, id);

  res.json("Address is deleted");
});

export default deleteAddress;
