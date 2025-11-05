
import React from 'react';
import type { Email } from '../types';

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  isSuggested: boolean;
}

export const EmailItem: React.FC<EmailItemProps> = ({ email, isSelected, onToggleSelect, isSuggested }) => {
  const { id, sender, subject, snippet } = email;

  return (
    <div
      className={`
        flex items-start p-4 border-l-4 transition-all duration-200 cursor-pointer
        ${isSelected ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500' : 'bg-white dark:bg-slate-800 border-transparent'}
        ${isSuggested && !isSelected ? 'border-amber-400' : ''}
      `}
      onClick={() => onToggleSelect(id)}
    >
      <div className="flex items-center h-full mr-4 mt-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(id)}
          className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          onClick={(e) => e.stopPropagation()} // Prevent double-triggering onClick
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{sender}</p>
        </div>
        <p className="font-semibold text-slate-900 dark:text-white truncate">{subject}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{snippet}</p>
      </div>
    </div>
  );
};
