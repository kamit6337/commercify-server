import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import getAddressByID from "../../database/Address/getAddressByID.js";
import createNewBuyDB from "../../database/Buy/createNewBuyDB.js";
import { getUserOrderCheckoutFromRedis } from "../../redis/order/userCheckout.js";
import createNewAddressDB from "../../database/Address/createNewAddressDB.js";

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

  // Handle the event
  if (event.type !== "checkout.session.completed") {
    response.send("Error occur");
    return;
  }

  const session = event.data.object;
  const { client_reference_id, metadata, id: stripeId } = session;

  const CHECKOUT_ORDER_ID = metadata.willBuyProducts;

  const data = await getUserOrderCheckoutFromRedis(CHECKOUT_ORDER_ID);

  if (!data) {
    response.status(403).json("Error occur in storing data");
  }

  const { products, address: addressId, orderId } = data;

  const findAddress = await getAddressByID(addressId);

  const newAddressObj = {
    ...findAddress,
  };

  delete newAddressObj._id;
  delete newAddressObj.user;
  delete newAddressObj.createdAt;
  delete newAddressObj.updatedAt;

  const addNewAddress = await createNewAddressDB(newAddressObj);

  const buyObjs = products.map((product) => {
    return {
      ...product,
      orderId,
      stripeId,
      user: client_reference_id,
      address: addNewAddress._id,
    };
  });

  await createNewBuyDB(buyObjs);

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export default webhookCheckout;
