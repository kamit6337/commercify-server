import addNewProductDB from "../../../database/Products/addNewProductDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";

const addSingleProduct = catchAsyncError(async (req, res, next) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    deliveredBy,
    category,
    thumbnail,
    images,
  } = req.body;

  if (
    !title ||
    !description ||
    !price ||
    !discountPercentage ||
    !deliveredBy ||
    !category ||
    !category?._id ||
    !thumbnail
  ) {
    return next(new HandleGlobalError("all Field is not provided", 404));
  }

  const obj = {
    title,
    description,
    price: parseFloat(price),
    discountPercentage: parseFloat(discountPercentage),
    deliveredBy: parseFloat(deliveredBy),
    category: category?._id,
    thumbnail,
    images,
  };

  const product = await addNewProductDB(obj);

  res.json(product);
});

export default addSingleProduct;
