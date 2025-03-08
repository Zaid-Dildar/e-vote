import { Request, Response } from "express";
import {
  authenticateUser,
  getRegistrationOptions,
  verifyBiometricRegistration,
  getAuthenticationOptions,
  verifyBiometricAuth,
} from "../services/auth.service";

interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Adjust this type based on your actual user object
}

// 1. Email & Password Login
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

// 2. Generate WebAuthn Registration Options
export const generateRegistrationOptionsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User ID is required");

    const options = await getRegistrationOptions(userId);
    res.status(200).json(options);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// 3. Verify WebAuthn Registration Response
export const verifyRegistrationResponseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, credential } = req.body;
    if (!userId || !credential) {
      throw new Error("User ID and credential response are required");
    }

    const verification = await verifyBiometricRegistration(userId, credential);
    res.status(verification.success ? 200 : 400).json(verification);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// 4. Generate WebAuthn Authentication Options
export const generateAuthenticationOptionsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User ID is required");

    const options = await getAuthenticationOptions(userId);
    res.status(200).json(options);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

// 5. Verify WebAuthn Authentication Response
export const verifyAuthenticationResponseController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, credential } = req.body;
    if (!userId || !credential) {
      throw new Error("User ID and credential response are required");
    }

    const verification = await verifyBiometricAuth(userId, credential);
    res.status(verification.success ? 200 : 400).json(verification);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
