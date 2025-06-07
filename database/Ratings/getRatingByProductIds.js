import ObjectID from "../../lib/ObjectID.js";
import Rating from "../../models/RatingModel.js";

const getRatingByProductIds = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw new Error("ProductIds is not provided");

  const Ids = ids.map((id) => ObjectID(id));

  const ratings = await Rating.aggregate([
    {
      $match: {
        product: { $in: Ids },
      },
    },
    {
      $group: {
        _id: "$product",
        totalRatings: { $sum: 1 },
        avgRating: { $avg: "$rate" },
        totalComments: {
          $sum: {
            $cond: [{ $ne: ["$comment", null] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        product: "$_id",
        totalRatings: 1,
        totalComments: 1,
        avgRating: { $round: ["$avgRating", 1] },
      },
    },
  ]);

  return JSON.parse(JSON.stringify(ratings));
};

export default getRatingByProductIds;
