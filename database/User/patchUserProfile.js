import { hashUserPassword } from "../../lib/bcrypt.js";
import User from "../../models/UserModel.js";
import { setUserIntoRedis } from "../../redis/User/user.js";

const patchUserProfile = async (userId, obj) => {
  const modifyObj = await hashUserPassword(obj);

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      ...modifyObj,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  await setUserIntoRedis(user);

  return user;
};

export default patchUserProfile;
