import addNewCategoryDB from "../../../database/Category/addNewCategoryDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";

const addNewCategory = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return next(new HandleGlobalError("title is not provided", 404));
  }

  const response = await addNewCategoryDB(title);

  res.json(response);
});

export default addNewCategory;
