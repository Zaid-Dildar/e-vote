export enum UserRole {
  ADMIN = "admin",
  VOTER = "voter",
  AUDITOR = "auditor",
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
  biometricKey?: string | null; // Stores the biometric public key or reference
  createdAt?: Date;
  updatedAt?: Date;
}
