import createNewRatingDB from "../../databases/Ratings/createNewRatingDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const giveRating = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const user = req.user;

  const { product, rate, title, comment } = req.body;

  if (!product || !rate || !title || !comment) {
    return next(new HandleGlobalError("Please provide all fields", 404));
  }

  console.log("req.body", req.body);

  const obj = {
    user: userId,
    product,
    rate: Number(rate),
    title,
    comment,
  };

  const createRating = await createNewRatingDB(user, obj);

  res.json(createRating);
});

export default giveRating;
