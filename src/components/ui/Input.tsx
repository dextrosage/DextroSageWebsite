import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-gray-300 tracking-[0.1em] uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-3.5 py-2.5 text-sm bg-black/40 text-white border ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-white/10 focus:ring-blue-500 focus:border-blue-500'
          } rounded-lg shadow-inner placeholder-gray-500 focus:outline-none focus:ring-1 focus:bg-black/60 transition-all backdrop-blur-sm ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
