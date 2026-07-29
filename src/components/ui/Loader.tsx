import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  light?: boolean;
  inline?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  light = false,
  inline = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div
      className={`rounded-full border-t-transparent animate-spin ${
        sizeClasses[size]
      } ${light ? 'border-white' : 'border-brand-500'}`}
      role="status"
    />
  );

  if (inline) {
    return (
      <div className="inline-flex items-center space-x-2">
        {spinner}
        {text && (
          <span className={`text-sm ${light ? 'text-white' : 'text-gray-500'}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {spinner}
      {text && (
        <span className={`mt-3 text-sm font-medium ${light ? 'text-white' : 'text-gray-500'}`}>
          {text}
        </span>
      )}
    </div>
  );
};
