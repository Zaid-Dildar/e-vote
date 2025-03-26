import { Router } from "express";
import { validateElection } from "../validators/election.validator";
import {
  getElections,
  getElectionById,
  createElection,
  updateElection,
  deleteElection,
} from "../controllers/election.controller";
import { authorizeRoles, protect } from "../middleware/authMiddleware";

const router = Router();

// Only authenticated users can access these routes
router.get("/", protect, authorizeRoles("admin", "auditor"), getElections);
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "auditor"),
  getElectionById
);
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  validateElection,
  createElection
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  validateElection,
  updateElection
);
router.delete("/:id", protect, authorizeRoles("admin"), deleteElection);

export default router;
