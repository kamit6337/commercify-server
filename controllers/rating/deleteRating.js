import deleteRatingDB from "../../database/Ratings/deleteRatingDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const deleteRating = catchAsyncError(async (req, res, next) => {
  const { productId, ratingId } = req.query;

  if (!productId || !ratingId) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  await deleteRatingDB(productId, ratingId);

  res.json("deleted successfully");
});

export default deleteRating;
