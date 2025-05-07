import getAllCancelledDB from "../../../database/Buy/Order-Status/getAllCancelledDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";

const getAllCancelled = catchAsyncError(async (req, res, next) => {
  const { page = 1 } = req.query;

  const limit = 10;

  const response = await getAllCancelledDB(page, limit);

  res.json(response);
});

export default getAllCancelled;
