import express
  from "express";

import {
  askAiAssistant,
} from "../controllers/aiController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.post(
  "/chat",
  protect,
  askAiAssistant
);

export default router;