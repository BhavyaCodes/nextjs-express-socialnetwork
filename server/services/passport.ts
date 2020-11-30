import { serializeUser, deserializeUser, use } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../models/User";

serializeUser((user: IUser, done) => {
  done(null, user.id);
});

deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken, profile);
      const existingUser = await User.findOne({
        googleId: profile.id,
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({
        googleId: profile.id,
        name: profile.displayName,
        imageUrl: profile._json.picture,
      }).save();
      done(null, user);
    }
  )
);
