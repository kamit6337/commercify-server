import { setUserSingleBuyByOrderId } from "../../redis/Buy/userBuysSessionID.js";
import getAddressByID from "../Address/getAddressByID.js";
import getSingleProductDB from "../Products/getSingleProductDB.js";

const createNewBuyDB = async (obj) => {
  const { product: productId, address: addressId } = obj;

  const newBuy = await Buy.create({
    ...obj,
  });

  const address = await getAddressByID(addressId);
  const product = await getSingleProductDB(productId);

  const buyObj = {
    _id: newBuy._id,
    product,
    user: newBuy.user,
    orderId: newBuy.orderId,
    orderId: newBuy.orderId,
    stripeId: newBuy.stripeId,
    price: newBuy.price,
    exchangeRate: newBuy.exchangeRate,
    quantity: newBuy.quantity,
    address,
    isDelivered: newBuy.isDelivered,
    deliveredDate: newBuy.deliveredDate,
    isCancelled: newBuy.isCancelled,
    createdAt: newBuy.createdAt,
    updatedAt: newBuy.updatedAt,
  };

  await setUserSingleBuyByOrderId(buyObj);

  return newBuy;
};

export default createNewBuyDB;
