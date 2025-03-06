import { Router } from "express";
import { login, biometricLogin } from "../controllers/auth.controller";

const router = Router();

// Standard Login
router.post("/login", login);

// Biometric Login
router.post("/login/biometric", biometricLogin);

export default router;
