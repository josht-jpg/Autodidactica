import passport from "passport";
import googlePassport from "passport-google-oauth20";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const GoogleStrategy = googlePassport.Strategy;

const passportConfig = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://autodidactica.app/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          done(null, {
            _id: user._id,
            name: user.name,
            email: user.email,
            subjects: user.subjects,
            currentSubject: user.currentSubject,
            token: generateToken(user._id),
          });
        } else {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isMember: true,
          });

          if (user) {
            const newUser = {
              _id: user._id,
              name: user.name,
              email: user.email,
              subjects: user.subjects,
              token: generateToken(user._id),
            };

            done(null, newUser);
          }
        }
      }
    )
  );
};

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

export default passportConfig;
