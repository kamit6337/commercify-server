import stripe from "stripe";
import catchAsyncError from "../../lib/catchAsyncError.js";
import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import changePriceDiscountByExchangeRate from "../../utils/javaScript/changePriceDiscountByExchangeRate.js";
import dateInMilli from "../../utils/javaScript/dateInMilli.js";
import generateSecureString from "../../utils/javaScript/generateSecureString.js";
import getAddressByID from "../../database/Address/getAddressByID.js";
import getProductsFromIdsDB from "../../database/Products/getProductsFromIdsDB.js";
import getExchange from "../additional/getExchange.js";
import { setUserOrderCheckoutIntoRedis } from "../../redis/order/userCheckout.js";
import addWakeupNotfiy from "../../queues/wakeupQueue.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);

const makePaymentSession = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const userId = req.userId;
  const CHECKOUT_ORDER_ID = generateSecureString();

  const { products, address: addressId, code, symbol } = req.body;

  if (!products || !addressId || !code || !symbol) {
    return next(new HandleGlobalError("Not provide all fields", 404));
  }

  await addWakeupNotfiy();

  const allExchange = await getExchange();
  const exchangeRate = Math.trunc(allExchange[code]);

  const findAddress = await getAddressByID(addressId);

  const productIds = products.map((obj) => obj.id);
  const findProducts = await getProductsFromIdsDB(productIds);

  const willBuyProducts = [];

  let lineItems = findProducts.map((product) => {
    const {
      _id,
      title,
      description,
      price,
      discountPercentage,
      thumbnail,
      deliveredBy,
    } = product;

    const findQuantity = products.find((obj) => obj.id === String(_id));

    const { discountedPrice, exchangeRatePrice, roundDiscountPercent } =
      changePriceDiscountByExchangeRate(
        price,
        discountPercentage,
        exchangeRate
      );

    const discountedPriceWithoutExchangeRate =
      (price * (100 - Math.trunc(discountPercentage))) / 100;

    // Use findOneAndUpdate to create the Buy and populate the product and address fields in one go
    const obj = {
      product: product,
      user: userId,
      orderId: CHECKOUT_ORDER_ID,
      price: Number(discountedPriceWithoutExchangeRate),
      exchangeRate: exchangeRate,
      quantity: Number(findQuantity.quantity),
      address: findAddress,
      isDelivered: false,
      deliveredDate: dateInMilli(Number(deliveredBy)),
      isCancelled: false,
      reasonForCancelled: "",
      isReturned: false,
      reasonForReturned: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    willBuyProducts.push(obj);

    return {
      price_data: {
        currency: code,
        unit_amount: discountedPrice * 100,
        product_data: {
          name: title,
          description: description,
          images: [thumbnail],
        },
      },
      quantity: findQuantity.quantity,
    };
  });

  const deliveryCharge = Math.round(lineItems.length * exchangeRate * 0.48); // 4 dollars
  const delieveryObj = {
    price_data: {
      currency: code,
      unit_amount: deliveryCharge * 100,
      product_data: {
        name: "Delivery Charges",
        description: `Delivery charge for the above ${lineItems.length} products`,
      },
    },
    quantity: 1,
  };

  lineItems = [...lineItems, delieveryObj];

  const { address, district, state } = findAddress;

  const customer = await Stripe.customers.create({
    name: user.name,
    email: user.email,
    phone: user.mobile,
    address: {
      line1: address,
      city: district,
      state: state,
      country: "US",
    },
  });

  await setUserOrderCheckoutIntoRedis(CHECKOUT_ORDER_ID, willBuyProducts);

  // Create a PaymentIntent with the order amount and currency
  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${environment.CLIENT_URL}/payment/success?orderId=${CHECKOUT_ORDER_ID}`,
    cancel_url: environment.CLIENT_URL + "/payment/cancel",
    customer: customer.id,
    client_reference_id: userId,
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    line_items: lineItems,
    metadata: {
      checkout_order_id: CHECKOUT_ORDER_ID,
    },
  });

  res.status(200).json({
    message: "Payment session Created",
    session,
  });
});

export default makePaymentSession;
