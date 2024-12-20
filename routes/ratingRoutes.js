import express from "express";
import productRatings from "../controllers/rating/productRatings.js";
import giveRating from "../controllers/rating/giveRating.js";
import updateRating from "../controllers/rating/updateRating.js";
import deleteRating from "../controllers/rating/deleteRating.js";

const router = express.Router();

// prettier-ignore
router
.route("/")
.get(productRatings)
.post(giveRating)
.patch(updateRating)
.delete(deleteRating)

export default router;
