import Buy from "../../models/BuyModel.js";
import { updateUserBuysRedis } from "../../redis/Buy/userBuys.js";
import getAddressByID from "../Address/getAddressByID.js";
import getSingleProductDB from "../Products/getSingleProductDB.js";

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
  );

  const address = await getAddressByID(buy.address?.toString());

  const product = await getSingleProductDB(buy.product?.toString());

  const parseBuy = JSON.parse(JSON.stringify(buy));

  const buyObj = {
    ...parseBuy,
    product,
    address,
  };

  await updateUserBuysRedis(buyObj);

  return buyObj;
};

export default userBuyUpdateDB;
