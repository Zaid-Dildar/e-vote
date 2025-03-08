import { Router } from "express";
import {
  login,
  generateRegistrationOptionsController,
  verifyRegistrationResponseController,
  generateAuthenticationOptionsController,
  verifyAuthenticationResponseController,
} from "../controllers/auth.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Standard Login
router.post("/login", login);

// Generate WebAuthn Registration Options (Step 1 of Registration)
router.get(
  "/biometric/register/options",
  protect,
  generateRegistrationOptionsController
);

// Verify WebAuthn Registration Response (Step 2 of Registration)
router.post(
  "/biometric/register/verify",
  protect,
  verifyRegistrationResponseController
);

// Generate WebAuthn Authentication Options (Step 1 of Authentication)
router.get(
  "/biometric/authenticate/options",
  protect,
  generateAuthenticationOptionsController
);

// Verify WebAuthn Authentication Response (Step 2 of Authentication)
router.post(
  "/biometric/authenticate/verify",
  protect,
  verifyAuthenticationResponseController
);

export default router;
