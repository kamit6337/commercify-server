import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import getAddressByID from "../../database/Address/getAddressByID.js";
import createNewBuyDB from "../../database/Buy/createNewBuyDB.js";
import {
  deleteUserOrderByOrderId,
  getUserOrderCheckoutFromRedis,
} from "../../redis/order/userCheckout.js";
import createNewAddressDB from "../../database/Address/createNewAddressDB.js";
import { redisPub } from "../../redis/redisClient.js";
import addNewOrder from "../../queues/orderQueue.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);
const webhookSecretKey = environment.STRIPE_WEBHOOK_SECRET_KEY;

const webhookCheckout = catchAsyncError(async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  try {
    event = Stripe.webhooks.constructEvent(request.body, sig, webhookSecretKey);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const { metadata } = session;

    const CHECKOUT_ORDER_ID = metadata.checkout_order_id;

    console.log("payment expired", CHECKOUT_ORDER_ID);

    await deleteUserOrderByOrderId(CHECKOUT_ORDER_ID);

    response.send("Error occur, payment failed");
    return;
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { metadata, id: stripeId } = session;

    const CHECKOUT_ORDER_ID = metadata.checkout_order_id;

    await addNewOrder(CHECKOUT_ORDER_ID, stripeId);

    // const data = await getUserOrderCheckoutFromRedis(CHECKOUT_ORDER_ID);

    // if (!data) {
    //   response.status(403).json("Error occur in storing data");
    // }

    // const { products, address: addressId, orderId } = data;

    // const findAddress = await getAddressByID(addressId);

    // console.log("findAddress", findAddress);

    // const newAddressObj = {
    //   ...findAddress,
    // };

    // delete newAddressObj._id;
    // delete newAddressObj.user;
    // delete newAddressObj.createdAt;
    // delete newAddressObj.updatedAt;

    // const addNewAddress = await createNewAddressDB(newAddressObj);

    // console.log("addNewAddress", addNewAddress);

    // const buyObjs = products.map((product) => {
    //   return {
    //     ...product,
    //     orderId,
    //     stripeId,
    //     user: client_reference_id,
    //     address: addNewAddress._id,
    //   };
    // });

    // const result = await createNewBuyDB(buyObjs, addNewAddress);

    await redisPub.publish("new-order", CHECKOUT_ORDER_ID);

    // console.log("result", result);

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }

  response.send("Error Occur", event.type);
});

export default webhookCheckout;
