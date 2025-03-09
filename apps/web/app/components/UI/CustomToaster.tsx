"use client";

import toast, { Toaster, ToastBar } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <Toaster>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== "loading" && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="cursor-pointer min-w-fit relative bg-red-500 overflow-hidden text-white px-2 py-1 shadow-2xl rounded group hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transhtmlForm translate-x-20 bg-black/50 opacity-10 rotate-12 group-hover:-translate-x-20 ease rounded"></span>
                  <span className="float-end ">Dismiss</span>
                </button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
