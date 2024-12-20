import User from "../../models/UserModel.js";
import { getUserByIdRedis, setUserIntoRedis } from "../../redis/User/user.js";

const getUserById = async (id) => {
  const get = await getUserByIdRedis(id);

  if (get) {
    return User.hydrate(get);
  }

  const findUser = await User.findOne({
    _id: id,
  });

  await setUserIntoRedis(findUser);

  return findUser;
};

export default getUserById;
