import Rating from "../../models/RatingModel.js";
import { setSingleRatingInRedis } from "../../redis/Ratings/rating.js";

const createNewRatingDB = async (user, obj) => {
  const createRating = await Rating.create({
    ...obj,
  });

  const { _id, rate, title, comment, createdAt, updatedAt } = createRating;

  const createRatingData = {
    _id,
    rate,
    title,
    comment,
    createdAt,
    updatedAt,
    user: {
      _id: user._id,
      name: user.name,
      photo: user.photo,
    },
  };

  await setSingleRatingInRedis(obj.product, createRatingData);

  return createRatingData;
};

export default createNewRatingDB;
