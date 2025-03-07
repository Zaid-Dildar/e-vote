import crypto from "crypto";

// Generate a random WebAuthn challenge (Base64URL-encoded)
export const generateChallenge = (): string => {
  return crypto.randomBytes(32).toString("base64url");
};

// Verify the signed WebAuthn challenge
export const verifySignature = async (
  publicKey: string,
  challenge: string,
  signedChallenge: string
): Promise<boolean> => {
  try {
    const { importSPKI, compactVerify } = await import("jose");

    const key = await importSPKI(publicKey, "ES256");

    // Verify the signature
    const { payload } = await compactVerify(signedChallenge, key);

    // Convert payload (Uint8Array) to a string
    const decodedChallenge = new TextDecoder().decode(payload);

    // Ensure the challenge matches
    if (decodedChallenge !== challenge) {
      throw new Error("Challenge mismatch");
    }

    return true;
  } catch (error) {
    console.error("WebAuthn verification error:", error);
    return false;
  }
};
