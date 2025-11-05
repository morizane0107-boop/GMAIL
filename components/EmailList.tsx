
import React from 'react';
import type { Email } from '../types';
import { EmailItem } from './EmailItem';

interface EmailListProps {
  emails: Email[];
  selectedIds: Set<number>;
  suggestedIds: Set<number>;
  onToggleSelect: (id: number) => void;
  analysisComplete: boolean;
}

export const EmailList: React.FC<EmailListProps> = ({ emails, selectedIds, suggestedIds, onToggleSelect, analysisComplete }) => {
  if (emails.length === 0) {
    return (
        <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">受信トレイは空です</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">すべてのメールが整理されました！</p>
        </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden divide-y divide-slate-200 dark:divide-slate-700">
      {emails.map(email => (
        <EmailItem
          key={email.id}
          email={email}
          isSelected={selectedIds.has(email.id)}
          onToggleSelect={onToggleSelect}
          isSuggested={analysisComplete && suggestedIds.has(email.id)}
        />
      ))}
    </div>
  );
};
