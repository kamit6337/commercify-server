import getAllDeliveredDB from "../../../database/Buy/Order-Status/getAllDeliveredDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";

const getAllDelivered = catchAsyncError(async (req, res, next) => {
  const { page = 1 } = req.query;

  const limit = 10;

  const response = await getAllDeliveredDB(page, limit);

  res.json(response);
});

export default getAllDelivered;
