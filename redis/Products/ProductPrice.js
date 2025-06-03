import getExchange from "../../controllers/additional/getExchange.js";
import changePriceDiscountByExchangeRate from "../../utils/javaScript/changePriceDiscountByExchangeRate.js";
import redisClient from "../redisClient.js";

export const productPriceFromRedis = async (
  productId,
  priceInUSD,
  discountPercentage = 0
) => {
  if (!productId || !priceInUSD) return;

  const get = await redisClient.get(`Product-Price:${productId}`);

  if (get) {
    return JSON.parse(get);
  }

  const exchangeCurr = await getExchange();
  console.log("exchangeCurr", exchangeCurr);

  const obj = {};

  Object.keys(exchangeCurr).forEach((key) => {
    const exchangeRate = exchangeCurr[key];

    const value = changePriceDiscountByExchangeRate(
      priceInUSD,
      discountPercentage,
      exchangeRate
    );

    obj[key] = value;
  });

  await redisClient.set(
    `Product-Price:${productId}`,
    JSON.stringify(obj),
    "EX",
    60 * 60
  );

  console.log("obj", obj);

  return obj;
};
