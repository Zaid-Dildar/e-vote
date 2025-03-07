import { Router } from "express";
import {
  login,
  biometricLogin,
  biometricRegister,
} from "../controllers/auth.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Standard Login
router.post("/login", login);

// Biometric Login
router.post("/login/biometric", biometricLogin);

// Biometric Registration
router.post("/register-biometric", protect, biometricRegister);

export default router;
