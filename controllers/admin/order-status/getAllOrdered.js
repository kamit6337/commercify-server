import getAllOrderedDB from "../../../database/Buy/Order-Status/getAllOrderedDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";

const getAllOrdered = catchAsyncError(async (req, res, next) => {
  const { page = 1 } = req.query;

  const limit = 10;

  const buys = await getAllOrderedDB(page, limit);

  res.json(buys);
});

export default getAllOrdered;
