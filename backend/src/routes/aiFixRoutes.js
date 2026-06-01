import express
  from "express";

import {
  fixCode,
} from "../controllers/aiFixController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.post(
  "/fix",
  protect,
  fixCode
);

export default router;