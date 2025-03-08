import bcrypt from "bcryptjs";
import base64url from "base64url";
import User from "../models/user.model";
import generateToken from "../utils/generateToken";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";

export const isoBase64URL = {
  encode: (buffer: Buffer) => base64url(buffer),
  decode: (base64urlString: string) =>
    Buffer.from(base64url.toBuffer(base64urlString)),
};

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
    token: generateToken(user._id),
  };
};

// **2. Generate Biometric Registration Options**
export const getRegistrationOptions = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const options = await generateRegistrationOptions({
    rpName: "E-Vote System",
    rpID: process.env.RP_ID || "localhost",
    userID: user.id,
    userName: user.email,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
    excludeCredentials: user.biometricKeys.map((key) => ({
      id: isoBase64URL.encode(Buffer.from(key.credentialId, "base64")), // ✅ Convert Buffer to Base64URL string
      type: "public-key",
    })),
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
  if (!user) throw new Error("User not found");

  const expectedChallenge = user.biometricChallenge;
  if (!expectedChallenge) throw new Error("Challenge not found");

  const verification = await verifyRegistrationResponse({
    response: credential.response, // ✅ Corrected: Pass response instead of credential
    expectedChallenge,
    expectedRPID: process.env.RP_ID || "localhost",
    expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
    requireUserVerification: true,
  });

  if (!verification.verified) throw new Error("Verification failed");

  const registrationInfo = verification.registrationInfo;
  if (!registrationInfo) throw new Error("Missing registration info"); // ✅ Ensure registrationInfo exists

  const { credential: registrationCredential, aaguid } = registrationInfo;
  if (!registrationCredential) throw new Error("Missing credential data");

  const credentialID = registrationCredential.id;
  const credentialPublicKey = registrationCredential.publicKey;
  const counter = registrationCredential.counter; // ✅ Corrected: Use signCount instead of counter
  const deviceId = aaguid || "unknown-device"; // ✅ Use aaguid as deviceId

  if (!credentialID || !credentialPublicKey)
    throw new Error("Invalid credential data");

  const normalizedCredentialId = isoBase64URL.encode(Buffer.from(credentialID));
  const encodedPublicKey = isoBase64URL.encode(
    Buffer.from(credentialPublicKey)
  );

  user.biometricKeys.push({
    credentialId: normalizedCredentialId,
    publicKey: encodedPublicKey,
    counter,
    deviceId, // ✅ Include deviceId
  });

  user.biometricRegistered = true;
  await user.save();
  user.biometricChallenge = undefined;
  await user.save();

  return { success: true, message: "Biometric registered successfully" };
};

// **4. Generate Biometric Authentication Options**
export const getAuthenticationOptions = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.biometricRegistered) throw new Error("User not found");

  const options = await generateAuthenticationOptions({
    // ✅ Await the function
    rpID: process.env.RP_ID || "localhost",
    allowCredentials: user.biometricKeys.map((key) => ({
      id: base64url.encode(Buffer.from(key.credentialId, "base64")), // ✅ Convert Buffer to Base64URL string
      transports: key.transports as AuthenticatorTransportFuture[], // ✅ Ensure correct type
    })),
    userVerification: "preferred",
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

  // Find the stored credential (biometric key) for this user
  const storedCredential = user.biometricKeys.find(
    (key) => key.credentialId === credential.id
  );

  if (!storedCredential) {
    return { success: false, error: "Credential not found" };
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: user.biometricChallenge ?? "",
      expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
      expectedRPID: process.env.RP_ID || "localhost",
      credential: {
        id: storedCredential.credentialId,
        publicKey: Buffer.from(storedCredential.publicKey, "base64"),
        counter: storedCredential.counter,
        transports:
          storedCredential.transports as AuthenticatorTransportFuture[],
      },
    });

    if (!verification.verified) {
      return { success: false, error: "Authentication failed" };
    }

    // Update the counter in the database
    storedCredential.counter = verification.authenticationInfo.newCounter;
    await user.save();

    return { success: true, user }; // ✅ Return success with user data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification error",
    };
  }
};
