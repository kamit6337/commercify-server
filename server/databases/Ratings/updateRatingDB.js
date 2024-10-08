import Rating from "../../models/RatingModel.js";
import { updateProductRatingRedis } from "../../redis/Ratings/productRatings.js";

const updateRatingDB = async (user, obj) => {
  const update = await Rating.findOneAndUpdate(
    {
      _id: obj._id,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  ).lean();

  update.user = {
    _id: user._id,
    name: user.name,
    photo: user.photo,
  };

  await updateProductRatingRedis(update);

  return update;
};

export default updateRatingDB;
