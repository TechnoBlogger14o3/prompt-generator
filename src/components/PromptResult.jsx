import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

export default function PromptResult({ promptData, onSaveToHistory, isGenerating }) {
  const [copied, setCopied] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [showProTip, setShowProTip] = useState(true);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const openInChatGPT = () => {
    const chatUrl = 'https://chat.openai.com/';
    window.open(chatUrl, '_blank');
  };

  if (!promptData) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-full mb-4">
          <Sparkles className="w-10 h-10 text-purple-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your Perfect Prompt Awaits</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
          Fill in the details on the left and click "Generate Perfect Prompt" to get started.
        </p>
      </div>
    );
  }

  const { system, prompt, type, tone } = promptData;

  return (
    <div className="h-full flex flex-col">
      {/* Prompt Type & Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs font-medium rounded-full">
          {type} • {tone.charAt(0).toUpperCase() + tone.slice(1)}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => copyToClipboard(prompt)}
            className="p-2 text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={openInChatGPT}
            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            title="Open in ChatGPT"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* System Prompt Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowSystemPrompt(!showSystemPrompt)}
          className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center"
        >
          {showSystemPrompt ? 'Hide' : 'Show'} System Prompt
          <svg
            className={`w-3 h-3 ml-1 transition-transform ${showSystemPrompt ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* System Prompt */}
      {showSystemPrompt && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">System Prompt</h4>
              <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">{system}</div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Prompt */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-y-auto custom-scrollbar">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200">
            {prompt}
          </pre>
        </div>
      </div>

      {/* Pro Tip */}
      {showProTip && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl relative">
          <button
            onClick={() => setShowProTip(false)}
            className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
            aria-label="Close tip"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Pro Tip
          </h4>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            For best results, copy both the system prompt and the user prompt when using with ChatGPT.
          </p>
        </div>
      )}
    </div>
  );
}
