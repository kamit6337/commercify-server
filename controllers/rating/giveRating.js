import userBuyUpdateDB from "../../database/Buy/userBuyUpdateDB.js";
import createNewRatingDB from "../../database/Ratings/createNewRatingDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const giveRating = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const user = req.user;

  const { productId, buyId, rate, title = "", comment = "" } = req.body;

  if (!productId || !buyId || !rate) {
    return next(new HandleGlobalError("Please provide all fields", 404));
  }

  const obj = {
    user: userId,
    product: productId,
    rate: Number(rate),
    title,
    comment,
  };

  const createRating = await createNewRatingDB(obj);

  const updateBuy = await userBuyUpdateDB(buyId, { isReviewed: true });

  const createRatingData = {
    ...createRating,
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
      photo: user.photo,
    },
  };

  res.json({ buy: updateBuy, rating: createRatingData });
});

export default giveRating;
