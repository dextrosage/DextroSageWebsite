import React from 'react';
import { Loader } from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-400 text-[#0f172a] focus:ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] uppercase tracking-widest font-bold',
    secondary: 'bg-white/10 hover:bg-white/20 text-white focus:ring-gray-300 backdrop-blur-md',
    danger: 'bg-red-500/80 hover:bg-red-500 text-white focus:ring-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] backdrop-blur-md',
    outline: 'border border-white/10 bg-white/5 hover:bg-white/10 text-white focus:ring-blue-500 hover:border-blue-500/50 shadow-sm backdrop-blur-md',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <Loader size="sm" light={variant === 'primary' || variant === 'danger'} inline />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
