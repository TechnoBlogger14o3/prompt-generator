import { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, Zap } from 'lucide-react';
import { generatePrompt } from '../utils/generatePrompt';

const RealTimePreview = ({ problem, promptType, tone, isVisible, onToggle }) => {
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);

  // Debounced preview generation
  useEffect(() => {
    if (!problem.trim() || !isVisible) {
      setPreviewData(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsGenerating(true);
      const { system, prompt } = generatePrompt(problem, promptType, tone);
      setPreviewData({ system, prompt });
      setIsGenerating(false);
      setLastUpdate(Date.now());
    }, 500); // 500ms delay for better performance

    return () => clearTimeout(timeoutId);
  }, [problem, promptType, tone, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Live Preview
          </span>
          {isGenerating && (
            <div className="ml-2">
              <svg className="animate-spin w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
          title="Hide preview"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {previewData ? (
        <div className="space-y-3">
          {/* System Prompt Preview */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">System Prompt:</div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 break-words overflow-wrap-anywhere">
              {previewData.system}
            </div>
          </div>

          {/* User Prompt Preview */}
          <div className="p-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="text-xs font-medium text-gray-800 dark:text-gray-200 mb-1">User Prompt:</div>
            <div className="text-xs text-gray-700 dark:text-gray-300 break-words overflow-wrap-anywhere max-h-32 overflow-y-auto custom-scrollbar">
              {previewData.prompt}
            </div>
          </div>

          {/* Preview Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Last updated: {new Date(lastUpdate).toLocaleTimeString()}</span>
            <span className="flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Live
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Start typing to see live preview...
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimePreview;
