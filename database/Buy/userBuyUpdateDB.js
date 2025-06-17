import Buy from "../../models/BuyModel.js";

const userBuyUpdateDB = async (buyId, obj) => {
  const buy = await Buy.findOneAndUpdate(
    {
      _id: buyId,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  )
    .populate("product")
    .populate("rating")
    .populate("country")
    .populate("address")
    .lean();

  return buy;
};

export default userBuyUpdateDB;
