import Country from "../../models/CountryModel.js";
import {
  getCountriesFromRedis,
  setCountriesIntoRedis,
} from "../../redis/Additional/countries.js";

const getAllCountriesDB = async () => {
  const get = await getCountriesFromRedis();
  if (get) {
    return get;
  }

  const result = await Country.find().lean();

  await setCountriesIntoRedis(result);

  return result;
};

export default getAllCountriesDB;
