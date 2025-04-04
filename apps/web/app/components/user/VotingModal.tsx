import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../../store/userStore";
import { useBiometricVerification } from "@lib/useBiometricVerification";
import Image from "next/image";
import toast from "react-hot-toast";
import { Fingerprint, KeyRound, UserCheck } from "lucide-react";
import bcrypt from "bcryptjs";

interface Candidate {
  _id: string;
  name: string;
  picture: string;
}

export default function VotingModal({
  electionId,
  isOpen,
  onClose,
  candidates,
  onVoteSuccess,
}: {
  electionId: string;
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onVoteSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const { user } = useUserStore();
  const { verifyBiometrics } = useBiometricVerification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [verified, setVerified] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal container

  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // Close the modal if clicked outside
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNext = async () => {
    if (step === 1 && selectedCandidate === null) {
      toast.error("Please select a candidate before proceeding.");
      return;
    }
    if (step === 2 && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (step === 2) {
      const isCorrect = await bcrypt.compare(password, user?.password ?? "");
      if (!isCorrect) {
        toast.error("Incorrect Current Password");
        return;
      }
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      handleVoteSubmission();
    }
  };

  const handleVoteSubmission = async () => {
    if (!verified) {
      toast.error("Biometric Verification is required!");
      return;
    }
    try {
      if (selectedCandidate === null) {
        toast.error("No candidate selected!");
        return;
      }

      const response = await fetch("/api/user/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          election: electionId,
          user: user?.id, // Replace with actual user ID
          candidate: candidates[selectedCandidate]?._id, // Ensure candidate ID is sent
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit vote");
      }

      toast.success("Vote successfully submitted!");
      onVoteSuccess();
      onClose(); // Close the modal after voting
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      console.error("Vote submission error:", error);
    }
  };

  const handleBiometricVerification = async () => {
    if (!user) return;
    const verified = await verifyBiometrics(user.id);
    setVerified(verified);
  };

  const steps = [
    { label: "Candidate Selection", icon: <UserCheck className="h-6 w-6" /> },
    { label: "Password Verification", icon: <KeyRound className="h-6 w-6" /> },
    {
      label: "Biometric Verification",
      icon: <Fingerprint className="h-6 w-6" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-60 bg-black/70 bg-opacity-50 flex items-center justify-center p-4">
      <div
        ref={modalRef} // Attach the ref to the modal container
        className="bg-white rounded-lg w-full max-w-md md:max-w-xl lg:max-w-3xl max-h-[95%] overflow-auto p-4"
      >
        {/* Stepper */}
        <div className="flex w-[90%] mx-auto mb-12 items-center justify-between">
          {steps.map((item, index) => (
            <div
              key={index}
              className={`group flex items-center ${
                index < steps.length - 1 ? "justify-between w-full" : ""
              }`}
            >
              {/* Step Icon */}
              <div className="relative">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full 
                ${
                  step > index + 1
                    ? "bg-[#112B4F] text-white" // Completed step
                    : step === index + 1
                      ? "bg-gray-800 text-white" // Active step
                      : "bg-gray-300"
                }`}
                >
                  {item.icon}
                </span>
                <span className="absolute -bottom-13 left-1/2 -translate-x-1/2 text-md text-center font-semibold text-gray-900">
                  {item.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    step > index + 1 ? "bg-[#112B4F]" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Candidate Selection */}
        {step === 1 && (
          <div className="text-center p-8">
            <h2 className="text-lg font-bold mb-4">
              Click on Candidate’s Picture to Vote
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer flex flex-col justify-center items-center"
                  onClick={() => setSelectedCandidate(index)}
                >
                  <Image
                    src={candidate.picture}
                    alt={candidate.name}
                    width={150}
                    height={150}
                    className="rounded-md"
                  />
                  {selectedCandidate === index && (
                    <div className="absolute top-0 flex items-center justify-center border rounded-md">
                      <Image
                        src="/assets/images/voted.svg"
                        alt="Voted"
                        width={150}
                        height={150}
                      />
                    </div>
                  )}
                  <p className="font-bold">{candidate.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Password Verification */}
        {step === 2 && selectedCandidate !== null && (
          <div className="text-center p-8">
            <h2 className="text-lg font-bold mb-4">
              Enter your password twice to proceed
            </h2>
            <div className="flex justify-center items-center gap-6">
              <div className="relative text-center">
                <Image
                  src={candidates[selectedCandidate]?.picture ?? ""}
                  alt="Selected Candidate"
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div className="absolute top-0 flex items-center justify-center rounded-md border">
                  <Image
                    src="/assets/images/voted.svg"
                    alt="Voted"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="font-bold">
                  {candidates[selectedCandidate]?.name}
                </p>
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border p-2 rounded w-full mt-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Biometric Verification */}
        {step === 3 && selectedCandidate !== null && (
          <div className="text-center p-8">
            <h2 className="text-lg font-bold mb-4">
              Verify using Fingerprint or Face ID
            </h2>
            <div className="flex justify-center items-center gap-6">
              <div className="relative text-center">
                <Image
                  src={candidates[selectedCandidate]?.picture ?? ""}
                  alt="Selected Candidate"
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div className="absolute top-0 flex items-center justify-center rounded-md border">
                  <Image
                    src="/assets/images/voted.svg"
                    alt="Voted"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="font-bold">
                  {candidates[selectedCandidate]?.name}
                </p>
              </div>
              <button
                className="px-4 py-2 bg-[#112B4F] hover:bg-[#0E223A] text-white rounded-lg cursor-pointer group relative overflow-hidden shadow-md"
                onClick={handleBiometricVerification}
              >
                <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-5 h-30 bg-white opacity-10 rotate-6 translate-x-30 group-hover:-translate-x-20 transition-all duration-1000 ease" />
                Authenticate
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer group relative overflow-hidden shadow-md w-full"
            onClick={onClose}
          >
            <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-60 group-hover:-translate-x-50 transition-all duration-1000 ease" />
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-[#112B4F] text-white rounded-md group relative overflow-hidden shadow-md w-full ${
              step === 1 && selectedCandidate === null
                ? "bg-gray-300 cursor-not-allowed"
                : "cursor-pointer bg-[#112B4F] hover:bg-[#0E223A]"
            }`}
            disabled={step === 1 && selectedCandidate === null}
            onClick={handleNext}
          >
            <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-60 group-hover:-translate-x-50 transition-all duration-1000 ease" />
            {step < 3 ? "Next" : "Submit Vote"}
          </button>
        </div>
      </div>
    </div>
  );
}
