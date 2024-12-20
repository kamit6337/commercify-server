const createNewBuyDB = async (obj) => {
  const newBuy = await Buy.create({
    ...obj,
  });

  return newBuy;
};

export default createNewBuyDB;
