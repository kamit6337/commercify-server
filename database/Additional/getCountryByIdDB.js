import Country from "../../models/CountryModel.js";
import {
  getCountriesFromRedis,
  setCountriesIntoRedis,
} from "../../redis/Additional/countries.js";

const getCountryByIdDB = async (countryId) => {
  if (!countryId) throw new Error("CountryId is not provided");

  const countries = await getCountriesFromRedis();

  const findCountry = countries.find(
    (country) => country._id?.toString() === countryId?.toString()
  );

  if (findCountry) {
    return findCountry;
  }

  const countriesFromDB = await Country.find().lean();

  const findCountryFromDB = countriesFromDB.find(
    (country) => country._id?.toString() === countryId?.toString()
  );

  await setCountriesIntoRedis(countriesFromDB);

  return findCountryFromDB;
};

export default getCountryByIdDB;
