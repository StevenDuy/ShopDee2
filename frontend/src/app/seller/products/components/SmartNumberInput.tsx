"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SmartNumberInputProps {
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  className?: string; // Container class
  inputClassName?: string; // Input specific class
  prefix?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const SmartNumberInput: React.FC<SmartNumberInputProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className,
  inputClassName,
  prefix,
  icon,
  disabled
}) => {
  // Format number to string with dots (e.g. 1000 -> "1.000")
  const formatValue = (num: number): string => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Convert string with dots back to number
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, ""); // Remove all dots
    const numericValue = parseInt(rawValue, 10);
    
    if (isNaN(numericValue)) {
      onChange(0);
    } else {
      onChange(numericValue);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">
          {prefix}
        </span>
      )}
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input 
        type="text" 
        disabled={disabled}
        value={formatValue(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full bg-gray-100 border-none rounded-xl py-4 md:py-3 text-sm md:text-xs font-black placeholder:text-gray-300 focus:ring-1 focus:ring-black outline-none transition-all disabled:opacity-50",
          prefix ? "pl-8 pr-4" : (icon ? "pl-11 pr-4" : "px-4"),
          inputClassName
        )}
      />
    </div>
  );
};
