import Rating from "../../models/RatingModel.js";
import { deleteProductRatingRedis } from "../../redis/Ratings/rating.js";

const deleteRatingDB = async (productId, ratingId) => {
  await Rating.findOneAndDelete({
    _id: ratingId,
  });

  await deleteProductRatingRedis(productId, ratingId);
};
export default deleteRatingDB;
