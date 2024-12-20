import bcrypt from "bcryptjs";

export const hashUserPassword = async (obj) => {
  if (obj.password) {
    try {
      obj.password = await bcrypt.hash(obj.password, 12);
    } catch (error) {
      throw new Error("Failed to hash the password");
    }
  }

  return obj;
};

export const verifyUserPassword = async (actualPassword, givenPassword) => {
  if (!actualPassword || !givenPassword) {
    throw new Error("Actual and Given Password is not provided");
  }

  try {
    const checkPassword = await bcrypt.compare(
      givenPassword?.toString(),
      actualPassword
    );
    return checkPassword;
  } catch (error) {
    throw new Error("Failed to verify the password");
  }
};
