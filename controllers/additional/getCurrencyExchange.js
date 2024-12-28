import axios from "axios";
import catchAsyncError from "../../lib/catchAsyncError.js";
import HandleGlobalError from "../../lib/HandleGlobalError.js";
import {
  getCurrencyExchangeFromRedis,
  setCurrencyExchangeIntoRedis,
} from "../../redis/Additional/currency.js";
import { environment } from "../../utils/environment.js";

const CURRENCY_EXCHANGE_URL = "https://api.freecurrencyapi.com/v1/latest";

const getCurrencyExchange = catchAsyncError(async (req, res, next) => {
  const get = await getCurrencyExchangeFromRedis();

  if (get) {
    return res.json(get);
  }

  const response = await axios.get(CURRENCY_EXCHANGE_URL, {
    params: {
      apikey: environment.CURRENCY_EXCHANGE_KEY,
    },
  });

  const query = response?.data;

  if (!query) {
    return next(new HandleGlobalError("Issue in getting Cuurency Exchange"));
  }

  const exchangeData = query.data;
  await setCurrencyExchangeIntoRedis(exchangeData);

  return res.json(exchangeData);
});

export default getCurrencyExchange;
