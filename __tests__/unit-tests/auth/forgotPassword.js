import forgotPassword from "../../../controllers/auth/forgot-password/forgotPassword.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import sendingEmail from "../../../utils/email/email.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";

jest.mock("../../../utils/email/email.js");
jest.mock("../../../utils/encryption/encryptAndDecrypt.js");
jest.mock("../../../database/User/getUserByEmail.js");

let req, res, next;

beforeEach(() => {
  req = {
    body: {
      email: "user@gmail.com",
    },
  };

  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: SUCCESSFULLY SEND EMAIL
it("send email successfully", async () => {
  getUserByEmail.mockResolvedValue({
    _id: "user1234",
    name: "user",
    email: "user@gmail.com",
  });

  encrypt.mockReturnValue("token");

  sendingEmail.mockResolvedValue({
    result: "success",
  });

  await forgotPassword(req, res, next);

  expect(res.json).toHaveBeenCalledWith({
    message: "Send reset password link to user",
  });
});

// NOTE: FAILED, DUE TO NOT PRESENT OF EMAIL
it("failed, not present of email", async () => {
  req.body = {};

  await forgotPassword(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Email is not provided",
    })
  );
});

// NOTE: FAILED, DUE TO NOT FIND USER BASED ON EMAIL
it("failed, not find user based on email", async () => {
  getUserByEmail.mockResolvedValue(null);

  await forgotPassword(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "You are not our customer. Please signup first",
    })
  );
});
