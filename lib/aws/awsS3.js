import { S3Client } from "@aws-sdk/client-s3";
import { environment } from "../../utils/environment.js";

const s3Client = new S3Client({
  region: environment.AWS_S3_REGION,
  credentials: {
    accessKeyId: environment.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: environment.AWS_S3_ACCESS_KEY_SECRET,
  },
});

export default s3Client;
