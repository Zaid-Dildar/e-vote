"use client";

import { startRegistration } from "@simplewebauthn/browser";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import Image from "next/image";
import toast from "react-hot-toast";

export default function RegisterBiometrics() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUserStore();
  const userId = user?.id;

  const router = useRouter();

  const handleRegister = async () => {
    if (!userId) {
      toast.success("User ID is missing!");
      return;
    }

    setMessage("Fetching registration options...");
    setLoading(true);

    try {
      // Step 1: Get registration options from backend
      const optionsRes = await fetch("/api/auth/biometric/register-options", {
        method: "GET",
      });

      const options = await optionsRes.json();
      if (!optionsRes.ok) {
        throw new Error(options.message);
      }

      // Step 2: Start WebAuthn Registration
      const credential = await startRegistration({ optionsJSON: options });

      console.log("Credential received:", credential);

      // Step 3: Send the registration response to backend
      setMessage("Verifying registration...");

      const verifyRes = await fetch("/api/auth/biometric/register-verify", {
        method: "POST",
        body: JSON.stringify({
          userId,
          credential,
          deviceId: "user-device-id",
        }),
        headers: { "Content-Type": "application/json" },
      });

      const response = await verifyRes.json();

      if (!verifyRes.ok) throw new Error(response.message);

      toast.success("Biometric registration successful!");
      setUser({ ...user, biometricRegistered: true });
      router.replace("/user");
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setMessage("");
      setLoading(false); // Ensure loading resets after request
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 bg-gray-100 text-center">
      {/* Card Container */}
      <div className="w-full sm:w-[min(100%,600px)] py-14 m-4 p-4 md:p-10 bg-slate-600/90 shadow-drop-2-center rounded-3xl">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Register Your Biometrics
        </h1>

        {/* Warning Box */}
        <div className="bg-yellow-200 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-4">
          <p className="font-semibold">⚠️ Important: One-Time Registration!</p>
          <p className="text-sm mt-2">
            You can only register your biometrics once. Make sure you use the
            correct passkey manager so that you can log in from both your{" "}
            <strong>laptop and mobile</strong>.
          </p>
        </div>

        {/* Instruction Box */}
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-900 p-4 rounded-md mb-4">
          <p className="font-semibold">📌 Ensure Default Passkey Manager</p>
          <p className="text-sm mt-2">
            If you have <strong>multiple password managers</strong> (e.g.,
            Google Password Manager & Microsoft Authenticator), you must{" "}
            <strong>select the correct one before registering</strong>.
          </p>
          <p className="text-sm mt-2 text-left">
            ➤ Go to <strong>App Info</strong> of the other app.
            <br /> ➤ Navigate to <strong>Open by Default</strong>.
            <br /> ➤ Temporarily disable <strong>Open Supported Links</strong>.
            <br /> ➤ Register with the correct app, then{" "}
            <strong>toggle it back on</strong>.
          </p>
        </div>

        {/* Register Button with Icons */}
        <button
          type="button"
          disabled={loading}
          onClick={handleRegister}
          className={`overflow-hidden px-5 py-2.5 relative w-full md:w-fit transition-all ease-out duration-300 rounded group
            ${
              loading
                ? "cursor-not-allowed bg-gradient-to-r from-gray-900/70 to-gray-800/70 text-white ring-2 ring-offset-2 ring-gray-800"
                : "cursor-pointer bg-gray-900 hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white hover:ring-2 hover:ring-offset-2 hover:ring-gray-800"
            }`}
        >
          {/* Moving Shine Effect */}
          <span
            className={`absolute -top-10 w-10 h-30 bg-white opacity-10 rotate-6 
              ${
                loading
                  ? "animate-marquee" // Continuous movement when loading
                  : "translate-x-80 group-hover:-translate-x-80 transition-all duration-1000 ease"
              }
            `}
          />

          {/* Icons & Text */}
          <div className="flex justify-center items-center gap-4">
            <Image
              src="/assets/images/faceId.svg"
              alt="Face ID"
              width={34}
              height={30}
              className="invert"
            />
            <div className="h-6 w-0.5 bg-white"></div> {/* Border Divider */}
            <Image
              src="/assets/images/fingerprint.svg"
              alt="Fingerprint"
              width={34}
              height={30}
              className="invert"
            />
            {/* Button Text */}
            <span className="relative tracking-wider">
              {loading ? "Registering..." : "Register Biometrics"}
            </span>
          </div>
        </button>

        {/* Status Message */}
        {message && (
          <p className="mt-4 text-gray-100 bg-gray-700 p-3 rounded-md">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
