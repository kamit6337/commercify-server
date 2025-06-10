import getProductPriceByProductIdDB from "../../database/ProductPrice/getProductPriceByProductIdDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const getProductPrice = catchAsyncError(async (req, res, next) => {
  const { productId, countryId } = req.query;

  if (!productId || !countryId) {
    return next(
      new HandleGlobalError("ProductId or CountryId is not provided", 404)
    );
  }

  const productsPrice = await getProductPriceByProductIdDB(
    [productId],
    countryId
  );

  res.json(productsPrice[0]);
});

export default getProductPrice;
