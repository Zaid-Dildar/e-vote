import { Buffer } from "buffer";
import crypto from "crypto";

/**
 * Converts a raw P-256 public key (from WebAuthn) into a valid SPKI PEM format.
 */
function convertRawToPEM(base64PublicKey: string): string {
  const rawKey = Buffer.from(base64PublicKey, "base64");

  if (rawKey.length !== 65 || rawKey[0] !== 0x04) {
    throw new Error("Invalid P-256 public key format.");
  }

  // ASN.1 structure for SPKI with EC public key and P-256 OID
  const spkiPrefix = Buffer.from([
    0x30,
    0x59, // SEQUENCE (89 bytes total)
    0x30,
    0x13, // SEQUENCE (19 bytes)
    0x06,
    0x07,
    0x2a,
    0x86,
    0x48,
    0xce,
    0x3d,
    0x02,
    0x01, // OID 1.2.840.10045.2.1 (EC Public Key)
    0x06,
    0x08,
    0x2a,
    0x86,
    0x48,
    0xce,
    0x3d,
    0x03,
    0x01,
    0x07, // OID 1.2.840.10045.3.1.7 (P-256)
    0x03,
    0x42,
    0x00, // BIT STRING (66 bytes: 0x00 + 65-byte key)
  ]);

  // Full SPKI format
  const spkiKey = Buffer.concat([spkiPrefix, rawKey]);

  // Encode in PEM format
  const pem = `-----BEGIN PUBLIC KEY-----\n${spkiKey
    .toString("base64")
    .match(/.{1,64}/g)
    ?.join("\n")}\n-----END PUBLIC KEY-----`;

  return pem;
}

/**
 * Verifies the WebAuthn signature using the public key.
 */
function verifySignature(
  base64PublicKey: string,
  base64Signature: string,
  base64AuthenticatorData: string,
  base64Challenge: string
) {
  try {
    // Convert to PEM format
    const pemPublicKey = convertRawToPEM(base64PublicKey);
    console.log("Generated PEM Public Key:\n", pemPublicKey);

    // Load public key
    const publicKey = crypto.createPublicKey(pemPublicKey);

    // Convert inputs to buffers
    const signature = Buffer.from(base64Signature, "base64");
    const authenticatorData = Buffer.from(base64AuthenticatorData, "base64");
    const challenge = Buffer.from(base64Challenge, "base64");

    // Construct the data that was signed
    const signedData = Buffer.concat([
      authenticatorData,
      crypto.createHash("sha256").update(challenge).digest(),
    ]);

    // Verify signature
    const isValid = crypto.verify("sha256", signedData, publicKey, signature);

    console.log(isValid ? "✅ Signature is valid!" : "❌ Invalid signature.");
    return isValid;
  } catch (error) {
    // Explicitly type the error as an Error object
    if (error instanceof Error) {
      console.error("❌ Signature verification failed:", error.message);
    } else {
      console.error("❌ An unknown error occurred.");
    }
    return false;
  }
}

// Example data (replace with actual values)
const base64PublicKey =
  "ZaNDzlNdos/7jBFrA+dcTheH4xaeJ2ZQu3czrr0zIlggG9EsQ1spcWuKfbjM7GEn32EGokwleU4hpBqivoh8NGE=";
const base64Signature =
  "MEUCIENCDlYqiU05CWg_1-lpoQ0qf7c_NIr0ghtde2elyS_OAiEA_B-onVLfz6DB-6xTl63P75yK4eAkFZMmt-02aefM0oc";
const base64AuthenticatorData =
  "SZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2MFAAAABQ";
const base64Challenge = "YqQRkH9+BsZsZc6pGlr/YVREUJheOIjYSOTvT+cW3Hc";

// Run signature verification
verifySignature(
  base64PublicKey,
  base64Signature,
  base64AuthenticatorData,
  base64Challenge
);
