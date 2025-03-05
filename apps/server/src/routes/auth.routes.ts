import express from "express";
import { login } from "../controllers/auth.controller";

const router = express.Router();

// Login route
router.post("/login", login);

export default router;
