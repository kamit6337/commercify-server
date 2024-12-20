import newPassword from "../../../controllers/auth/forgot-password/newPassword.js";
import patchUserProfile from "../../../database/User/patchUserProfile.js";
import { decrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import bcrypt from "bcryptjs";

jest.mock("../../../utils/encryption/encryptAndDecrypt.js");
jest.mock("../../../database/User/patchUserProfile.js");
jest.mock("bcryptjs");

let req, res, next;

beforeEach(() => {
  req = {
    body: {
      email: "user@gmail.com",
      token: "user123",
      password: "user1234",
    },
  };

  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  next = jest.fn();
});

// NOTE: RESET PASSWORD SUCCESSFULLY
it("reset password successfully", async () => {
  decrypt.mockReturnValue({
    id: "userId",
    email: "user@gmail.com",
    exp: Date.now() + 20 * 60 * 1000, // 20 minutes
  });

  bcrypt.hashSync.mockReturnValue("hashPassword");

  patchUserProfile.mockResolvedValue("success");

  await newPassword(req, res, next);

  expect(res.json).toHaveBeenCalledWith({
    message: "Password has been updated",
  });
});

// NOTE: FAILED DUE TO EMPTY REQ.BODY
it("failed, due to empty req.body", async () => {
  req.body = {};

  await newPassword(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "All fields is required",
    })
  );
});

// NOTE: FAILED DUE TO TIME EXPIRE OF TOKEN
it("failed, due to time expire of token", async () => {
  decrypt.mockReturnValue({
    id: "userId",
    email: "user@gmail.com",
    exp: Date.now() - 20 * 60 * 1000, // 20 minutes
  });

  await newPassword(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "It's time out. Click again on Forgot Password to send link",
    })
  );
});

// NOTE: FAILED DUE TO EMAIL DON'T MATCH
it("failed, due to email don't match", async () => {
  decrypt.mockReturnValue({
    id: "userId",
    email: "use@gmail.com",
    exp: Date.now() + 20 * 60 * 1000, // 20 minutes
  });

  await newPassword(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Issue in create new Password",
    })
  );
});
