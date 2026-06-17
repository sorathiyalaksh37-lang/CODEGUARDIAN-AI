import express from "express";
import { register, login } from "../controllers/authController.js";
import passport from "passport";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// GitHub OAuth routes
router.get("/github", (req, res, next) => {
  console.log("GitHub OAuth started");
  passport.authenticate("github", { 
    scope: ["user:email"],
    session: false 
  })(req, res, next);
});

router.get(
  "/github/callback",
  passport.authenticate("github", { 
    failureRedirect: "http://localhost:5173/login?error=github_auth_failed",
    session: false 
  }),
  (req, res) => {
    try {
      console.log("GitHub callback successful");
      const token = generateToken(req.user._id);
      res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
    } catch (error) {
      console.error("GitHub callback error:", error);
      res.redirect("http://localhost:5173/login?error=auth_failed");
    }
  }
);

export default router;