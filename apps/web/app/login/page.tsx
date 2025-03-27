"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import { useBiometricVerification } from "../lib/useBiometricVerification";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();
  const router = useRouter();
  const { verifyBiometrics } = useBiometricVerification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Missing required fields!");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Perform standard login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed!");
      }

      // Store user details in state
      setUser(data.user);

      // Step 2: If biometrics are registered, perform biometric verification
      if (data.user.biometricRegistered) {
        // const biometricSuccess = await verifyBiometrics(data.user.id);
        const biometricSuccess = true;

        if (biometricSuccess) {
          window.location.href = "/";
        }
      } else {
        router.push("/register-biometrics"); // Redirect to biometric registration
        toast.success("Login successful!");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/AboutBackground.jpeg')" }}
    >
      <Link
        href="/"
        className="absolute top-6 left-6 w-12 h-12 cursor-pointer flex rounded-full overflow-hidden shadow-2xl bg-gray-900 group hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-800 text-white transition-all ease-out duration-300"
      >
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-15 bg-white opacity-10 rotate-12 group-hover:-translate-x-15 ease rounded"></span>
        <span className="relative w-12 h-12 transition">
          <Image
            src="/assets/images/BackButton.svg"
            alt="Play"
            fill
            className="invert border-2"
          />
        </span>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-sm md:min-w-sm py-14 m-4 p-10 bg-slate-600/90 shadow-drop-2-center rounded-3xl"
      >
        <div className="text-base leading-6 space-y-8 text-gray-700 sm:text-lg sm:leading-7">
          <div className="mb-4">
            <Image
              className="m-auto"
              src="/assets/images/Logo.svg"
              alt="Fingerprint Icon"
              priority
              width={50}
              height={74}
            />
          </div>
          <div className="relative">
            <input
              id="login"
              name="login"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer bg-transparent placeholder-transparent caret-white rounded h-10 w-full border-b-2 border-slate-400 transition-colors focus:border-b-2 focus:border-slate-100  text-white focus:outline-none focus:borer-rose-600"
              placeholder="Username"
            />
            <label
              htmlFor="login"
              className="absolute left-0 -top-5 text-slate-300 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-white peer-focus:text-sm"
            >
              Username
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer bg-transparent caret-white rounded placeholder-transparent h-10 w-full border-b-2 border-slate-400 transition-colors focus:border-b-2 focus:border-slate-100  text-white focus:outline-none focus:borer-rose-600"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-0 -top-5 text-slate-300 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-5 peer-focus:text-white peer-focus:text-sm"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <button
              type="submit"
              disabled={loading}
              className={`overflow-hidden px-5 py-2.5 relative transition-all ease-out duration-300 rounded w-full group
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

              {/* Button Text */}
              <span className="relative tracking-wider">
                {loading ? "Logging in..." : "Login"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
