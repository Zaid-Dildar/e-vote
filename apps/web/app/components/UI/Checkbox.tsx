import { forwardRef } from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, onClick, className }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`
          w-5 h-5 border border-black rounded flex items-center justify-center 
          transition-all focus:outline-none focus:ring-2 focus:ring-blue-500
          ${checked ? "bg-blue-500 border-blue-500" : "bg-white"}
          ${className || ""}
        `}
      >
        {checked && <Check className="text-white w-4 h-4" />}
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox"; // Required for forwardRef
