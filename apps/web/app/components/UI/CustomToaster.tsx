"use client";

import toast, { Toaster, ToastBar } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <Toaster>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex flex-wrap items-center w-full gap-2">
              {/* Left side: Icon + Message */}
              <div className="relative max-w-[75%] flex items-center gap-2 ">
                <span>{icon}</span>
                <span className="break-words">{message}</span>
              </div>

              {/* Right side: Dismiss Button */}
              {t.type !== "loading" && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="group overflow-clip relative cursor-pointer bg-red-500 text-white px-2 py-1 rounded shadow hover:bg-red-600"
                >
                  <span className="absolute right-0 w-5 h-32 -mt-12 transition-all duration-1500 transhtmlForm translate-x-20 bg-white/20 opacity-10 rotate-12 group-hover:-translate-x-30 ease rounded"></span>
                  Dismiss
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
