import React from "react";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
};

export const Button = ({ children, onClick, className }: Props) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
