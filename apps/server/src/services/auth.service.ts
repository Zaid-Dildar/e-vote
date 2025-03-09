import bcrypt from "bcryptjs";
import User from "../models/user.model";
import generateToken from "../utils/generateToken";
import jwt from "jsonwebtoken"; // Install with `npm install jsonwebtoken`
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import { isoBase64URL } from "@simplewebauthn/server/helpers";

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
// FIDO Metadata Service (MDS) URL
const FIDO_METADATA_URL = "https://mds.fidoalliance.org/";

// Cache for FIDO metadata
let fidoMetadata: any = null;

// Fetch FIDO metadata using the fetch API
const fetchFidoMetadata = async () => {
  if (!fidoMetadata) {
    const response = await fetch(FIDO_METADATA_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch FIDO metadata");
    }

    // The response is a JWT token, not JSON
    const jwtToken = await response.text();

    // Decode the JWT token to get the metadata
    const decodedToken = jwt.decode(jwtToken, { complete: true });
    if (!decodedToken || !decodedToken.payload) {
      throw new Error("Failed to decode FIDO metadata JWT");
    }

    // Extract the metadata from the JWT payload
    fidoMetadata = decodedToken.payload;
  }

  return fidoMetadata;
};

// Check if the authenticator supports biometrics
const isBiometricAuthenticator = (aaguid: string, metadata: any) => {
  if (!metadata.entries || !Array.isArray(metadata.entries)) {
    throw new Error("Invalid FIDO metadata format");
  }

  // Find the authenticator by AAGUID
  const authenticator = metadata.entries.find(
    (entry: any) => entry.aaguid === aaguid
  );
  if (!authenticator) return false;

  // Check if the authenticator supports fingerprint or Face ID
  return authenticator.metadataStatement.userVerificationDetails.some(
    (detail: any) =>
      detail.userVerificationMethod === "fingerprint_internal" ||
      detail.userVerificationMethod === "face_internal"
  );
};

export const verifyBiometricRegistration = async (
  userId: string,
  credential: any
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const expectedChallenge = user.biometricChallenge;
  if (!expectedChallenge) throw new Error("Challenge not found");

  const verification = await verifyRegistrationResponse({
    response: credential, // Ensure this contains `.id`, `.rawId`, and `.response`
    expectedChallenge,
    expectedRPID: process.env.RP_ID || "localhost",
    expectedOrigin: process.env.ORIGIN || "http://localhost:3000",
    requireUserVerification: true,
  });

  if (!verification.verified) throw new Error("Verification failed");

  const registrationInfo = verification.registrationInfo;
  if (!registrationInfo) throw new Error("Missing registration info");

  const { credential: registrationCredential, aaguid } = registrationInfo;
  if (!registrationCredential) throw new Error("Missing credential data");

  // Fetch FIDO metadata
  const metadata = await fetchFidoMetadata();

  // Check if the authenticator supports biometrics
  if (!isBiometricAuthenticator(aaguid, metadata)) {
    throw new Error("Biometric authentication is required");
  }

  // Store the biometric key
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
