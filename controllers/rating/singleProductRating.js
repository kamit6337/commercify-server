import getSingleRatingDB from "../../database/Ratings/getSingleRatingDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const singleProductRating = catchAsyncError(async (req, res, next) => {
  const { id: ratingId } = req.query;

  if (!ratingId) {
    return next(new HandleGlobalError("Rating ID is not provided"));
  }

  const rating = await getSingleRatingDB(ratingId);

  res.json(rating);
});

export default singleProductRating;
