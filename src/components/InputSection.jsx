import { useState, useEffect } from 'react';
import { Sparkles, Mail, Code, BarChart3, PenSquare, FileText, Megaphone, Palette, Lightbulb, Presentation, Users, Calendar, BookOpen, Image, Smartphone, Edit3, Check, RefreshCw, Eye } from 'lucide-react';
import { generatePrompt } from '../utils/generatePrompt';
import RealTimePreview from './RealTimePreview';

const PROMPT_TYPES = [
  { value: 'leave', label: 'Leave Request', icon: <Calendar className="w-5 h-5" /> },
  { value: 'learning', label: 'Learning Guide', icon: <BookOpen className="w-5 h-5" /> },
  { value: 'blog', label: 'Blog Writing', icon: <PenSquare className="w-5 h-5" /> },
  { value: 'app-idea', label: 'App Ideas', icon: <Smartphone className="w-5 h-5" /> },
  { value: 'image-generation', label: 'AI Images', icon: <Image className="w-5 h-5" /> },
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
  const [improvedText, setImprovedText] = useState('');
  const [showImprovedText, setShowImprovedText] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const [showRewrittenText, setShowRewrittenText] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [rewriteText, setRewriteText] = useState('');
  const [rewrittenOutput, setRewrittenOutput] = useState('');
  const [showRewrittenOutput, setShowRewrittenOutput] = useState(false);
  const [isRewritingText, setIsRewritingText] = useState(false);
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

  const improveText = async (text) => {
    if (!text.trim()) return;
    
    setIsImproving(true);
    
    // Simulate AI text improvement (in real app, this would call an AI service)
    setTimeout(() => {
      const improved = improveTextGrammar(text);
      setImprovedText(improved);
      setShowImprovedText(true);
      setIsImproving(false);
    }, 1000);
  };

  const improveTextGrammar = (text) => {
    // Basic grammar and clarity improvements
    let improved = text
      // Fix common grammar issues
      .replace(/\bi want to\b/gi, 'I would like to')
      .replace(/\bi need to\b/gi, 'I need to')
      .replace(/\bcan you\b/gi, 'Could you please')
      .replace(/\bhelp me\b/gi, 'assist me with')
      .replace(/\bwrite me\b/gi, 'create for me')
      .replace(/\bmake me\b/gi, 'create')
      .replace(/\bgive me\b/gi, 'provide me with')
      
      // Fix capitalization
      .replace(/^[a-z]/, (match) => match.toUpperCase())
      .replace(/\. [a-z]/g, (match) => match.toUpperCase())
      
      // Fix punctuation
      .replace(/\s+([,.!?])/g, '$1')
      .replace(/([,.!?])([a-zA-Z])/g, '$1 $2')
      
      // Add proper spacing
      .replace(/\s+/g, ' ')
      .trim();
    
    // Ensure it ends with proper punctuation
    if (!/[.!?]$/.test(improved)) {
      improved += '.';
    }
    
    return improved;
  };

  const rewriteTextContent = (text) => {
    // More comprehensive rewriting for better clarity and structure
    let rewritten = text
      // Make it more professional and clear
      .replace(/\bi want to\b/gi, 'I would like to')
      .replace(/\bi need to\b/gi, 'I need to')
      .replace(/\bcan you\b/gi, 'Could you please')
      .replace(/\bhelp me\b/gi, 'assist me with')
      .replace(/\bwrite me\b/gi, 'create for me')
      .replace(/\bmake me\b/gi, 'create')
      .replace(/\bgive me\b/gi, 'provide me with')
      .replace(/\btell me\b/gi, 'explain to me')
      .replace(/\bshow me\b/gi, 'demonstrate')
      
      // Add more structure and clarity
      .replace(/\bfor\b/gi, 'regarding')
      .replace(/\babout\b/gi, 'concerning')
      .replace(/\bhow to\b/gi, 'the process of')
      
      // Fix capitalization
      .replace(/^[a-z]/, (match) => match.toUpperCase())
      .replace(/\. [a-z]/g, (match) => match.toUpperCase())
      
      // Fix punctuation
      .replace(/\s+([,.!?])/g, '$1')
      .replace(/([,.!?])([a-zA-Z])/g, '$1 $2')
      
      // Add proper spacing
      .replace(/\s+/g, ' ')
      .trim();
    
    // Ensure it ends with proper punctuation
    if (!/[.!?]$/.test(rewritten)) {
      rewritten += '.';
    }
    
    // Add more professional structure
    if (rewritten.length > 50) {
      rewritten = rewritten.charAt(0).toUpperCase() + rewritten.slice(1);
    }
    
    return rewritten;
  };

  const rewriteTextProfessionally = async (text) => {
    if (!text.trim()) return;
    
    setIsRewritingText(true);
    
    // Simulate AI text rewriting (in real app, this would call an AI service)
    setTimeout(() => {
      const rewritten = professionalRewrite(text);
      setRewrittenOutput(rewritten);
      setShowRewrittenOutput(true);
      setIsRewritingText(false);
    }, 1500);
  };

  const professionalRewrite = (text) => {
    let rewritten = text
      // Fix aggressive language
      .replace(/\bissue arises because of\b/gi, 'issue appears to be related to')
      .replace(/\bwhich I reported earlier\b/gi, 'I reported earlier')
      .replace(/\balso we have\b/gi, 'we already have')
      .replace(/\bbut to fix that\b/gi, 'but to implement it effectively')
      .replace(/\byou guys should\b/gi, 'it would be helpful if')
      .replace(/\bshould start listening\b/gi, 'could be taken into consideration')
      
      // Make more polite and professional
      .replace(/\bthis is wrong\b/gi, 'this appears to be incorrect')
      .replace(/\bthis is bad\b/gi, 'this could be improved')
      .replace(/\bthis sucks\b/gi, 'this is not ideal')
      .replace(/\byou need to\b/gi, 'it would be beneficial to')
      .replace(/\byou must\b/gi, 'it would be helpful to')
      .replace(/\byou should\b/gi, 'consider')
      .replace(/\byou have to\b/gi, 'it would be necessary to')
      .replace(/\bthis is stupid\b/gi, 'this approach may not be optimal')
      .replace(/\bthis is ridiculous\b/gi, 'this seems unusual')
      .replace(/\bthis doesn't work\b/gi, 'this may not be functioning as expected')
      .replace(/\bthis is broken\b/gi, 'this appears to have issues')
      
      // Fix capitalization
      .replace(/^[a-z]/, (match) => match.toUpperCase())
      .replace(/\. [a-z]/g, (match) => match.toUpperCase())
      
      // Fix punctuation
      .replace(/\s+([,.!?])/g, '$1')
      .replace(/([,.!?])([a-zA-Z])/g, '$1 $2')
      
      // Add proper spacing
      .replace(/\s+/g, ' ')
      .trim();
    
    // Ensure it ends with proper punctuation
    if (!/[.!?]$/.test(rewritten)) {
      rewritten += '.';
    }
    
    return rewritten;
  };

  return (
    <div className="space-y-6">
      {/* Problem Input */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            What do you need help with?
          </label>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
            title={showPreview ? 'Hide live preview' : 'Show live preview'}
          >
            <Eye className="w-4 h-4 mr-1" />
            {showPreview ? 'Hide Preview' : 'Live Preview'}
          </button>
        </div>
        <div className="relative">
          <textarea
            id="problem"
            rows={6}
            className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none custom-scrollbar backdrop-blur-sm placeholder:text-gray-400 placeholder:dark:text-gray-500"
            placeholder="Describe what you need help with in detail..."
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              setShowImprovedText(false); // Hide improved text when user types
              setShowRewrittenText(false); // Hide rewritten text when user types
            }}
            maxLength={maxChars}
          />
          
          {/* Text Improvement Buttons */}
          
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
          
          <div className={`absolute bottom-2 right-2 text-xs ${getCharCountColor()}`}>
            {charCount}/{maxChars}
          </div>
        </div>
        
        {/* Improved Text Display */}
        {showImprovedText && improvedText && (
          <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Improved Text
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setProblem(improvedText);
                    setShowImprovedText(false);
                  }}
                  className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                >
                  Use This
                </button>
                <button
                  onClick={() => setShowImprovedText(false)}
                  className="text-xs px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 italic">
              "{improvedText}"
            </p>
          </div>
        )}
        
        {/* Rewritten Text Display */}
        {showRewrittenText && rewrittenText && (
          <div className="mt-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Rewritten Text
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setProblem(rewrittenText);
                    setShowRewrittenText(false);
                  }}
                  className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Use This
                </button>
                <button
                  onClick={() => setShowRewrittenText(false)}
                  className="text-xs px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300 italic">
              "{rewrittenText}"
            </p>
          </div>
        )}
        
        {/* Real-Time Preview */}
        <RealTimePreview
          problem={problem}
          promptType={selectedType}
          tone={selectedTone}
          isVisible={showPreview}
          onToggle={() => setShowPreview(false)}
        />
      </div>

      {/* Prompt Types */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select a prompt type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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

      {/* Professional Text Rewriter */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Professional Text Rewriter</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="rewrite-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter text to rewrite professionally
            </label>
            <textarea
              id="rewrite-text"
              rows={4}
              className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none custom-scrollbar backdrop-blur-sm placeholder:text-gray-400 placeholder:dark:text-gray-500"
              placeholder="Enter any text that needs to be rewritten more professionally and politely..."
              value={rewriteText}
              onChange={(e) => {
                setRewriteText(e.target.value);
                setShowRewrittenOutput(false);
              }}
            />
          </div>
          
          <button
            onClick={() => rewriteTextProfessionally(rewriteText)}
            disabled={!rewriteText.trim() || isRewritingText}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isRewritingText ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Rewriting...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Rewrite Professionally
              </>
            )}
          </button>

          {/* Rewritten Output Display */}
          {showRewrittenOutput && rewrittenOutput && (
            <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Professionally Rewritten
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(rewrittenOutput);
                    }}
                    className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => setShowRewrittenOutput(false)}
                    className="text-xs px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                "{rewrittenOutput}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
