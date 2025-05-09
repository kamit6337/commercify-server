import User from "../../models/UserModel.js";
import {
  getAdminUsersFromRedis,
  setAdminUsersIntoRedis,
} from "../../redis/User/adminUser.js";

const getAdminUsers = async () => {
  const get = await getAdminUsersFromRedis();
  if (get) return get;

  const admins = await User.find({
    role: "admin",
  }).lean();

  const adminList = admins.map((admin) => admin._id?.toString());

  await setAdminUsersIntoRedis(adminList);

  return adminList;
};

export default getAdminUsers;
