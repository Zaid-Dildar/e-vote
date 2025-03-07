import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole, UserType } from "../types/User";

const BiometricKeySchema = new Schema(
  {
    type: { type: String, enum: ["faceId", "fingerprint"], required: true }, // Type of biometric key
    key: { type: String, required: true }, // The public key
    deviceId: { type: String, required: true }, // Unique device identifier
  },
  { _id: false } // Prevents mongoose from generating separate _id for each key
);

const UserSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    department: { type: String, required: true },
    password: { type: String, required: true },

    // Biometric Authentication Fields
    biometricRegistered: { type: Boolean, default: false },
    biometricKeys: [BiometricKeySchema], // Store multiple biometric keys per user
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<UserType>("User", UserSchema);
export default User;
