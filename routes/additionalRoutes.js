import express from "express";
import getCountryStates from "../controllers/location/getCountryStates.js";
import getStateCities from "../controllers/location/getStateCities.js";
import getAllCountries from "../controllers/additional/getAllCountries.js";
import getCurrencyExchange from "../controllers/additional/getCurrencyExchange.js";

const router = express.Router();

router.get("/countries", getAllCountries);

router.get("/states", getCountryStates);
router.get("/cities", getStateCities);

router.get("/currency", getCurrencyExchange);

export default router;
