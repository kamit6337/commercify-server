import getProductRatingsDB from "../../database/Ratings/getProductRatingsDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const productRatings = catchAsyncError(async (req, res, next) => {
  const { id: productId, page = 1 } = req.query;

  if (!productId) {
    return next(new HandleGlobalError("Product Id is not provided", 404));
  }

  const ratings = await getProductRatingsDB(productId, page);

  res.json(ratings);
});

export default productRatings;
