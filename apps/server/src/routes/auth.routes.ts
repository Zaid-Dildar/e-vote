import { Router } from "express";
import {
  login,
  biometricLogin,
  biometricRegister,
} from "../controllers/auth.controller";

const router = Router();

// Standard Login
router.post("/login", login);

// Biometric Registration
router.post("/register-biometric", biometricRegister);

// Biometric Login
router.post("/login/biometric", biometricLogin);

export default router;
