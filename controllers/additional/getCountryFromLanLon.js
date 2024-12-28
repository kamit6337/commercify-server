import axios from "axios";
import catchAsyncError from "../../lib/catchAsyncError.js";
import { environment } from "../../utils/environment.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import {
  getCountryFromLanLonFromRedis,
  setCountryFromlanLonIntoRedis,
} from "../../redis/Additional/geolocation.js";

const getCountryFromLanLon = catchAsyncError(async (req, res, next) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return next(new HandleGlobalError("Lan or Lon is not provided"));
  }

  const get = await getCountryFromLanLonFromRedis(lat, lon, 200);

  if (get) {
    return res.json(get);
  }

  const BASE_URL = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${environment.GEOLOCATION_APIKEY}`;

  const response = await axios.get(BASE_URL);

  const query = response?.data;
  if (!query) {
    return next(new HandleGlobalError("Issue in getting Geolocation"));
  }

  const countryInfo = query.features[0].properties;

  await setCountryFromlanLonIntoRedis(lat, lon, countryInfo);

  return res.json(countryInfo);
});

export default getCountryFromLanLon;
