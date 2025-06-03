import getOrdersDB from "../../database/Order-Status/getOrdersDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getOrdersCount = catchAsyncError(async (req, res, next) => {
  const { time = "month" } = req.query;

  const response = await getOrdersDB(time);

  res.json(response);
});

export default getOrdersCount;
