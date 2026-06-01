import express from "express";
import {
  createTeam,
  getMyTeams,
  inviteMember,
  removeMember,
  deleteTeam,
} from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.get("/my-teams", protect, getMyTeams);
router.post("/add-member", protect, inviteMember);
router.post("/remove-member", protect, removeMember);
router.delete("/delete/:id", protect, deleteTeam);

export default router;