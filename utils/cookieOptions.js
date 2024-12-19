import { environment } from "./environment.js";

const PRODUCTION = "production";

const cookieOptions = {
  maxAge: environment.JWT_EXPIRES_IN,
  httpOnly: true,
  secure: environment.NODE_ENV === PRODUCTION,
  sameSite: environment.NODE_ENV === PRODUCTION ? "None" : "Lax",
};

export default cookieOptions;
