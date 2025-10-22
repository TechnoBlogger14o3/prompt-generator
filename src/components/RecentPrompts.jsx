import { useState, useEffect } from 'react';
import { Clock, Copy, Trash2, Download } from 'lucide-react';
import { getHistory, clearHistory, exportPromptsAsText } from '../utils/generatePrompt';

export default function RecentPrompts({ onSelectPrompt }) {
  const [prompts, setPrompts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Load prompts from localStorage on component mount
  useEffect(() => {
    loadPrompts();
    
    // Listen for storage events to update when prompts are added from other tabs
    const handleStorageChange = () => {
      loadPrompts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadPrompts = () => {
    const savedPrompts = getHistory();
    setPrompts(savedPrompts);
  };

  const handleClearHistory = () => {
    if (isConfirmingClear) {
      clearHistory();
      setPrompts([]);
      setIsConfirmingClear(false);
    } else {
      setIsConfirmingClear(true);
      // Reset the confirmation state after 3 seconds
      setTimeout(() => setIsConfirmingClear(false), 3000);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    
    return 'Just now';
  };

  const exportPrompts = () => {
    const textData = exportPromptsAsText();
    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptcraft-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (prompts.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <Clock className="w-5 h-5 mr-2 text-purple-500" />
          Recent Prompts
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={exportPrompts}
            className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            title="Export all prompts"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearHistory}
            className={`p-1.5 transition-colors ${
              isConfirmingClear 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400'
            }`}
            title={isConfirmingClear ? 'Click again to confirm' : 'Clear history'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-3">
          {prompts.map((item) => (
            <div
              key={item.id}
              className="group relative p-3 pr-10 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer"
              onClick={() => onSelectPrompt(item)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.problem.length > 60 ? `${item.problem.substring(0, 60)}...` : item.problem}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mr-2">
                      {item.type}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {item.tone.charAt(0).toUpperCase() + item.tone.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 flex items-center">
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(item.prompt);
                    }}
                    className="ml-2 p-1 text-gray-400 hover:text-purple-600 dark:text-gray-500 dark:hover:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy prompt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
