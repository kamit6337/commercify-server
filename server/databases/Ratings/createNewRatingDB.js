import Rating from "../../models/RatingModel.js";
import { storeSingleRatingInRedis } from "../../redis/Ratings/productRatings.js";

const createNewRatingDB = async (user, obj) => {
  const createRating = await Rating.create({
    ...obj,
  });

  const { _id, rate, title, comment, createdAt, updatedAt } = createRating;

  const createRatingData = {
    _id: String(_id),
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

  console.log("createRating", createRating);
  console.log("createRatingData", createRatingData);

  await storeSingleRatingInRedis(obj.product, createRatingData);

  return createRatingData;
};

export default createNewRatingDB;
