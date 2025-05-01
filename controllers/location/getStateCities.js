import axios from "axios";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import getLocationKey from "./getLocationKey.js";
import {
  getStateCitiesFromRedis,
  setStateCitiesIntoRedis,
} from "../../redis/Location/stateCities.js";
import getStatesAndCities from "../../lib/getStatesAndCities.js";

const URL = "https://www.universal-tutorial.com/api/cities/";

const getStateCities = catchAsyncError(async (req, res, next) => {
  const { countrycode, state, code } = req.query;

  if (!countrycode || !state || !code) {
    return next(new HandleGlobalError("State is not provided"));
  }

  // const modifyState = state.toUpperCase();

  // const get = await getStateCitiesFromRedis(state);

  // if (get) {
  //   return res.json(get);
  // }

  // const addstateToUrl = URL + modifyState;

  const options = {
    method: "GET",
    url: "https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode-and-statecode",
    params: {
      countrycode: countrycode.toLowerCase(),
      statecode: code.toLowerCase(),
    },
    headers: {
      "x-rapidapi-key": "b29e914ddemsh25268baed446881p1e513djsnb6dec9ccf4fe",
      "x-rapidapi-host": "country-state-city-search-rest-api.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);

  const cities = response.data;

  // const key = await getLocationKey();
  // const response = await axios.get(addstateToUrl, {
  //   headers: {
  //     Authorization: `Bearer ${key}`,
  //   },
  // });

  // const cities = response?.data;

  // if (!cities?.length) {
  //   return next(new HandleGlobalError("Issue in getting cities"));
  // }

  // const modifyCities = cities.map((city) => city.city_name);

  // await setStateCitiesIntoRedis(state, cities);

  return res.json(cities);
});

export default getStateCities;
