import dotenv from "dotenv";
dotenv.config();

export const environment = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,

  MONGO_DB_URI: process.env.MONGO_DB_URI,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  EXPIRES_IN: Number(process.env.EXPIRES_IN) || 86400000 * 30, // 30 days

  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTION_IV: process.env.ENCRYPTION_IV,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  MY_GMAIL_ID: process.env.MY_GMAIL_ID,
  MY_GMAIL_PASSWORD: process.env.MY_GMAIL_PASSWORD,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET_KEY: process.env.STRIPE_WEBHOOK_SECRET_KEY,

  AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY_SECRET: process.env.AWS_S3_ACCESS_KEY_SECRET,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,

  REDIS_URL: process.env.REDIS_URL,

  CURRENCY_EXCHANGE_KEY: process.env.CURRENCY_EXCHANGE_KEY,
  COUNTRY_KEY_EMAIL: process.env.COUNTRY_KEY_EMAIL,
  COUNTRY_KEY: process.env.COUNTRY_KEY,
  GEOLOCATION_APIKEY: process.env.GEOLOCATION_APIKEY,
};
