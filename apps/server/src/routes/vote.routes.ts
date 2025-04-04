import { Router } from "express";
import { validateVote } from "../validators/vote.validator";
import {
  castVote,
  getVotesByElection,
  getVotesByUser,
} from "../controllers/vote.controller";
import { authorizeRoles, protect } from "../middleware/authMiddleware";

const router = Router();

// Only authenticated users can access these routes
router.post("/", protect, authorizeRoles("voter"), validateVote, castVote);
router.get(
  "/election/:electionId",
  protect,
  authorizeRoles("admin"),
  getVotesByElection
);
router.get("/user/:userId", protect, authorizeRoles("voter"), getVotesByUser);

export default router;
