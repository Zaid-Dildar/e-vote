export enum UserRole {
  ADMIN = "admin",
  VOTER = "voter",
  AUDITOR = "auditor",
}

// Define a type for biometric keys
export interface BiometricKey {
  credentialId: string; // Biometric type
  publicKey: string; // Public key for authentication
  deviceId: string; // Unique device identifier
  counter: number;
  transports?: string[]; // ✅ Add optional transports field
}

// Define user schema type
export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  password: string;
  biometricRegistered: boolean; // Has the user enrolled biometrics?
  biometricKeys: BiometricKey[]; // Array of biometric keys for multiple devices
  biometricChallenge?: string; // Store challenge for WebAuthn authentication
  createdAt?: Date;
  updatedAt?: Date;
}
