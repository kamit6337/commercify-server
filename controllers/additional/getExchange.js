import axios from "axios";
import {
  getCurrencyExchangeFromRedis,
  setCurrencyExchangeIntoRedis,
} from "../../redis/Additional/currency.js";
import { environment } from "../../utils/environment.js";

const CURRENCY_EXCHANGE_URL = "https://api.freecurrencyapi.com/v1/latest";

const getExchange = async () => {
  const get = await getCurrencyExchangeFromRedis();

  if (get) {
    return get;
  }

  const response = await axios.get(CURRENCY_EXCHANGE_URL, {
    params: {
      apikey: environment.CURRENCY_EXCHANGE_KEY,
    },
  });

  const query = response?.data;

  if (!query) {
    throw new Error("Issue in getting Currency Exchange");
  }

  const exchangeData = query.data;
  await setCurrencyExchangeIntoRedis(exchangeData);

  return exchangeData;
};

export default getExchange;
