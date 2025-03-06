import { Request, Response } from "express";
import {
  authenticateUser,
  authenticateBiometric,
  registerBiometric,
} from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userData = await authenticateUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    const errMessage =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(401).json({ message: errMessage });
  }
};

// Biometric Registration (Face ID or Fingerprint)
export const biometricRegister = async (req: Request, res: Response) => {
  try {
    const { userId, biometricType, biometricKey } = req.body; // biometricType = "faceId" | "fingerprint"
    await registerBiometric(userId, biometricType, biometricKey);

    res.status(200).json({
      message: `Biometric (${biometricType}) registered successfully`,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// Biometric Login
export const biometricLogin = async (req: Request, res: Response) => {
  try {
    const { userId, biometricType, biometricKey } = req.body;
    const userData = await authenticateBiometric(
      userId,
      biometricType,
      biometricKey
    );

    res.status(200).json({
      message: "Biometric login successful",
      user: userData,
    });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
