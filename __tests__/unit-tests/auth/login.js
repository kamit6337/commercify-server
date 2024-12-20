import login from "../../../controllers/auth/login/login.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";

jest.mock("../../../database/User/getUserByEmail.js");
jest.mock("../../../utils/encryption/encryptAndDecrypt.js");

let req, res, next;

beforeEach(() => {
  req = {
    body: {
      email: "user@gmail.com",
      password: "hashedpassword",
    },
  };

  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    cookie: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: SUCCESSFULLY SEND EMAIL
it("send email successfully", async () => {
  const findUser = {
    _id: "userId",
    role: "user",
    password: "hashedpassword",
    checkPassword: jest.fn().mockReturnValue(true),
  };

  getUserByEmail.mockResolvedValue(findUser);

  encrypt.mockReturnValue("encrypted");

  await login(req, res, next);

  expect(res.json).toHaveBeenCalledWith({
    message: "Login Successfully",
  });
});

// NOTE: FAILED, DUE TO NOT PRESENT OF EMAIL or PASSWORD
it("failed, not present of email or password", async () => {
  req.body = {};

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Email or Password is not provided",
    })
  );
});

// NOTE: FAILED, DUE TO NOT FIND USER BASED ON EMAIL
it("failed, not find user based on email", async () => {
  getUserByEmail.mockReturnValue(null);

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Email or Password is incorrect",
    })
  );
});

// NOTE: FAILED, DUE TO NOT HAVE USER PASSWORD
it("failed, does not have password", async () => {
  const findUser = {
    password: null,
    checkPassword: jest.fn().mockReturnValue(true),
  };

  getUserByEmail.mockResolvedValue(findUser);

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Please reset your password to login",
    })
  );
});

// NOTE: FAILED, DUE TO PASSWORD DOES NOT MATCH
it("failed, due to password does not match", async () => {
  const findUser = {
    password: "hashedpassword",
    checkPassword: jest.fn().mockReturnValue(false),
  };

  getUserByEmail.mockReturnValue(findUser);

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Email or Password is incorrect",
    })
  );
});
