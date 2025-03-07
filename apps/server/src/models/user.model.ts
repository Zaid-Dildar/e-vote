import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole, UserType } from "../types/User";

const BiometricKeySchema = new Schema(
  {
    credentialId: { type: String, required: true }, // Unique credential ID for WebAuthn
    publicKey: { type: String, required: true }, // Public key associated with WebAuthn
    deviceId: { type: String, required: true }, // Unique identifier for the device
  },
  { _id: false }
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
    biometricKeys: [BiometricKeySchema], // Store multiple biometric credentials
    biometricChallenge: { type: String, default: null }, // Store the WebAuthn challenge
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
