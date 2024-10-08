import Buy from "../../models/BuyModel.js";
import {
  getUserBuysCountRedis,
  setUserBuysCountRedis,
} from "../../redis/Buy/userBuysCount.js";

const userBuysDetailDB = async (userId) => {
  const get = await getUserBuysCountRedis(userId);

  if (get) return get;

  const countBuys = await Buy.countDocuments({ user: userId });

  await setUserBuysCountRedis(userId, countBuys);

  return countBuys;
};

export default userBuysDetailDB;
