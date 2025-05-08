import createNewAddressDB from "../../database/Address/createNewAddressDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const createNewAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { name, dial_code, mobile, address, country, state, district } =
    req.body;

  if (
    !name ||
    !dial_code ||
    !mobile ||
    !address ||
    !country ||
    !state ||
    !district
  ) {
    return next(new HandleGlobalError("All field must provide", 404));
  }

  const obj = {
    user: userId,
    name,
    dial_code,
    mobile: parseInt(mobile),
    address,
    country,
    state,
    district,
  };

  const addNewAddress = await createNewAddressDB(obj);

  res.json(addNewAddress);
});

export default createNewAddress;
