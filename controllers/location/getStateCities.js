import axios from "axios";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import {
  getStateCitiesFromRedis,
  setStateCitiesIntoRedis,
} from "../../redis/Location/stateCities.js";

const getStateCities = catchAsyncError(async (req, res, next) => {
  const { countrycode, state, code } = req.query;

  if (!countrycode || !state || !code) {
    return next(new HandleGlobalError("State is not provided"));
  }

  const get = await getStateCitiesFromRedis(state, code);

  if (get) {
    res.json(get);
    return;
  }

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

  await setStateCitiesIntoRedis(state, code, cities);

  res.json(cities);
});

export default getStateCities;
