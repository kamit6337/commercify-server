import User from "../../models/UserModel.js";
import { getUserByIdRedis, setUserIntoRedis } from "../../redis/User/user.js";

const UserFindById = async (userId) => {
  const get = await getUserByIdRedis(userId);

  if (get) return get;

  const findUser = await User.findById(userId);

  await setUserIntoRedis(findUser);

  return findUser;
};

export default UserFindById;
