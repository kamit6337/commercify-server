import updateProductDB from "../../../database/Products/updateProductDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";

const updateSingleProduct = catchAsyncError(async (req, res, next) => {
  const {
    _id,
    title,
    description,
    price,
    discountPercentage,
    deliveredBy,
    category,
  } = req.body;

  if (
    !_id ||
    !title ||
    !description ||
    !price ||
    !discountPercentage ||
    !deliveredBy ||
    !category ||
    !category?._id
  ) {
    return next(new HandleGlobalError("all Field is not provided", 404));
  }

  const obj = {
    _id,
    title,
    description,
    price: parseFloat(price),
    discountPercentage: parseFloat(discountPercentage),
    deliveredBy: parseFloat(deliveredBy),
    category: category?._id,
  };

  const response = await updateProductDB(_id, obj);

  res.json(response);
});

export default updateSingleProduct;
