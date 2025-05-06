import updateCategoryDB from "../../../database/Category/updateCategoryDB.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";

const updateSingleCategory = catchAsyncError(async (req, res, next) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return next(new HandleGlobalError("Id or Title is not provided", 404));
  }

  const obj = {
    title,
  };

  const response = await updateCategoryDB(id, obj);

  res.json(response);
});

export default updateSingleCategory;
