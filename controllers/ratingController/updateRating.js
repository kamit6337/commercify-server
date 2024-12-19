import updateRatingDB from "../../databases/Ratings/updateRatingDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updateRating = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { _id, rate, title, comment } = req.body;

  if (!_id || !rate || !title || !comment) {
    return next(new HandleGlobalError("Please provide all fields", 404));
  }

  const obj = {
    _id,
    rate: Number(rate),
    title,
    comment,
  };

  const update = await updateRatingDB(user, obj);

  res.json(update);
});
export default updateRating;
