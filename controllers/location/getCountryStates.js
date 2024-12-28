import axios from "axios";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import {
  getCountryStatesFromRedis,
  setCountryStatesIntoRedis,
} from "../../redis/Location/countryStates.js";
import getLocationKey from "./getLocationKey.js";

const URL = "https://www.universal-tutorial.com/api/states/";

const getCountryStates = catchAsyncError(async (req, res, next) => {
  const { country } = req.query;

  if (!country) {
    return next(new HandleGlobalError("Country is not provided"));
  }

  const modifyCountry = country.toUpperCase();

  const get = await getCountryStatesFromRedis(modifyCountry);

  if (get) {
    return res.json(get);
  }

  const addCountryToUrl = URL + modifyCountry;
  const key = await getLocationKey();

  const response = await axios.get(addCountryToUrl, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });

  const states = response?.data;

  if (!states?.length) {
    return next(new HandleGlobalError("Issue in getting states"));
  }

  const modifyStates = states.map((state) => state.state_name);

  await setCountryStatesIntoRedis(modifyCountry, modifyStates);

  return res.json(modifyStates);
});

export default getCountryStates;
