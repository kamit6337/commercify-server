import updateAddressDB from "../../database/Address/updateAddressDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const updateAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { _id, name, dial_code, mobile, address, country, state, district } =
    req.body;

  if (
    !_id ||
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
    _id,
    name,
    dial_code,
    mobile: parseInt(mobile),
    address,
    country,
    state,
    district,
  };

  const updateAdd = await updateAddressDB(obj);

  res.json(updateAdd);
});

export default updateAddress;
