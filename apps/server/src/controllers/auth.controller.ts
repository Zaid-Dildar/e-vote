import { Request, Response } from "express";
import {
  authenticateUser,
  generateBiometricChallenge,
  registerBiometric,
  verifyBiometricAuth,
} from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userData = await authenticateUser(email, password);

    res.status(200).json({
      message: "Login successful. Proceed to biometric verification.",
      user: userData,
    });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// Generate WebAuthn Challenge for 2FA
export const getBiometricChallenge = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) throw new Error("User ID is required");

    const challengeData = await generateBiometricChallenge(userId);

    res.status(200).json({
      message: "Biometric challenge generated",
      challenge: challengeData.challenge,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// Register Biometric (WebAuthn Public Key)
export const biometricRegister = async (req: Request, res: Response) => {
  try {
    const { userId, credentialId, publicKey, deviceId } = req.body;
    if (!userId || !credentialId || !publicKey || !deviceId) {
      throw new Error(
        "All fields (userId, credentialId, publicKey, deviceId) are required"
      );
    }

    await registerBiometric(userId, credentialId, publicKey, deviceId);

    res.status(200).json({
      message: "Biometric registered successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// Verify WebAuthn Biometric Authentication
export const verifyBiometricAuthController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, credentialId, signedChallenge } = req.body;
    if (!userId || !credentialId || !signedChallenge) {
      throw new Error(
        "User ID, credential ID, and signed challenge are required"
      );
    }

    const userData = await verifyBiometricAuth(
      userId,
      credentialId,
      signedChallenge
    );

    res.status(200).json({
      message: "Biometric authentication successful",
      user: userData,
    });
  } catch (error) {
    res.status(401).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
