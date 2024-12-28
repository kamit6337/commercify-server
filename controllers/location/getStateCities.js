import axios from "axios";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import getLocationKey from "./getLocationKey.js";
import {
  getStateCitiesFromRedis,
  setStateCitiesIntoRedis,
} from "../../redis/Location/stateCities.js";

const URL = "https://www.universal-tutorial.com/api/cities/";

const getStateCities = catchAsyncError(async (req, res, next) => {
  const { state } = req.query;

  if (!state) {
    return next(new HandleGlobalError("State is not provided"));
  }

  const modifyState = state.toUpperCase();

  const get = await getStateCitiesFromRedis(state);

  if (get) {
    return res.json(get);
  }

  const addstateToUrl = URL + modifyState;
  const key = await getLocationKey();
  const response = await axios.get(addstateToUrl, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  });

  const cities = response?.data;

  if (!cities?.length) {
    return next(new HandleGlobalError("Issue in getting cities"));
  }

  const modifyCities = cities.map((city) => city.city_name);

  await setStateCitiesIntoRedis(state, modifyCities);

  return res.json(modifyCities);
});

export default getStateCities;
