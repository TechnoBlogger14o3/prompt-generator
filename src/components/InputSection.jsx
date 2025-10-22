import { useState, useEffect } from 'react';
import { Sparkles, Mail, Code, BarChart3, PenSquare, FileText, Megaphone, Palette, Lightbulb, Presentation, Users } from 'lucide-react';
import { generatePrompt } from '../utils/generatePrompt';

const PROMPT_TYPES = [
  { value: 'email', label: 'Email Writing', icon: <Mail className="w-5 h-5" /> },
  { value: 'coding', label: 'Coding Help', icon: <Code className="w-5 h-5" /> },
  { value: 'business', label: 'Business Plan', icon: <BarChart3 className="w-5 h-5" /> },
  { value: 'content', label: 'Content Creation', icon: <PenSquare className="w-5 h-5" /> },
  { value: 'resume', label: 'Resume', icon: <FileText className="w-5 h-5" /> },
  { value: 'marketing', label: 'Marketing Copy', icon: <Megaphone className="w-5 h-5" /> },
  { value: 'ux', label: 'UX Writing', icon: <Palette className="w-5 h-5" /> },
  { value: 'presentation', label: 'Presentations', icon: <Presentation className="w-5 h-5" /> },
  { value: 'hr', label: 'HR Communications', icon: <Users className="w-5 h-5" /> },
  { value: 'general', label: 'General Help', icon: <Lightbulb className="w-5 h-5" /> },
];

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal', description: 'Professional and structured' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'creative', label: 'Creative', description: 'Imaginative and engaging' },
  { value: 'technical', label: 'Technical', description: 'Detailed and precise' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
];

export default function InputSection({ onGenerate, isGenerating }) {
  const [problem, setProblem] = useState('');
  const [selectedType, setSelectedType] = useState('general');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 500;

  useEffect(() => {
    setCharCount(problem.length);
  }, [problem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (problem.trim() && !isGenerating) {
      const { system, prompt } = generatePrompt(problem, selectedType, selectedTone);
      onGenerate({
        problem,
        type: PROMPT_TYPES.find(t => t.value === selectedType)?.label || 'General Help',
        tone: selectedTone,
        system,
        prompt
      });
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleToneSelect = (tone) => {
    setSelectedTone(tone);
  };

  const getCharCountColor = () => {
    const percentage = (charCount / maxChars) * 100;
    if (percentage < 60) return 'text-gray-500';
    if (percentage < 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Problem Input */}
      <div className="relative">
        <label htmlFor="problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          What do you need help with?
        </label>
        <div className="relative">
          <textarea
            id="problem"
            rows={6}
            className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none custom-scrollbar backdrop-blur-sm"
            placeholder="Describe what you need help with in detail..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            maxLength={maxChars}
          />
          <div className={`absolute bottom-2 right-2 text-xs ${getCharCountColor()}`}>
            {charCount}/{maxChars}
          </div>
        </div>
      </div>

      {/* Prompt Types */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select a prompt type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PROMPT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => handleTypeSelect(type.value)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                selectedType === type.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 selection-glow'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className={`mb-1 ${selectedType === type.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {type.icon}
              </span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select a tone</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {TONE_OPTIONS.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => handleToneSelect(tone.value)}
              className={`text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                selectedTone === tone.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 tone-selection-glow'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">{tone.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{tone.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!problem.trim() || isGenerating}
          className="w-full flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ripple"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Perfect Prompt
            </>
          )}
        </button>
      </div>
    </div>
  );
}
