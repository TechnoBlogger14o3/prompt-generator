import { useState, useEffect } from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';
import InputSection from './components/InputSection';
import PromptResult from './components/PromptResult';
import RecentPrompts from './components/RecentPrompts';
import { saveToHistory } from './utils/generatePrompt';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or use system preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleGenerate = (promptData) => {
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Save to history
      saveToHistory(promptData);
      setCurrentPrompt(promptData);
      setIsGenerating(false);
    }, 800);
  };

  const handleSelectPrompt = (prompt) => {
    setCurrentPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white mr-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              PromptCraft
            </h1>
          </div>
         
         
         
         
         
         
         
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Input */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Craft Your Perfect Prompt
              </h2>
              
              <InputSection 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating} 
              />
              
              <RecentPrompts onSelectPrompt={handleSelectPrompt} />
            </div>
          </div>

          {/* Right column - Output */}
          <div className="lg:sticky lg:top-8 lg:max-h-[600px]">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Generated Prompt
              </h2>
              
              <PromptResult 
                promptData={currentPrompt} 
                onSaveToHistory={saveToHistory}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with ❤️ by Aman Shekhar &nbsp;•&nbsp; {new Date().getFullYear()} PromptCraft</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
