import Buy from "../../models/BuyModel.js";

const createNewBuyDB = async (objs) => {
  if (!objs || objs.length == 0) {
    throw new Error("Objs is not provided");
  }

  const newBuy = await Buy.insertMany(objs);

  return newBuy;
};

export default createNewBuyDB;
