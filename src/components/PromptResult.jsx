import { useState, useEffect } from 'react';
import { Copy, Check, ExternalLink, Sparkles, Download } from 'lucide-react';
import { Box, Typography, IconButton, Tooltip, Chip, Paper, Button } from '@mui/material';
import { formatPromptEntryAsMarkdown, getPromptMarkdownFilename } from '../utils/generatePrompt';

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

  const downloadAsMarkdown = () => {
    const md = formatPromptEntryAsMarkdown(promptData);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getPromptMarkdownFilename(promptData);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!promptData) {
    return (
      <Box className="h-full flex flex-col items-center justify-center text-center p-4 bg-linear-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 max-h-[400px]">
        <Box className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-full mb-3">
          <Sparkles className="w-8 h-8 text-purple-500" />
        </Box>
        <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">Your Perfect Prompt Awaits</Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-400 text-sm max-w-sm">
          Fill in the details on the left and click "Generate Perfect Prompt" to get started.
        </Typography>
      </Box>
    );
  }

  const { system, prompt, type, tone } = promptData;

  return (
    <div className="h-full flex flex-col max-h-[500px]">
      {/* Prompt Type & Actions */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <Chip size="small" label={`${type} • ${tone.charAt(0).toUpperCase() + tone.slice(1)}`} color="primary" variant="outlined" />
        <div className="flex space-x-2">
          <Tooltip title="Copy to clipboard">
            <IconButton size="small" onClick={() => copyToClipboard(prompt)}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Download as Markdown">
            <IconButton size="small" onClick={downloadAsMarkdown}>
              <Download className="w-4 h-4" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in ChatGPT">
            <IconButton size="small" onClick={openInChatGPT}>
              <ExternalLink className="w-4 h-4" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* System Prompt Toggle */}
      <div className="mb-4">
        <Button size="small" onClick={() => setShowSystemPrompt(!showSystemPrompt)}>
          {showSystemPrompt ? 'Hide' : 'Show'} System Prompt
        </Button>
      </div>

      {/* System Prompt */}
      {showSystemPrompt && (
        <Paper variant="outlined" className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start">
            <div className="shrink-0 pt-0.5">
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
              <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-300 wrap-break-word overflow-wrap-anywhere">{system}</div>
            </div>
          </div>
        </Paper>
      )}

      {/* Generated Prompt */}
      <div className="flex-1 flex flex-col min-h-0">
        <Paper variant="outlined" className="flex-1 bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-y-auto custom-scrollbar">
          <div className="whitespace-pre-wrap font-sans text-sm text-gray-800 dark:text-gray-200 wrap-break-word overflow-wrap-anywhere">
            {prompt}
          </div>
        </Paper>
      </div>

     
    
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
    </div>
  );
}
