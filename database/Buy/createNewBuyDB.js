import Buy from "../../models/BuyModel.js";
import getSingleProductDB from "../Products/getSingleProductDB.js";

const createNewBuyDB = async (objs, newAddress) => {
  if (!objs || objs.length == 0) {
    throw new Error("Objs is not provided");
  }

  const newBuy = await Buy.insertMany(objs);

  // Convert to plain JS objects
  const newBuyPlain = newBuy.map((doc) => doc.toObject());

  const updateNewBuy = await Promise.all(
    newBuyPlain.map(async (buy) => {
      const productId = buy.product;

      const product = await getSingleProductDB(productId);

      return { ...buy, product, address: newAddress };
    })
  );

  return updateNewBuy;
};

export default createNewBuyDB;
