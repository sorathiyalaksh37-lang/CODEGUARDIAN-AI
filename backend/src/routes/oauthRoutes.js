import express from "express";

import passport from "passport";

import generateToken
  from "../utils/generateToken.js";

const router =
  express.Router();

// LOGIN

router.get(

  "/github",

  passport.authenticate(
    "github",
    {
      scope:
        ["user:email"],
    }
  )

);

// CALLBACK

router.get(

  "/github/callback",

  passport.authenticate(
    "github",
    {
      failureRedirect:
        "/login",
    }
  ),

  async (req, res) => {

    const token =
      generateToken(
        req.user._id
      );

    res.redirect(

      `http://localhost:5173/oauth-success?token=${token}`

    );

  }

);

export default router;