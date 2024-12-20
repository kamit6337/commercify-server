import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "./awsS3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { environment } from "../../utils/environment.js";

const preSignedAWS = async (fileType, keyFolder) => {
  if (!fileType || !keyFolder) {
    throw new Error("FileType and KeyFolder must be provided");
  }

  const file = fileType.split("/");

  const fileKey = `${keyFolder}/${file[0]}-${Date.now()}.${file[1]}`;

  const command = new PutObjectCommand({
    Bucket: environment.AWS_S3_BUCKET,
    Key: fileKey,
    ContentType: fileType,
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });

  const fileUrl = `https://${environment.AWS_S3_BUCKET}.s3.amazonaws.com/${fileKey}`;

  return { uploadUrl, fileUrl, fileKey, fileType };
};

export default preSignedAWS;

// const response = await postReq(`/file${path}`, {
//   fileType: selectedFile.type,
// });

// console.log("response from server", response);

// const { uploadUrl, fileUrl, fileKey, fileType } = response;

// // Upload file to S3 using pre-signed URL
// await axios.put(uploadUrl, selectedFile, {
//   headers: {
//     "Content-Type": fileType,
//   },
// });

// return fileUrl;
