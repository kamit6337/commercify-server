import axios from "axios";
import { environment } from "../../utils/environment.js";
import {
  getLocationKeyFromRedis,
  setLocationKetIntoRedis,
} from "../../redis/Location/locationKey.js";

const URL = "https://www.universal-tutorial.com/api/getaccesstoken";

const getLocationKey = async () => {
  const get = await getLocationKeyFromRedis();

  if (get) {
    return get;
  }

  const response = await axios.get(URL, {
    headers: {
      "user-email": environment.COUNTRY_KEY_EMAIL,
      "api-token": environment.COUNTRY_KEY,
      Accept: "application/json",
    },
  });

  const query = response?.data;
  const token = query?.auth_token;

  await setLocationKetIntoRedis(token);

  return token;
};

export default getLocationKey;
