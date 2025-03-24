import bcrypt from "bcryptjs";
import User from "../models/user.model";
import generateToken from "../utils/generateToken";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import * as cbor from "cbor";

// **1. Standard Email & Password Authentication**
export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    biometricRegistered: user.biometricRegistered,
    password: user.password,
    token: generateToken(user._id),
  };
};

// **2. Generate Biometric Registration Options**
export const getRegistrationOptions = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Check if the user already has a biometric key
  if (user.biometricKey) {
    throw new Error("User already has a registered biometric key");
  }

  const options = await generateRegistrationOptions({
    rpName: "E-Vote System",
    rpID: process.env.RP_ID || "localhost",
    userID: new TextEncoder().encode(user.id),
    userName: user.email,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
      authenticatorAttachment: "platform",
    },
    excludeCredentials: [],
  });

  user.biometricChallenge = options.challenge;
  await user.save(); // ✅ Store challenge
  return options;
};

// **3. Verify Biometric Registration Response**

export const verifyBiometricRegistration = async (
  userId: string,
  credential: any
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("❌ User not found");

  const expectedChallenge = user.biometricChallenge;
  if (!expectedChallenge) throw new Error("❌ Challenge not found");

  const verification = await verifyRegistrationResponse({
    response: credential, // Ensure this contains `.id`, `.rawId`, and `.response`
    expectedChallenge,
    expectedRPID: process.env.RP_ID || "localhost",
    expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
    requireUserVerification: true,
  });

  if (!verification.verified) throw new Error("❌ Verification failed");

  const registrationInfo = verification.registrationInfo;
  if (!registrationInfo) throw new Error("❌ Missing registration info");

  // Ensure biometric-only authentication (reject PIN-only)
  if (
    registrationInfo.credentialDeviceType === "singleDevice" &&
    !registrationInfo.userVerified
  ) {
    throw new Error(
      "Biometrics are required for registration. PIN-only registration is not allowed."
    );
  }

  // Reject based on known AAGUIDs (you can add more AAGUIDs for biometric-only authenticators)
  const nonBiometricAAGUIDs = ["00000000-0000-0000-0000-000000000000"]; // Example placeholder

  if (nonBiometricAAGUIDs.includes(registrationInfo.aaguid)) {
    throw new Error(
      "Non-biometric authenticator detected. Biometrics are required."
    );
  }

  const { credential: registrationCredential, aaguid } = registrationInfo;
  if (!registrationCredential) throw new Error("❌ Missing credential data");

  const attestationObject = Buffer.from(
    credential.response.attestationObject,
    "base64"
  ); // ✅ Ensure Buffer Encoding

  const decodedAttestation = cbor.decodeFirstSync(attestationObject);

  if (!decodedAttestation || !decodedAttestation.authData) {
    throw new Error("❌ Failed to extract authenticator data");
  }

  const authData = decodedAttestation.authData;

  if (!(authData instanceof Buffer)) {
    throw new Error("❌ Authenticator data is not a Buffer");
  }

  const flags = authData[32]; // Flags are at byte index 32

  const userVerified = (flags & 0x04) !== 0; // Check the 5th bit (User Verification)

  if (!userVerified) {
    throw new Error(
      "❌ Biometrics are required for registration. PIN-only registration is not allowed."
    );
  }

  const normalizedCredentialId = isoBase64URL.fromBuffer(
    new Uint8Array(Buffer.from(registrationCredential.id, "base64"))
  );
  const encodedPublicKey = isoBase64URL.fromBuffer(
    registrationCredential.publicKey
  );

  user.biometricKey = {
    credentialId: normalizedCredentialId,
    publicKey: encodedPublicKey,
    counter: registrationCredential.counter,
    transports: credential.transports || [],
  };

  user.biometricRegistered = true;
  user.biometricChallenge = undefined;

  await user.save();

  return { success: true, message: "Biometric registered successfully" };
};

// **4. Generate Biometric Authentication Options**
export const getAuthenticationOptions = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.biometricRegistered) throw new Error("User not found");

  if (!user.biometricKey) {
    throw new Error("No biometric key registered for this user");
  }

  const options = await generateAuthenticationOptions({
    // ✅ Await the function
    rpID: process.env.RP_ID || "localhost",
    allowCredentials: [
      {
        id: user.biometricKey.credentialId,
        transports: user.biometricKey
          .transports as AuthenticatorTransportFuture[],
      },
    ],
    userVerification: "required",
  });

  user.biometricChallenge = options.challenge;
  await user.save(); // ✅ Store challenge properly
  return options;
};

// **5. Verify Biometric Authentication**
export const verifyBiometricAuth = async (userId: string, credential: any) => {
  const user = await User.findById(userId);
  if (!user || !user.biometricRegistered) {
    return {
      success: false,
      error: "User not found or biometrics not registered",
    };
  }

  if (!user.biometricKey) {
    return {
      success: false,
      error: "No biometric key registered for this user",
    };
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: user.biometricChallenge ?? "",
      expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
      expectedRPID: process.env.RP_ID || "localhost",
      credential: {
        id: user.biometricKey.credentialId,
        publicKey: Buffer.from(user.biometricKey.publicKey, "base64"),
        counter: user.biometricKey.counter,
        transports: user.biometricKey
          .transports as AuthenticatorTransportFuture[],
      },
    });

    if (!verification.verified) {
      return { success: false, error: "Authentication failed" };
    }

    // Update the counter in the database
    user.biometricKey.counter = verification.authenticationInfo.newCounter;
    await user.save();

    return { success: true, user }; // ✅ Return success with user data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification error",
    };
  }
};
