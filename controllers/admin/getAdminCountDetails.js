import getOrderStatusDB from "../../database/Order-Status/getOrderStatusDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getAdminCountDetails = catchAsyncError(async (req, res, next) => {
  const { time = "month" } = req.query;

  const response = await getOrderStatusDB(time);

  res.json(response);
});

export default getAdminCountDetails;
