import loginCheck from "../../../controllers/auth/login/loginCheck.js";
import getUserById from "../../../database/User/getUserById.js";
import { decrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import Req from "../../../utils/Req.js";

jest.mock("../../../database/User/getUserById.js");
jest.mock("../../../utils/encryption/encryptAndDecrypt.js");
jest.mock("../../../utils/Req.js");

describe("login check controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        cookie: "sessionId=encryptedSessionToken",
      },
    };
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
  });

  // NOTE: SHOULD RETURN INFO WHEN SESSION IS VALID
  it("should return user information when session is valid", async () => {
    // Mock the Req function
    Req.mockReturnValue({
      _use: "encryptedSessionToken",
    });

    // Mock the decrypt function
    decrypt.mockReturnValue({
      id: "user123",
      iat: Date.now() - 1000,
      exp: Date.now() + 1000 * 60 * 60, // 1 hour from now
    });

    // Mock the User model's findOne method
    getUserById.mockResolvedValue({
      _id: "user123",
      name: "John Doe",
      username: "johndoe",
      photo: "profile.jpg",
      email: "john@example.com",
      role: "user",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    });

    await loginCheck(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: "User is present",
      _id: "user123",
      name: "John Doe",
      username: "johndoe",
      photo: "profile.jpg",
      email: "john@example.com",
      role: "user",
    });
  });

  // NOTE: SHOULD RETURN INFO WHEN _use COOKIES IS NOT PRESENT
  it("login check failed, _use equal undefined", async () => {
    Req.mockReturnValue({
      _use: undefined,
    });

    await loginCheck(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Your do not have active session. Please Login",
      })
    );
  });

  // NOTE: SHOULD RETURN INFO WHEN USER IS NOT PRESENT
  it("login check failed, User not present", async () => {
    Req.mockReturnValue({
      _use: "encryptedSessionToken",
    });

    // Mock the decrypt function
    decrypt.mockReturnValue({
      id: "user123",
      iat: Date.now() - 1000,
      exp: Date.now() + 1000 * 60 * 60, // 1 hour from now
    });

    getUserById.mockResolvedValue(null);

    await loginCheck(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Unauthorised Access. Please Login Again.",
      })
    );
  });

  //  NOTE: LOGIN CHECK FAILED, WHEN USER SESSION IS BELOW 30 MINUTES LEFT
  it("login check failed, user session below 30 minutes", async () => {
    Req.mockReturnValue({
      _use: "EncryptedData",
    });

    decrypt.mockReturnValue({
      id: "user123",
      iat: Date.now() - 10 * 60 * 1000, //10 minutes before
      exp: Date.now() + 15 * 60 * 1000, //15 minutes after
    });

    getUserById.mockResolvedValue({
      _id: "user123",
      name: "John Doe",
      username: "johndoe",
      photo: "profile.jpg",
      email: "john@example.com",
      role: "user",
      updatedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    });

    await loginCheck(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Your Session has expired. Please Login Again.",
      })
    );
  });

  // NOTE: LOGIN CHECK FAILED, IF SOMEONE HAS LOGGED IN WHEN USER RESET PASSWORD
  it("login check failed, user logged in other devices and reset password in one device", async () => {
    Req.mockReturnValue({
      _use: "encryptData",
    });

    decrypt.mockReturnValue({
      id: "user123",
      iat: Date.now() - 10 * 60 * 1000,
      exp: Date.now() + 60 * 60 * 1000,
    });

    getUserById.mockResolvedValue({
      _id: "user123",
      name: "John Doe",
      username: "johndoe",
      photo: "profile.jpg",
      email: "john@example.com",
      role: "user",
      updatedAt: new Date(Date.now()), // now
    });

    await loginCheck(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Please login again...",
      })
    );
  });
});
