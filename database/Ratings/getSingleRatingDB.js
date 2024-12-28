import Rating from "../../models/RatingModel.js";
import {
  getSingleRatingFromRedis,
  setSingleRatingInRedis,
} from "../../redis/Ratings/rating.js";

const getSingleRatingDB = async (ratingId) => {
  if (!ratingId) {
    throw new Error("Rating ID is not provided");
  }

  const get = await getSingleRatingFromRedis(ratingId);

  if (get) {
    return get;
  }

  const rating = await Rating.findOne({
    _id: ratingId,
  })
    .populate({
      path: "user",
      select: "_id name photo",
    })
    .lean();

  await setSingleRatingInRedis(rating.product, rating);

  return rating;
};

export default getSingleRatingDB;
