"use client";

import { useState } from "react";

export default function RegisterBiometrics() {
  const [message, setMessage] = useState("");

  const handleFingerprint = async () => {
    setMessage("Fingerprint registration not implemented yet.");
    // TODO: Implement fingerprint registration logic
  };

  const handleFaceId = async () => {
    setMessage("Face ID registration not implemented yet.");
    // TODO: Implement Face ID registration logic
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Register Biometrics</h1>
      <button
        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md mb-2"
        onClick={handleFingerprint}
      >
        Register Fingerprint
      </button>
      <button
        className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-md"
        onClick={handleFaceId}
      >
        Register Face ID
      </button>
      {message && <p className="mt-4 text-gray-700">{message}</p>}
    </div>
  );
}
