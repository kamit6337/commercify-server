import Buy from "../../models/BuyModel.js";

const userBuysCountDB = async (userId) => {
  const countBuys = await Buy.countDocuments({ user: userId });

  return countBuys;
};

export default userBuysCountDB;
