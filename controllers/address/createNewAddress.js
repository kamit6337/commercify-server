import createNewAddressDB from "../../database/Address/createNewAddressDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const createNewAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const {
    name,
    dial_code,
    mobile,
    address,
    country,
    state,
    district,
    country_code,
  } = req.body;

  if (
    !name ||
    !dial_code ||
    !mobile ||
    !address ||
    !country ||
    !state ||
    !district ||
    !country_code
  ) {
    return next(new HandleGlobalError("All field must provide", 404));
  }

  const mobileNumWithDialCode = dial_code + mobile;

  const phoneNumber = parsePhoneNumberFromString(
    mobileNumWithDialCode,
    country_code
  );

  if (!phoneNumber || !phoneNumber.isValid()) {
    return next(new HandleGlobalError("Invalid Mobile Number", 404));
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
