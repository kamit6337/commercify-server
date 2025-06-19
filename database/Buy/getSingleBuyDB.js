import Buy from "../../models/BuyModel.js";

const getSingleBuyDB = async (buyId) => {
  if (!buyId) {
    throw new Error("BuyId is not provided");
  }

  const buy = await Buy.findOne({
    _id: buyId,
  })
    .populate("product")
    .populate("address")
    .populate("country")
    .lean();

  return buy;
};

export default getSingleBuyDB;
