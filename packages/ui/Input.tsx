import React, { Dispatch, forwardRef, InputHTMLAttributes, SetStateAction } from "react";

type Props = {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  labelText: string;
  name: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, labelText, name, className, ...inputProps }, ref) => {
    return (
      <div className={className}>
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {labelText}
        </label>
        <div className="mt-1">
          <input
            ref={ref}
            type="text"
            name={name}
            id={name}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...inputProps}
          />
        </div>
      </div>
    );
  }
);
