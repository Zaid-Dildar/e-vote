"use client";

import { startRegistration } from "@simplewebauthn/browser";
import { useState } from "react";
import { useUserStore } from "../store/userStore";

export default function RegisterBiometrics() {
  const [message, setMessage] = useState("");
  const { user } = useUserStore();
  const userId = user?.id;

  const handleRegister = async () => {
    if (!userId) {
      setMessage("User ID is missing!");
      return;
    }

    setMessage("Fetching registration options...");

    try {
      // Step 1: Get registration options from backend
      const optionsRes = await fetch("/api/auth/biometric/register-options", {
        method: "GET",
      });

      if (!optionsRes.ok)
        throw new Error("Failed to fetch registration options");

      const options = await optionsRes.json();

      // Step 2: Start WebAuthn Registration
      const credential = await startRegistration({ optionsJSON: options });

      // Step 3: Send the registration response to backend
      setMessage("Verifying registration...");

      const verifyRes = await fetch("/api/auth/biometric/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          credential,
        }),
      });

      if (!verifyRes.ok) throw new Error("Failed to verify registration");

      setMessage("Biometric registration successful!");
    } catch (error) {
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
