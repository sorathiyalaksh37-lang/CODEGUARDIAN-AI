import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

// Only configure GitHub OAuth if valid credentials are provided
if (process.env.GITHUB_CLIENT_ID && 
    process.env.GITHUB_CLIENT_SECRET && 
    process.env.GITHUB_CLIENT_ID !== 'placeholder_client_id' &&
    process.env.GITHUB_CLIENT_ID !== 'your_github_client_id_here') {
  
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
  
  console.log("✓ GitHub OAuth configured successfully");
} else {
  console.log("⚠️  GitHub OAuth not configured (using placeholder credentials)");
  console.log("   To enable GitHub login, add your GitHub OAuth credentials to .env file");
}

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