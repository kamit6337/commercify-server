import express from "express";
import getCurrencyExchange from "../controllers/additional/getCurrencyExchange.js";
import getCountryStates from "../controllers/location/getCountryStates.js";
import getStateCities from "../controllers/location/getStateCities.js";
import getCountryFromLanLon from "../controllers/additional/getCountryFromLanLon.js";

const router = express.Router();

router.get("/countries", getCountryFromLanLon);

router.get("/states", getCountryStates);
router.get("/cities", getStateCities);

router.get("/currency", getCurrencyExchange);

export default router;
