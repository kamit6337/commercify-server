import Buy from "../../models/BuyModel.js";

const userBuysDB = async (userId, page) => {
  const limit = 5;
  const skip = (page - 1) * limit;

  const userBuys = await Buy.find({
    user: userId,
  })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .populate("product")
    .populate("address")
    .populate("country")
    .lean();

  return userBuys;
};

export default userBuysDB;
