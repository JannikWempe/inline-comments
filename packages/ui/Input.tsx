import React, { forwardRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  labelText: string;
  name: string;
  placeholder?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(({ value, onChange, labelText, name, placeholder }, ref) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {labelText}
      </label>
      <div className="mt-1">
        <input
          ref={ref}
          type="text"
          name={name}
          id={name}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
});
