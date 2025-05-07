import { environment } from "../../../utils/environment.js";
import HandleGlobalError from "../../../lib/HandleGlobalError.js";
import catchAsyncError from "../../../lib/catchAsyncError.js";
import { encrypt } from "../../../lib/encryptAndDecrypt.js";
import getUserByEmail from "../../../database/User/getUserByEmail.js";
import postCreateUser from "../../../database/User/postCreateUser.js";
import checkS3Credentials from "../../../lib/aws/checkS3Credentials.js";
import uploadProfileImageToS3 from "../../../lib/aws/uploadProfileImageToS3.js";
import adminEmailList from "../../../data/adminEmailList.js";

// NOTE: LOGIN SUCCESS
const OAuthLogin = async (req, res, next) => {
  try {
    if (!req.user) {
      res.redirect(`${environment.CLIENT_URL}/oauth`);
      return;
    }

    let {
      id,
      provider,
      _json: { name, email, picture },
    } = req.user;

    let findUser = await getUserByEmail(email);

    if (!findUser) {
      // MARK: IF NOT FIND USER

      let uploadedPicture = picture; // Default to the original picture URL

      // Dynamically check S3 credentials and upload if valid
      const isS3Available = await checkS3Credentials();
      if (isS3Available) {
        uploadedPicture = await uploadProfileImageToS3(picture);
      }

      const obj = {
        name,
        email,
        photo: uploadedPicture,
        OAuthId: id,
        OAuthProvider: provider,
        role: adminEmailList.includes(email) ? "admin" : "user",
      };

      const createUser = await postCreateUser(obj);

      if (!createUser) {
        res.redirect(`${environment.CLIENT_URL}/oauth`);
        return;
      }

      const token = encrypt({
        id: createUser._id.toString(),
        role: createUser.role,
      });

      res.redirect(`${environment.CLIENT_URL}/oauth?token=${token}`);
      return;
    }

    // MARK: IF FIND USER IS PRESENT
    const token = encrypt({
      id: findUser._id,
      role: findUser.role,
    });

    res.redirect(`${environment.CLIENT_URL}/oauth?token=${token}`);
  } catch (error) {
    console.log("Error in OAuth Login", error);

    res.redirect(`${environment.CLIENT_URL}/oauth`);
  }
};

export default OAuthLogin;
