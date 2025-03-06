import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { UserType } from "../types/User";
import generateToken from "../utils/generateToken";

// Standard Login
export const authenticateUser = async (email: string, password: string) => {
  const user: UserType | null = await User.findOne({ email });

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    biometricRegistered: user.biometricRegistered,
    token: generateToken(user._id),
  };
};

// Register biometric (Face ID or Fingerprint)
export const registerBiometric = async (
  userId: string,
  biometricType: "faceId" | "fingerprint",
  biometricKey: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (biometricType === "faceId") {
    user.faceIdKey = biometricKey;
  } else if (biometricType === "fingerprint") {
    user.fingerprintKey = biometricKey;
  } else {
    throw new Error("Invalid biometric type");
  }

  user.biometricRegistered = !!(user.faceIdKey || user.fingerprintKey);
  await user.save();
};

// Biometric Authentication (Face ID or Fingerprint)
export const authenticateBiometric = async (
  id: string,
  biometricType: "faceId" | "fingerprint",
  biometricKey: string
) => {
  const user: UserType | null = await User.findById(id);

  if (!user || !user.biometricRegistered) {
    throw new Error("Biometric authentication not set up");
  }

  if (biometricType === "faceId" && user.faceIdKey === biometricKey) {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    };
  } else if (
    biometricType === "fingerprint" &&
    user.fingerprintKey === biometricKey
  ) {
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Invalid biometric credentials");
  }
};
