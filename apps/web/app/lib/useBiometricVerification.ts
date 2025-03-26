import { startAuthentication } from "@simplewebauthn/browser";
import toast from "react-hot-toast";

export const useBiometricVerification = () => {
  const verifyBiometrics = async (userId: string) => {
    try {
      if (!userId) {
        toast.error("User ID is required for biometric verification");
        return false;
      }

      // Step 1: Request authentication options
      const challengeRes = await fetch(
        "/api/auth/biometric/authenticate-options",
        { method: "GET" }
      );

      if (!challengeRes.ok) {
        toast.error("Failed to get biometric challenge");
        return false;
      }

      const options = await challengeRes.json();

      // Step 2: Start WebAuthn authentication
      const authenticationResponse = await startAuthentication({
        optionsJSON: options,
      });

      // Step 3: Send authentication response to the backend for verification
      const verifyRes = await fetch("/api/auth/biometric/authenticate-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          credential: authenticationResponse,
        }),
      });

      if (!verifyRes.ok) {
        toast.error("Biometric verification failed");
        return false;
      }

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        toast.success("Biometric verification successful");
        return true;
      } else {
        toast.error("Biometric verification failed");
        return false;
      }
    } catch (error) {
      console.error("Biometric verification error:", error);
      toast.error("Error during biometric verification");
      return false;
    }
  };

  return { verifyBiometrics };
};
