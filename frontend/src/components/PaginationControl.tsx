"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationControlProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  lastPage,
  onPageChange,
  className
}) => {
  if (lastPage <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(lastPage, start + maxVisible - 1);

    if (end === lastPage) {
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={cn(
                    "w-10 h-10 rounded-xl text-[10px] font-black tracking-widest transition-all",
                    currentPage === i 
                        ? "bg-black text-white shadow-xl shadow-black/20" 
                        : "bg-white text-gray-400 hover:text-black border border-gray-100"
                )}
            >
                {i}
            </button>
        );
    }
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 py-8", className)}>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {renderPageNumbers()}

      {lastPage > 5 && currentPage < lastPage - 2 && (
          <div className="flex items-center justify-center w-10">
              <MoreHorizontal className="w-4 h-4 text-gray-200" />
          </div>
      )}

      <button
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
