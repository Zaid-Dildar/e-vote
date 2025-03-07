"use client";

import { useState } from "react";
import { useUserStore } from "../store/userStore";

export default function RegisterBiometrics() {
  const [message, setMessage] = useState("");
  const { user } = useUserStore();
  const userId = user?.id;

  // Helper function: Decode Base64URL (Fix for atob error)
  const decodeBase64URL = (input: string): Uint8Array => {
    const base64 =
      input.replace(/-/g, "+").replace(/_/g, "/") +
      "==".slice((input.length + 3) % 4);
    const raw = atob(base64);
    return new Uint8Array([...raw].map((c) => c.charCodeAt(0)));
  };

  const handleRegister = async () => {
    if (!userId) {
      setMessage("User ID is missing!");
      return;
    }

    // ✅ Check if WebAuthn is supported
    if (!navigator.credentials?.create) {
      setMessage("WebAuthn is not supported on this browser.");
      return;
    }

    setMessage("Requesting biometric challenge...");

    try {
      // Step 1: Request a challenge from Next.js API route
      const challengeRes = await fetch("/api/auth/biometric/challenge", {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!challengeRes.ok) throw new Error("Failed to get challenge");

      const { challenge } = await challengeRes.json();
      console.log("Challenge received:", challenge);

      // Convert challenge to Uint8Array (Base64URL decoding fix)
      const challengeBuffer = decodeBase64URL(challenge);

      // Convert userId to Uint8Array
      const encoder = new TextEncoder();
      const userIdBuffer = encoder.encode(userId);

      // Step 2: Create WebAuthn credentials
      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge: challengeBuffer,
          rp: { name: "E-Vote" },
          user: {
            id: userIdBuffer,
            name: user.email,
            displayName: user.name,
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256 (Elliptic Curve)
            { type: "public-key", alg: -257 }, // RS256 (RSA)
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Forces built-in device authenticator
            residentKey: "required", // Ensures key is stored on device
            requireResidentKey: true, // Forces biometrics or stored passkey
            userVerification: "required", // Ensures Face ID / Fingerprint
          },
          timeout: 60000,
        },
      })) as PublicKeyCredential | null;

      if (!credential) throw new Error("Biometric registration failed");

      console.log("Credential received:", credential);

      // Extract credential details
      const credentialData = {
        credentialId: credential.id,
        publicKey: btoa(
          String.fromCharCode(...new Uint8Array(credential.rawId))
        ),
        deviceId: "web-device",
      };

      // Step 3: Send credential data to Next.js API route
      setMessage("Registering biometrics...");

      const res = await fetch("/api/auth/biometric/register", {
        method: "POST",
        body: JSON.stringify({ userId, ...credentialData }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to register biometrics");

      setMessage("Biometric registration successful!");
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Register Biometrics</h1>
      <button
        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md mb-2"
        onClick={handleRegister}
      >
        Register Biometrics (Face ID / Fingerprint)
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}
