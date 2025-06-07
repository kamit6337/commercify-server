import getExchange from "../../controllers/additional/getExchange.js";
import changePriceDiscountByExchangeRate from "../../utils/javaScript/changePriceDiscountByExchangeRate.js";

export const productPriceFromRedis = async (
  productId,
  priceInUSD,
  currency_code,
  discountPercentage = 0
) => {
  if (!productId || !priceInUSD || !currency_code) return;

  const exchangeCurr = await getExchange();

  const exchangeRate = exchangeCurr[currency_code];

  if (!exchangeRate) {
    throw new Error("Wrong Currency Code provided");
  }

  const product_price = changePriceDiscountByExchangeRate(
    priceInUSD,
    discountPercentage,
    exchangeRate,
    currency_code
  );

  return product_price;
};
