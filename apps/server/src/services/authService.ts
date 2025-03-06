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
    token: generateToken(user._id),
  };
};
