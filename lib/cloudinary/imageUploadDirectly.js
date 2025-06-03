import { v2 as cloudinary } from "cloudinary";
import { environment } from "../../utils/environment.js";

cloudinary.config({
  cloud_name: environment.CLOUDINARY_CLOUD_NAME,
  api_key: environment.CLOUDINARY_API_KEY,
  api_secret: environment.CLOUDINARY_API_SECRET,
});

const imageUploadDirectly = async (imageUrl, folderExtension) => {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: folderExtension
      ? `${environment.PROJECT_NAME}/${folderExtension}`
      : environment.PROJECT_NAME, // optional
    eager: [
      { width: 400, height: 300, crop: "pad", quality: "auto" }, // optional
    ],
  });

  return result?.secure_url;
};

export default imageUploadDirectly;
