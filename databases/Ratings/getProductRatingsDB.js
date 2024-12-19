import Rating from "../../models/RatingModel.js";
import {
  getProductRatingsRedis,
  storeRatingInRedis,
} from "../../redis/Ratings/productRatings.js";

const getProductRatingsDB = async (productId, page) => {
  const limit = 10;
  const skip = (page - 1) * limit;

  if (page < 1) {
    throw new Error("Page must be greater than 1");
  }

  const get = await getProductRatingsRedis(productId, page, limit);

  if (get) return get;

  const ratings = await Rating.find({
    product: productId,
  })
    .populate({
      path: "user",
      select: "_id name photo",
    })
    .skip(skip)
    .limit(limit)
    .lean();

  await storeRatingInRedis(productId, ratings);

  return ratings;
};

export default getProductRatingsDB;
