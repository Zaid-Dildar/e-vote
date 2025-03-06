import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { UserType } from "../types/User";
import generateToken from "../utils/generateToken";

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
    biometricRegistered: user.biometricRegistered, // Indicate if biometric is registered
    token: generateToken(user._id),
  };
};

// Authenticate using biometrics
export const authenticateBiometric = async (
  id: string,
  biometricKey: string
) => {
  const user: UserType | null = await User.findById(id);

  if (!user || !user.biometricRegistered || !user.biometricKey) {
    throw new Error("Biometric authentication not set up");
  }

  if (user.biometricKey !== biometricKey) {
    throw new Error("Invalid biometric credentials");
  }

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    token: generateToken(user._id),
  };
};
