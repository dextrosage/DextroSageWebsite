import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#020617]/60 backdrop-blur-md border border-white/10 rounded-xl shadow-sm ${
        hoverable ? 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/50 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`px-5 py-4 border-b border-white/5 bg-black/20 rounded-t-xl ${className}`}>{children}</div>;
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`px-5 py-4 bg-black/40 border-t border-white/5 rounded-b-xl ${className}`}>{children}</div>;
};
