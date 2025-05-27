import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { environment } from "../utils/environment.js";

// NOTE:GOOGLE OAUTH
passport.use(
  new GoogleStrategy(
    {
      clientID: environment.GOOGLE_CLIENT_ID,
      clientSecret: environment.GOOGLE_CLIENT_SECRET,
      callbackURL: `/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("profile", profile);
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializeUser", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("deserializeUser", user);
  done(null, user);
});
