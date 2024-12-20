import OAuthLogin from "../../../controllers/auth/OAuth-login/OAuthLogin.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import postCreateUser from "../../../database/User/postCreateUser.js";
import uploadProfileImageToS3 from "../../../lib/uploadProfileImageToS3.js";
import { encrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import { environment } from "../../../utils/environment.js";
import createUserName from "../../../utils/javaScript/createUserName.js";

jest.mock("../../../utils/javaScript/createUserName.js");
jest.mock("../../../lib/uploadProfileImageToS3.js");
jest.mock("../../../database/User/getUserByEmail.js");
jest.mock("../../../database/User/postCreateUser.js");
jest.mock("../../../utils/encryption/encryptAndDecrypt.js");

let req, res, next;

beforeEach(() => {
  req = {
    user: {
      id: "userId",
      provider: "google",
      _json: {
        name: "user",
        email: "user@gmail.com",
        picture: "https://userProfilePic.png",
      },
    },
  };

  res = {
    status: jest.fn(),
    json: jest.fn(() => res),
    cookie: jest.fn(),
    redirect: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: USER LOGGED IN WHEN CREATED PREVIOUSLY
it("OAuth-login, user logged in when create previously successsfully", async () => {
  getUserByEmail.mockResolvedValue({
    _id: "userId",
    role: "user",
  });

  encrypt.mockReturnValue("encryptedToken");

  await OAuthLogin(req, res, next);



  expect(res.redirect).toHaveBeenCalledWith(environment.CLIENT_URL);
});

// NOTE: USER LOGGED IN WITH CREATED
it("OAuth-login, user logged in with create user successsfully", async () => {
  getUserByEmail.mockResolvedValue(null);

  createUserName.mockReturnValue("user");

  const userName = "user";

  uploadProfileImageToS3.mockResolvedValue("aws-s3-url");

  postCreateUser.mockResolvedValue({
    _id: "userId",
    role: "user",
  });

  encrypt.mockReturnValue("encryptedToken");

  await OAuthLogin(req, res, next);



  expect(res.redirect).toHaveBeenCalledWith(
    `${environment.CLIENT_URL}/flow?username=${userName}`
  );
});

// NOTE: FAILED DUE TO EMPTY REQ.USER
it("failed, due to empty req.user", async () => {
  req = {};

  await OAuthLogin(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Error in login. Please try again!",
    })
  );
});

// NOTE: FAILED DUE TO USER NOT CREATED SUCCESSFULLY
it("failed, due to user not created successfully", async () => {
  getUserByEmail.mockResolvedValue(null);

  createUserName.mockReturnValue("user");

  postCreateUser.mockResolvedValue(null);

  await OAuthLogin(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Issue in Signup",
    })
  );
});
