import User from "../../models/UserModel.js";
import {
  getUserByMobileRedis,
  setUserIntoRedis,
} from "../../redis/User/user.js";

const UserFindByMobile = async (mobile) => {
  const get = await getUserByMobileRedis(mobile);
  if (get) return get;

  const findUser = await User.findOne({
    mobile: mobile,
  });

  await setUserIntoRedis(findUser);

  return findUser;
};

export default UserFindByMobile;
