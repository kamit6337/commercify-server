import axios from "axios";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import {
  getCountryStatesFromRedis,
  setCountryStatesIntoRedis,
} from "../../redis/Location/countryStates.js";

const getCountryStates = catchAsyncError(async (req, res, next) => {
  const { country, code } = req.query;

  if (!country || !code) {
    return next(new HandleGlobalError("Country is not provided"));
  }

  const get = await getCountryStatesFromRedis(country, code);

  if (get) {
    res.json(states);
    return;
  }

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

  await setCountryStatesIntoRedis(country, code, states);

  res.json(states);
});

export default getCountryStates;
