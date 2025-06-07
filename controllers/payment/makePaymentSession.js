import stripe from "stripe";
import catchAsyncError from "../../lib/catchAsyncError.js";
import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import dateInMilli from "../../utils/javaScript/dateInMilli.js";
import generateSecureString from "../../utils/javaScript/generateSecureString.js";
import getAddressByID from "../../database/Address/getAddressByID.js";
import getProductsFromIdsDB from "../../database/Products/getProductsFromIdsDB.js";
import getExchange from "../additional/getExchange.js";
import { setUserOrderCheckoutIntoRedis } from "../../redis/order/userCheckout.js";
import getCountryByIdDB from "../../database/Additional/getCountryByIdDB.js";
import getZeroStocksByProductIdsDB from "../../database/Stock/getZeroStocksByProductIdsDB.js";
import { productPriceFromRedis } from "../../redis/Products/ProductPrice.js";

const Stripe = stripe(environment.STRIPE_SECRET_KEY);

const makePaymentSession = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const userId = req.userId;
  const CHECKOUT_ORDER_ID = generateSecureString();

  const { products, address: addressId, currency_code, countryId } = req.body;

  if (!products || !addressId || !currency_code || !countryId) {
    return next(new HandleGlobalError("Not provide all fields", 404));
  }

  const productIds = products.map((obj) => obj.id);

  const zeroStocks = await getZeroStocksByProductIdsDB(productIds);

  if (zeroStocks.length !== 0) {
    const productTitle = zeroStocks
      .map((stock) => stock.product.title)
      .join(", ");

    return next(
      new HandleGlobalError(`Product Unavailable. \n ${productTitle}`, 404)
    );
  }

  const findProducts = await getProductsFromIdsDB(productIds);

  const productsNotReadyToSale = findProducts.filter(
    (product) => !product.isReadyToSale
  );

  if (productsNotReadyToSale.length > 0) {
    const productsTitle = productsNotReadyToSale
      .map((product) => product.title)
      .join(", ");

    return next(
      new HandleGlobalError(`Product Unavailable. \n ${productsTitle}`, 404)
    );
  }

  const allExchange = await getExchange();

  const findCountry = await getCountryByIdDB(countryId);

  const exchangeRate = allExchange[currency_code];

  const findAddress = await getAddressByID(addressId);

  const willBuyProducts = [];

  const lineItems = await Promise.all(
    findProducts.map(async (product) => {
      const {
        _id,
        title,
        description,
        price,
        thumbnail,
        deliveredBy,
        discountPercentage,
      } = product;

      const findQuantity = products.find((obj) => obj.id === String(_id));

      const productPrice = await productPriceFromRedis(
        _id,
        price,
        currency_code,
        discountPercentage
      );

      const { discountedPrice, priceInUSD } = productPrice;

      const obj = {
        product: product,
        user: userId,
        isReviewed: false,
        orderId: CHECKOUT_ORDER_ID,
        price: priceInUSD,
        buyPrice: discountedPrice,
        exchangeRate: exchangeRate,
        country: findCountry,
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
          currency: currency_code,
          unit_amount: discountedPrice * 100,
          product_data: {
            name: title,
            description: description,
            images: [thumbnail],
          },
        },
        quantity: findQuantity.quantity,
      };
    })
  );

  const totalDeliveryCharge = findProducts.reduce((acc, product) => {
    return (acc += product.deliveryCharge);
  }, 0);

  const delieveryObj = {
    price_data: {
      currency: currency_code,
      unit_amount: Math.round(totalDeliveryCharge * exchangeRate) * 100,
      product_data: {
        name: "Delivery Charges",
        description: `Delivery charge for the above ${lineItems.length} products`,
      },
    },
    quantity: 1,
  };

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
    line_items: [...lineItems, delieveryObj],
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
