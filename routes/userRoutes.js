import express from "express";
import updateUserProfile from "../controllers/user/updateUserProfile.js";

const router = express.Router();

//prettier-ignore
router
.route("/")
.patch(updateUserProfile);

export default router;
