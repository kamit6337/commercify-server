import Buy from "../../../models/BuyModel.js";

const getAllReturnedDB = async (page, limit) => {
  if (!page || !limit) {
    throw new Error("Either page or limit is not provided");
  }

  const skip = (page - 1) * limit;

  const buys = await Buy.find({
    isReturned: true,
  })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .populate("product")
    .populate("address");

  return buys;
};

export default getAllReturnedDB;
