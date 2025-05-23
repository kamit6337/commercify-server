import userBuyUpdateDB from "../../database/Buy/userBuyUpdateDB.js";
import getAdminUsers from "../../database/User/getAdminUsers.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import { io } from "../../lib/socketConnect.js";

const cancelOrder = catchAsyncError(async (req, res, next) => {
  const { id: buyId, reason } = req.body;

  if (!buyId || !reason) {
    return next(new HandleGlobalError("Id or reason is not provided", 404));
  }

  const obj = {
    isCancelled: true,
    reasonForCancelled: reason,
  };

  const result = await userBuyUpdateDB(buyId, obj);

  const adminUsers = await getAdminUsers();

  console.log("adminUsers", adminUsers);

  adminUsers.forEach((admin) => {
    if (!admin) return;
    io.to(admin).emit("order-cancel", result);
  });

  res.json(result);
});

export default cancelOrder;
