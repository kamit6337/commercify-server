import getCategoryByIdDB from "../../../database/Category/getCategoryByIdDB.js";
import updateProductDB from "../../../database/Products/updateProductDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";

const updateSingleProduct = catchAsyncError(async (req, res, next) => {
  const { _id, title, description, deliveredBy, category, thumbnail } =
    req.body;

  if (!_id || !title || !description || !deliveredBy || !category) {
    return next(new HandleGlobalError("all Field is not provided", 404));
  }

  const obj = {
    _id,
    title,
    description,
    deliveredBy: parseFloat(deliveredBy),
    category: category,
  };

  if (thumbnail) {
    obj.thumbnail = thumbnail;
  }

  const product = await updateProductDB(_id, obj);

  const categories = await getCategoryByIdDB([product.category]);

  const updateProduct = {
    ...product,
    category: categories[0],
  };

  res.json(updateProduct);
});

export default updateSingleProduct;
