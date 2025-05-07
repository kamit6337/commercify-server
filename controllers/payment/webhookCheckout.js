import stripe from "stripe";
import { environment } from "../../utils/environment.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import getAddressByID from "../../database/Address/getAddressByID.js";
import createNewBuyDB from "../../database/Buy/createNewBuyDB.js";
import createBuyAddressDB from "../../database/Address/createBuyAddressDB.js";
import { getUserOrderCheckoutFromRedis } from "../../redis/order/userCheckout.js";

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

  console.log("CHECKOUT_ORDER_ID", CHECKOUT_ORDER_ID);

  const data = await getUserOrderCheckoutFromRedis(CHECKOUT_ORDER_ID);

  console.log("data", data);

  if (!data) {
    response.status(403).json("Error occur in storing data");
  }

  const { products, address: addressId, orderId } = data;

  const findAddress = await getAddressByID(addressId);

  console.log("findAddress", findAddress);

  const { name, mobile, address, district, state, country, dial_code } =
    findAddress;

  const addressObj = {
    name,
    mobile: Number(mobile),
    address,
    district,
    country,
    dial_code,
    state,
  };

  const addNewAddress = await createBuyAddressDB(addressObj);

  await Promise.all(
    products.map(async (product) => {
      const obj = {
        ...product,
        orderId,
        stripeId,
        user: client_reference_id,
        address: addNewAddress._id,
      };

      return createNewBuyDB(obj);
    })
  );

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

export default webhookCheckout;
