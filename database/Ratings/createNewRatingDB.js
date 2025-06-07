import Rating from "../../models/RatingModel.js";
import { setSingleRatingInRedis } from "../../redis/Ratings/rating.js";

const createNewRatingDB = async (obj) => {
  const createRating = await Rating.create({
    ...obj,
  });

  const newRating = JSON.parse(JSON.stringify(createRating));

  // await setSingleRatingInRedis(obj.product, newRating);

  return newRating;
};

export default createNewRatingDB;
