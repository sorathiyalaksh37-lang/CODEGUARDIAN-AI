import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { reviewCode } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, reviewCode);

export default router;