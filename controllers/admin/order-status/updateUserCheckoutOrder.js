import getAddressByID from "../../../database/Address/getAddressByID.js";
import userBuyUpdateDB from "../../../database/Buy/userBuyUpdateDB.js";
import getSingleProductDB from "../../../database/Products/getSingleProductDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import { io } from "../../../lib/socketConnect.js";
import addOrderStatus from "../../../queues/orders/orderStatusQueue.js";

const updateUserCheckoutOrder = catchAsyncError(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 403));
  }
  const obj = {
    isDelivered: true,
    deliveredDate: Date.now(),
  };

  const updateBuy = await userBuyUpdateDB(id, obj);

  // const address = await getAddressByID(updateBuy.address?.toString());
  // const product = await getSingleProductDB(updateBuy.product?.toString());

  // const buyObj = {
  //   ...updateBuy,
  //   product,
  //   address,
  // };

  await addOrderStatus(updateBuy._id);

  io.to(updateBuy.user).emit("update-deliver", updateBuy);

  res.json(updateBuy);
});

export default updateUserCheckoutOrder;
