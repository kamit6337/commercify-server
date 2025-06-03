import { v2 as cloudinary } from "cloudinary";
import { environment } from "../../utils/environment.js";

const CLOUD_NAME = environment.CLOUDINARY_CLOUD_NAME;
const API_SECRET = environment.CLOUDINARY_API_SECRET;

const imageUploadByUrl = (folderExtension) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  let folder = environment.PROJECT_NAME;

  if (folderExtension) {
    folder = `${environment.PROJECT_NAME}/${folderExtension}`;
  }

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

  return {
    timestamp,
    signature,
    apiKey: environment.CLOUDINARY_API_KEY,
    folder,
    eager,
    url,
  };
};

export default imageUploadByUrl;
