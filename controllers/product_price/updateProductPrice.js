import updateProductPriceDB from "../../database/ProductPrice/updateProductPriceDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";

const updateProductPrice = catchAsyncError(async (req, res, next) => {
  const { updates } = req.body;

  if (!updates || updates.length === 0) {
    return next(new HandleGlobalError("Updates is not provided", 404));
  }

  // Prepare bulk operations
  const bulkOperations = updates.map((update) => ({
    updateOne: {
      filter: { product: update.product, country: update.country },
      update: {
        price: update.price,
        discountPercentage: update.discountPercentage,
        discountedPrice: update.discountedPrice,
        deliveryCharge: update.deliveryCharge,
      },
    },
  }));

  const result = await updateProductPriceDB(bulkOperations);

  res.json("Product Price updated successfully");
});

export default updateProductPrice;
