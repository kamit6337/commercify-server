const changePriceDiscountByExchangeRate = (
  price,
  discountPercentage = 0,
  exchangeRate = 1,
  currency_code
) => {
  const exchangeRatePrice = Math.trunc(price * exchangeRate);
  const roundDiscountPercent = discountPercentage;

  const discountedPrice = Math.trunc(
    (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
  );

  const discountPercentCost = exchangeRatePrice - discountedPrice;

  return {
    priceInUSD: price,
    currency_code,
    exchangeRate,
    exchangeRatePrice,
    discountPercent: roundDiscountPercent,
    discountedPrice,
    discountPercentCost,
  };
};

export default changePriceDiscountByExchangeRate;
