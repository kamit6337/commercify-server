import catchAsyncError from "../../lib/catchAsyncError.js";
import imageUploadByUrl from "../../lib/cloudinary/imageUploadByUrl.js";

const getImageUrlToUpload = catchAsyncError(async (req, res, next) => {
  const response = imageUploadByUrl();

  res.json(response);
});

export default getImageUrlToUpload;
