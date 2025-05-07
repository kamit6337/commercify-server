import getAllUndeliveredDB from "../../../database/Buy/Order-Status/getAllUndeliveredDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";

const getAllUndelivered = catchAsyncError(async (req, res, next) => {
  const { page = 1 } = req.query;

  const limit = 10;

  const response = await getAllUndeliveredDB(page, limit);

  res.json(response);
});

export default getAllUndelivered;
