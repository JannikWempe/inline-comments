import React from "react";

type Variant = "primary" | "secondary";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: Variant;
};

const variantClasses: Record<Variant, string> = {
  primary: "text-white bg-blue-600 hover:bg-blue-700",
  secondary: "text-blue-700 bg-blue-100 hover:bg-blue-200",
};

export const Button = ({ children, onClick, className, variant = "primary" }: Props) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
