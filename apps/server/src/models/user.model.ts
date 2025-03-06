import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole, UserType } from "../types/User";

const UserSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    department: { type: String, required: true },
    password: { type: String, required: true },

    // Biometric Authentication Fields
    biometricRegistered: { type: Boolean, default: false }, // Has the user enrolled biometrics?
    biometricKey: { type: String, default: null }, // Stores the biometric public key or reference
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<UserType>("User", UserSchema);
export default User;
