import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole, UserType } from "../types/User";

const BiometricKeySchema = new Schema(
  {
    credentialId: { type: String, required: true },
    publicKey: { type: String, required: true },
    counter: { type: Number, required: true, default: 0 }, // ✅ Add counter
    transports: { type: [String], required: false, default: [] }, // ✅ Add transports
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
    biometricKey: BiometricKeySchema, // Store a single biometric key
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
