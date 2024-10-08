import createNewAddressDB from "../../databases/Address/createNewAddressDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

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
    name,
    dial_code,
    mobile,
    address,
    country,
    state,
    district,
  };

  const addNewAddress = await createNewAddressDB(obj, userId);

  res.json(addNewAddress);
});

export default createNewAddress;
