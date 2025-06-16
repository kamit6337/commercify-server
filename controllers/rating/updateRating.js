import updateRatingDB from "../../database/Ratings/updateRatingDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const updateRating = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { _id, rate, title, comment } = req.body;

  if (!_id || !rate) {
    return next(new HandleGlobalError("Please provide all fields", 404));
  }

  const obj = {
    _id,
    rate: parseFloat(rate),
  };

  if (title) obj.title = title;
  if (comment) obj.comment = comment;
  const update = await updateRatingDB(obj);

  const modifyUpdate = {
    ...update,
    user: {
      _id: user._id,
      name: user.name,
      photo: user.photo,
      email: user.email,
    },
  };

  res.json(modifyUpdate);
});
export default updateRating;
