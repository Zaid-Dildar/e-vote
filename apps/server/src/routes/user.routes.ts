import { Router } from "express";
import { validateUser } from "../validators/user.validator";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authorizeRoles, protect } from "../middleware/authMiddleware";

const router = Router();

// Only authenticated users can access these routes
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.get("/:id", protect, getUserById);
router.post("/", protect, authorizeRoles("admin"), validateUser, createUser);
router.put("/:id", protect, authorizeRoles("admin"), validateUser, updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
