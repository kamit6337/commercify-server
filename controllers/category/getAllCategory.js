import geAllCategoryDB from "../../database/Category/geAllCategoryDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getAllCategory = catchAsyncError(async (req, res, next) => {
  const allCategory = await geAllCategoryDB();

  res.json(allCategory);
});

export default getAllCategory;
