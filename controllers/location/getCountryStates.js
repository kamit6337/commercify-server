import axios from "axios";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import {
  getCountryStatesFromRedis,
  setCountryStatesIntoRedis,
} from "../../redis/Location/countryStates.js";
import getLocationKey from "./getLocationKey.js";
import getStatesAndCities from "../../lib/getStatesAndCities.js";

const URL = "https://www.universal-tutorial.com/api/states/";

const getCountryStates = catchAsyncError(async (req, res, next) => {
  const { country, code } = req.query;

  if (!country || !code) {
    return next(new HandleGlobalError("Country is not provided"));
  }

  // const get = await getCountryStatesFromRedis(country);

  // if (get) {
  //   return res.json(get);
  // }

  const options = {
    method: "GET",
    url: "https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode",
    params: {
      countrycode: code.toLowerCase(),
    },
    headers: {
      "x-rapidapi-key": "b29e914ddemsh25268baed446881p1e513djsnb6dec9ccf4fe",
      "x-rapidapi-host": "country-state-city-search-rest-api.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);
  const states = response.data;

  // const addCountryToUrl = URL + modifyCountry;
  // const key = await getLocationKey();

  // const response = await axios.get(addCountryToUrl, {
  //   headers: {
  //     Authorization: `Bearer ${key}`,
  //   },
  // });

  // const states = response?.data;

  // if (!states?.length) {
  //   return next(new HandleGlobalError("Issue in getting states"));
  // }

  // const modifyStates = states.map((state) => state.state_name);

  // await setCountryStatesIntoRedis(country, states);

  return res.json(states);
});

export default getCountryStates;
