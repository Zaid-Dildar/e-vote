import { Router } from "express";
import {
  login,
  biometricRegister,
  getBiometricChallenge,
  verifyBiometricAuthController,
} from "../controllers/auth.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Standard Login
router.post("/login", login);

// Biometric Registration (stores public key)
router.post("/biometric/register", protect, biometricRegister);

// Get WebAuthn Challenge (Step 1 of 2FA)
router.get("/biometric/challenge", protect, getBiometricChallenge);

// Verify Biometric Authentication (Step 2 of 2FA)
router.post("/biometric/verify", protect, verifyBiometricAuthController);

export default router;
