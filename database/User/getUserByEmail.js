import User from "../../models/UserModel.js";
import {
  getUserByEmailRedis,
  setUserIntoRedis,
} from "../../redis/User/user.js";

const getUserByEmail = async (email) => {
  const get = await getUserByEmailRedis(email);

  if (get) {
    // Convert the plain object from Redis into a Mongoose document
    return User.hydrate(get);
  }

  const findUser = await User.findOne({ email });

  await setUserIntoRedis(findUser);

  return findUser;
};

export default getUserByEmail;
