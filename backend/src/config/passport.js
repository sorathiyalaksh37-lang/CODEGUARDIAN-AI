import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/auth/github/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub Profile:", profile);

        // Check if user exists by GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          console.log("User found by GitHub ID:", user.email);
          return done(null, user);
        }

        // Check if user exists by email
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
        user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
          // Link GitHub account to existing user
          user.githubId = profile.id;
          user.githubUsername = profile.username;
          user.avatar = profile.photos?.[0]?.value;
          await user.save();
          console.log("GitHub linked to existing user:", user.email);
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          name: profile.displayName || profile.username,
          email: email.toLowerCase(),
          githubId: profile.id,
          githubUsername: profile.username,
          avatar: profile.photos?.[0]?.value,
          password: null,
        });

        console.log("New user created:", user.email);
        return done(null, user);
      } catch (error) {
        console.error("GitHub Auth Error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;