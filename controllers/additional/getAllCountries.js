import getAllCountriesDB from "../../database/Additional/getAllCountriesDB.js";
import catchAsyncError from "../../lib/catchAsyncError.js";

const getAllCountries = catchAsyncError(async (req, res, next) => {
  const result = await getAllCountriesDB();

  res.json(result);
});

export default getAllCountries;
