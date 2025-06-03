const changePriceDiscountByExchangeRate = (
  price,
  discountPercentage = 0,
  exchangeRate = 1
) => {
  const exchangeRatePrice = Math.trunc(price * exchangeRate);
  const roundDiscountPercent = Math.trunc(discountPercentage);
  const discountedPrice = Math.trunc(
    (exchangeRatePrice * (100 - roundDiscountPercent)) / 100
  );

  const discountPercentCost = Math.trunc(
    (exchangeRatePrice * roundDiscountPercent) / 100
  );

  return {
    price,
    exchangeRate,
    exchangeRatePrice,
    roundDiscountPercent,
    discountedPrice,
    discountPercentCost,
  };
};

export default changePriceDiscountByExchangeRate;
