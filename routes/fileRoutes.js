import express from "express";
import getImageUrlToUpload from "../controllers/file/getImageUrlToUpload.js";

const router = express.Router();

router.get("/image", getImageUrlToUpload);

export default router;
