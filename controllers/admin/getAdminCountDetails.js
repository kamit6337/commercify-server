import getOrderStatusDB from "../../database/Order-Status/getOrderStatusDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getAdminCountDetails = catchAsyncError(async (req, res, next) => {
  const response = await getOrderStatusDB();

  res.json(response);
});

export default getAdminCountDetails;
