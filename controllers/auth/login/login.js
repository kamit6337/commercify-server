import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import { encrypt } from "../../../lib/encryptAndDecrypt.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import { verifyUserPassword } from "../../../lib/bcrypt.js";

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //   MARK: IF USER DOES NOT PROVIDE EITHER EMAIL OR PASSWORD
  if (!email || !password) {
    return next(
      new HandleGlobalError("Email or Password is not provided", 404)
    );
  }

  const findUser = await getUserByEmail(email);

  if (!findUser) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  if (!findUser.password) {
    return next(
      new HandleGlobalError("Please reset your password to login", 404)
    );
  }

  //   MARK: IF USER PASSWORD DOES NOT MATCH WITH HASH PASSWORD, THROW ERROR
  const isPasswordValid = await verifyUserPassword(findUser.password, password);

  if (!isPasswordValid) {
    return next(new HandleGlobalError("Email or Password is incorrect", 404));
  }

  //   MARK: USER EMAIL AND PASSWORD IS CONFIRMED, SEND TOKEN AND MAKE LOGIN
  const token = encrypt({
    id: findUser._id,
    role: findUser.role,
  });

  res.json(token);
});

export default login;
