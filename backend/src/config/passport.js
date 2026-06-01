import passport from "passport";

import {
  Strategy as GitHubStrategy,
} from "passport-github2";

import User from "../models/User.js";

passport.use(

  new GitHubStrategy(

    {

      clientID:
        process.env.GITHUB_CLIENT_ID,

      clientSecret:
        process.env.GITHUB_CLIENT_SECRET,

      callbackURL:
        "http://localhost:8000/api/auth/github/callback",

    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

      try {

        let user =
          await User.findOne({

            githubId:
              profile.id,

          });

        if (!user) {

          user =
            await User.create({

              name:
                profile.displayName,

              email:
                profile.emails?.[0]
                  ?.value ||

                `${profile.username}@github.com`,

              githubId:
                profile.id,

              avatar:
                profile.photos?.[0]
                  ?.value,

            });

        }

        return done(
          null,
          user
        );

      } catch (error) {

        return done(
          error,
          null
        );

      }

    }

  )

);

export default passport;