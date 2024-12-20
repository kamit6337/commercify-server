import User from "../../models/UserModel.js";
import { setUserIntoRedis } from "../../redis/User/user.js";

const postCreateUser = async (obj) => {
  const createUser = await User.create({
    ...obj,
  });

  await setUserIntoRedis(createUser);

  return createUser;
};

export default postCreateUser;
