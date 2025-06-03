import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import { deleteUserOrderByOrderId } from "../../redis/order/userCheckout.js";
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

    response.status(404).send("Error occur, payment failed");
    return;
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { metadata, id: stripeId } = session;

    const CHECKOUT_ORDER_ID = metadata.checkout_order_id;

    await addNewOrder(CHECKOUT_ORDER_ID, stripeId);

    response.status(200).send();
    return;
  }

  response.status(404).send("Error Occur");
});

export default webhookCheckout;
