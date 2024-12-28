import Buy from "../../models/BuyModel.js";
import { updateUserBuysRedis } from "../../redis/Buy/userBuys.js";

const userBuyUpdateDB = async (userId, buyId, obj) => {
  const updateBuy = await Buy.findOneAndUpdate(
    {
      _id: buyId,
    },
    {
      ...obj,
    },
    {
      new: true,
    }
  );

  await updateUserBuysRedis(updateBuy);

  return updateBuy;
};

export default userBuyUpdateDB;
