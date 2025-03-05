export enum UserRole {
  ADMIN = "admin",
  VOTER = "voter",
  AUDITOR = "auditor",
}

// Define user schema type
export interface UserType extends Document {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
