import getAllReturnedDB from "../../../database/Buy/Order-Status/getAllReturnedDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";

const getAllReturned = catchAsyncError(async (req, res, next) => {
  const { page = 1 } = req.query;

  const limit = 10;

  const response = await getAllReturnedDB(page, limit);

  res.json(response);
});

export default getAllReturned;
