import express from "express";
import getSearchProducts from "../controllers/search/getSearchProducts.js";

const router = express.Router();

router.get("/", getSearchProducts);

export default router;
