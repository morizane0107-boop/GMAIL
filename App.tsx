import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { EmailList } from './components/EmailList';
import { analyzeEmails } from './services/geminiService';
import { INBOX_DATASETS } from './constants';
import type { Email, InboxType } from './types';

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

function App() {
  const [inboxType, setInboxType] = useState<InboxType>('personal');
  const [emails, setEmails] = useState<Email[]>(INBOX_DATASETS[inboxType]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [suggestedIds, setSuggestedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('AIアシスタントで受信トレイを整理しましょう。');
  const [filterKeywords, setFilterKeywords] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setAnalysisComplete(false);
    setStatusMessage('Gemini AIがメールを分析中です...');
    const clutterIds = await analyzeEmails(emails, filterKeywords, selectedModel);
    const newSelectedIds = new Set(clutterIds);
    setSelectedIds(newSelectedIds);
    setSuggestedIds(newSelectedIds);
    setIsLoading(false);
    setAnalysisComplete(true);
    setStatusMessage(clutterIds.length > 0 ? `${clutterIds.length}件の不要なメールが検出されました。確認して削除してください。` : '不要なメールは見つかりませんでした。');
  }, [emails, filterKeywords, selectedModel]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMoveToTrash = () => {
    const remainingEmails = emails.filter(email => !selectedIds.has(email.id));
    const deletedCount = emails.length - remainingEmails.length;
    setEmails(remainingEmails);
    setSelectedIds(new Set());
    setSuggestedIds(new Set());
    setAnalysisComplete(false);
    setStatusMessage(`${deletedCount}件のメールをゴミ箱に移動しました。`);
  };

  const handleInboxChange = (newInboxType: InboxType) => {
    setInboxType(newInboxType);
    setEmails(INBOX_DATASETS[newInboxType]);
    setSelectedIds(new Set());
    setSuggestedIds(new Set());
    setAnalysisComplete(false);
    setFilterKeywords('');
    setStatusMessage('AIアシスタントで受信トレイを整理しましょう。');
  };

  return (
    <div className="min-h-screen">
      <Header onAnalyze={handleAnalyze} isLoading={isLoading} hasEmails={emails.length > 0} />
      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow-md mb-6 border border-slate-200 dark:border-slate-700">
          <p className="text-center text-sm text-slate-600 dark:text-slate-300 font-medium">
            {statusMessage}
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="inbox-type-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                受信トレイの種類
              </label>
              <select
                id="inbox-type-select"
                value={inboxType}
                onChange={(e) => handleInboxChange(e.target.value as InboxType)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="personal">個人</option>
                <option value="work">仕事</option>
                <option value="shopping">ショッピング</option>
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                分析するメールの種類を選択します。
              </p>
            </div>
            <div>
              <label htmlFor="filter-keywords" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                フィルターキーワード
              </label>
              <input
                type="text"
                id="filter-keywords"
                value={filterKeywords}
                onChange={(e) => setFilterKeywords(e.target.value)}
                placeholder="例: セール, 限定オファー"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                (オプション) カンマ区切りで入力。
              </p>
            </div>
            <div>
               <label htmlFor="model-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                AIモデル
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (高速)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (高精度)</option>
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                分析に使用するモデルを選択します。
              </p>
            </div>
          </div>
        </div>

        {analysisComplete && emails.length > 0 && (
          <div className="mb-2 flex items-center justify-end text-xs text-slate-500 dark:text-slate-400">
            <span className="w-3 h-3 rounded-full bg-amber-400 mr-2 border border-amber-500"></span>
            <span>AIによる削除候補</span>
          </div>
        )}

        <EmailList
          emails={emails}
          selectedIds={selectedIds}
          suggestedIds={suggestedIds}
          onToggleSelect={handleToggleSelect}
          analysisComplete={analysisComplete}
        />
      </main>
      
      {selectedIds.size > 0 && (
        <footer className="sticky bottom-0 z-10 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-[0_-2px_5px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {selectedIds.size}件のメールを選択中
            </span>
            <button
              onClick={handleMoveToTrash}
              className="flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-colors duration-200"
            >
              <TrashIcon />
              ゴミ箱に移動
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
