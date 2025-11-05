
import React from 'react';

interface HeaderProps {
  onAnalyze: () => void;
  isLoading: boolean;
  hasEmails: boolean;
}

const AnalyzeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clipRule="evenodd" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ onAnalyze, isLoading, hasEmails }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
        スマート受信トレイ整理
      </h1>
      <button
        onClick={onAnalyze}
        disabled={isLoading || !hasEmails}
        className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-all duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {isLoading ? (
           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <AnalyzeIcon />
        )}
        {isLoading ? '分析中...' : '受信トレイを分析'}
      </button>
    </header>
  );
};
