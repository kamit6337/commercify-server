import getCategoryByIdDB from "../../../database/Category/getCategoryByIdDB.js";
import addNewProductPriceDB from "../../../database/ProductPrice/addNewProductPriceDB.js";
import getProductPriceByProductIdDB from "../../../database/ProductPrice/getProductPriceByProductIdDB.js";
import addNewProductDB from "../../../database/Products/addNewProductDB.js";
import createNewStock from "../../../database/Stock/createNewStockDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";

const addSingleProduct = catchAsyncError(async (req, res, next) => {
  const {
    title,
    description,
    category,
    deliveredBy,
    thumbnail,
    stock,
    productPrice,
    baseCountryId,
  } = req.body;

  if (
    !title ||
    !description ||
    !category ||
    !deliveredBy ||
    !thumbnail ||
    !stock ||
    !productPrice ||
    productPrice.length === 0 ||
    !baseCountryId
  ) {
    return next(new HandleGlobalError("all Field is not provided", 404));
  }

  const obj = {
    title,
    description,
    deliveredBy: parseFloat(deliveredBy),
    category: category,
    thumbnail,
  };

  const newProduct = await addNewProductDB(obj);

  const newStock = await createNewStock(newProduct._id, stock);

  const updateProductPrice = productPrice.map((obj) => ({
    product: newProduct._id,
    country: obj.country,
    currency_code: obj.currency_code,
    price: parseFloat(obj.price),
    discountPercentage: parseFloat(obj.discountPercentage),
    discountedPrice: parseFloat(obj.discountedPrice),
    deliveryCharge: parseFloat(obj.deliveryCharge),
  }));

  const newProductPrice = await addNewProductPriceDB(updateProductPrice);

  const getCategory = await getCategoryByIdDB([category]);

  const getBaseCountryProductPrice = await getProductPriceByProductIdDB(
    [newProduct._id],
    baseCountryId
  );

  const sendProductObj = {
    ...newProduct,
    category: getCategory[0],
    stock,
    price: getBaseCountryProductPrice[0],
  };

  res.json(sendProductObj);
});

export default addSingleProduct;
