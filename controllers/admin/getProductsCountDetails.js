import getProductCountDetailsDB from "../../database/Products/getProductCountDetailsDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getProductsCountDetails = catchAsyncError(async (req, res, next) => {
  const response = await getProductCountDetailsDB();

  res.json(response);
});

export default getProductsCountDetails;
