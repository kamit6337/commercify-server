import catchAsyncError from "../../lib/catchAsyncError.js";
import { environment } from "../../utils/environment.js";
import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = environment.CLOUDINARY_CLOUD_NAME;
const API_SECRET = environment.CLOUDINARY_API_SECRET;

const getImageUrlToUpload = catchAsyncError(async (req, res, next) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const folder = "Commercify";
  const eager = "c_pad,h_300,w_400,q_auto";

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      eager: eager,
      folder: folder,
    },
    API_SECRET
  );

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  res.json({
    timestamp,
    signature,
    apiKey: environment.CLOUDINARY_API_KEY,
    folder,
    eager,
    url,
  });
});

export default getImageUrlToUpload;
