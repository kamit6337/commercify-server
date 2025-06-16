import Rating from "../../models/RatingModel.js";
import { updateProductRatingRedis } from "../../redis/Ratings/rating.js";

const updateRatingDB = async (obj) => {
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

  // await updateProductRatingRedis(update);

  return update;
};

export default updateRatingDB;
