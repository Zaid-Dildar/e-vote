import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  biometricRegistered: boolean;
  token: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        // Store biometricRegistered in cookies for middleware to access
        Cookies.set("biometricRegistered", String(user.biometricRegistered), {
          path: "/",
        });
        Cookies.set("token", user.token, { path: "/" });
        Cookies.set("role", user.role, { path: "/" });
        set({ user });
      },
      clearUser: () => {
        Cookies.remove("biometricRegistered");
        Cookies.remove("token");
        Cookies.remove("role");
        set({ user: null });
      },
    }),
    { name: "user-storage" } // Persist data in localStorage
  )
);
