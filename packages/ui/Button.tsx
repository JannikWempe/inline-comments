import React, { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type Props = {
  className?: string;
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantClasses: Record<Variant, string> = {
  primary: "text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:text-gray-200",
  secondary: "text-blue-700 bg-blue-100 hover:bg-blue-200",
};

export const Button = ({ children, className, variant = "primary", ...buttonProps }: Props) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
    >
      {children}
    </button>
  );
};
