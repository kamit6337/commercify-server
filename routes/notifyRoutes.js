import express from "express";
import createNewNotify from "../controllers/notify/createNewNotify.js";

const router = express.Router();

router.route("/").post(createNewNotify);

export default router;
