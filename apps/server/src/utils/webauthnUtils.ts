import crypto from "crypto";
import cbor from "cbor"; // Install via: npm install cbor
import { Buffer } from "buffer";
import base64url from "base64url"; // Install via: npm install base64url

// Generate a random WebAuthn challenge (Base64URL-encoded)
export const generateChallenge = (): string =>
  crypto.randomBytes(32).toString("base64url");

/**
 * Convert a COSE key to a PEM format for use with Node's crypto
 *
 * WebAuthn uses COSE keys (RFC 8152), but Node.js crypto expects keys in PEM format
 * This function handles the conversion of P-256 EC public keys
 */
export const coseKeyToPEM = (publicKey: string): string => {
  try {
    // Decode the base64 key
    const keyBuffer = Buffer.from(publicKey, "base64");

    console.log("Public Key Buffer:", keyBuffer);
    console.log("Public Key Length:", keyBuffer.length);
    console.log("Public Key First Byte:", keyBuffer[0]);

    // Try to parse the key as COSE/CBOR
    try {
      const coseKey = cbor.decodeFirstSync(keyBuffer);

      // Ensure it's an EC2 key (type 2)
      if (coseKey.get(1) !== 2) {
        throw new Error("Unsupported key type: Only EC2 keys are supported");
      }

      // Ensure it's using the P-256 curve (curve 1)
      if (coseKey.get(-1) !== 1) {
        throw new Error("Unsupported curve: Only P-256 is supported");
      }

      // Extract x and y coordinates
      const xCoord = coseKey.get(-2);
      const yCoord = coseKey.get(-3);

      if (!xCoord || !yCoord) {
        throw new Error("Invalid COSE key: Missing x or y coordinate");
      }

      // Create uncompressed EC point format (0x04 + x + y)
      const uncompressedPoint = Buffer.concat([
        Buffer.from([0x04]), // Uncompressed point indicator
        Buffer.from(xCoord),
        Buffer.from(yCoord),
      ]);

      // ASN.1 SEQUENCE for SPKI with P-256 OID
      const spkiHeader = Buffer.from([
        // SEQUENCE
        0x30, 0x59,
        // SEQUENCE (Algorithm)
        0x30, 0x13,
        // OID (ecPublicKey)
        0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
        // OID (prime256v1/P-256)
        0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07,
        // BIT STRING header
        0x03, 0x42, 0x00,
      ]);

      // Combine the header and point to create the DER-encoded key
      const derKey = Buffer.concat([spkiHeader, uncompressedPoint]);

      // Convert to PEM format
      const pemKey = `-----BEGIN PUBLIC KEY-----\n${derKey.toString("base64")}\n-----END PUBLIC KEY-----`;

      return pemKey;
    } catch (coseError) {
      console.warn("Key is not in COSE format, trying raw format...");

      // If the key is not in COSE format, assume it's a raw public key
      // For raw keys, we assume it's already in uncompressed format (0x04 + x + y)
      if (keyBuffer.length === 65 && keyBuffer[0] === 0x04) {
        const uncompressedPoint = keyBuffer;

        // ASN.1 SEQUENCE for SPKI with P-256 OID
        const spkiHeader = Buffer.from([
          // SEQUENCE
          0x30, 0x59,
          // SEQUENCE (Algorithm)
          0x30, 0x13,
          // OID (ecPublicKey)
          0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
          // OID (prime256v1/P-256)
          0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07,
          // BIT STRING header
          0x03, 0x42, 0x00,
        ]);

        // Combine the header and point to create the DER-encoded key
        const derKey = Buffer.concat([spkiHeader, uncompressedPoint]);

        // Convert to PEM format
        const pemKey = `-----BEGIN PUBLIC KEY-----\n${derKey.toString("base64")}\n-----END PUBLIC KEY-----`;

        return pemKey;
      } else {
        throw new Error(
          "Unsupported key format: Key is neither COSE nor raw uncompressed EC key"
        );
      }
    }
  } catch (error) {
    console.error("Error converting key to PEM:", error);
    throw error;
  }
};

/**
 * Verifies the signed WebAuthn challenge
 */
export const verifySignature = async (
  authenticatorDataBase64: string,
  signatureBase64: string,
  challengeBase64: string,
  storedPublicKey: string
): Promise<boolean> => {
  try {
    console.log("Stored Public Key (Base64):", storedPublicKey);
    console.log("Authenticator Data (Base64):", authenticatorDataBase64);
    console.log("Signature (Base64):", signatureBase64);
    console.log("Challenge (Base64):", challengeBase64);

    // Decode all inputs
    const authenticatorData = Buffer.from(authenticatorDataBase64, "base64");
    const signature = Buffer.from(signatureBase64, "base64");

    // Ensure challenge is properly decoded from base64url format
    let challengeBuffer;
    try {
      // Try to decode as base64url first
      challengeBuffer = base64url.toBuffer(challengeBase64.replace(/=/g, ""));
    } catch (e) {
      // Fallback to standard base64
      challengeBuffer = Buffer.from(challengeBase64, "base64");
    }

    // Create the client data hash that's part of the verification
    const clientDataHash = crypto
      .createHash("sha256")
      .update(challengeBuffer)
      .digest();

    // The message that was signed is the concatenation of authenticatorData and clientDataHash
    const verificationData = Buffer.concat([authenticatorData, clientDataHash]);

    // Convert the stored public key to PEM format
    const publicKeyPEM = `-----BEGIN PUBLIC KEY-----\n${storedPublicKey}\n-----END PUBLIC KEY-----`;

    console.log("Constructed PEM:", publicKeyPEM);

    // Create a public key object from PEM
    const publicKey = crypto.createPublicKey(publicKeyPEM);

    // Verify the signature
    const verify = crypto.createVerify("sha256");
    verify.update(verificationData);
    verify.end();

    const isValid = verify.verify(publicKey, signature);

    console.log("Signature verification result:", isValid);

    return isValid;
  } catch (error) {
    console.error("❌ Signature verification error:", error);
    return false;
  }
};
