"use client";

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700 ml-2">{label}</span>}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            {icon}
          </div>
        )}
        <input
          autoComplete="off"
          className={`input-standard ${icon ? 'pl-12' : 'px-6'} ${error ? 'ring-2 ring-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 ml-2 font-medium">{error}</span>}
    </div>
  );
};
