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
  const maxChars = 500;

  useEffect(() => {
    setCharCount(problem.length);
  }, [problem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (problem.trim() && !isGenerating) {
      try {
        // Multiple passes of correction to ensure all errors are caught
        let correctedProblem = await correctSpelling(problem);
        correctedProblem = await polishWithLanguageTool(correctedProblem);
        // Second pass to catch any remaining issues
        correctedProblem = await correctSpelling(correctedProblem);
        correctedProblem = await polishWithLanguageTool(correctedProblem);
        
        // Update the input field with corrected text
        setProblem(correctedProblem);
        
        // Generate prompt using the corrected text
        const { system, prompt } = await generatePrompt(correctedProblem, selectedType, selectedTone);
        onGenerate({
          problem: correctedProblem,
          type: PROMPT_TYPES.find(t => t.value === selectedType)?.label || 'General Help',
          tone: selectedTone,
          system,
          prompt
        });
      } catch (error) {
        console.error('Error generating prompt:', error);
        // Fallback: try to correct text even if prompt generation fails
        try {
          let correctedProblem = await correctSpelling(problem);
          correctedProblem = await polishWithLanguageTool(correctedProblem);
          // Second pass
          correctedProblem = await correctSpelling(correctedProblem);
          correctedProblem = await polishWithLanguageTool(correctedProblem);
          setProblem(correctedProblem);
          
          const { system, prompt } = await generatePrompt(correctedProblem, selectedType, selectedTone);
          onGenerate({
            problem: correctedProblem,
            type: PROMPT_TYPES.find(t => t.value === selectedType)?.label || 'General Help',
            tone: selectedTone,
            system,
            prompt
          });
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          // Last resort: use original text
          const { system, prompt } = await generatePrompt(problem, selectedType, selectedTone);
          onGenerate({
            problem,
            type: PROMPT_TYPES.find(t => t.value === selectedType)?.label || 'General Help',
            tone: selectedTone,
            system,
            prompt
          });
        }
      }
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
    
    try {
      // Use API for text improvement
      const improved = await improveTextGrammar(text);
      setImprovedText(improved);
      setShowImprovedText(true);
    } catch (error) {
      console.error('Error improving text:', error);
      setImprovedText(text);
      setShowImprovedText(true);
    } finally {
      setIsImproving(false);
    }
  };

  const improveTextGrammar = async (text) => {
    // Use API for grammar improvements instead of hardcoded patterns
    return await polishWithLanguageTool(text);
  };

  // Comprehensive spelling and grammar correction using free API - no hardcoded patterns
  const correctSpelling = async (text) => {
    if (!text.trim()) return text;
    
    try {
      // Use LanguageTool API (free tier) with comprehensive checking
      // Try with enabledOnly=false to get all suggestions, including spelling
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          language: 'en-US',
          enabledOnly: 'false',
          level: 'picky', // Use picky level for more comprehensive checking
          enabledRules: '', // Empty means all rules enabled
          enabledCategories: '' // Empty means all categories enabled
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Log API response for debugging
      console.log('LanguageTool API response for:', text, data);
      
      // Apply corrections from API - be more aggressive
      let correctedText = text;
      
      // Sort matches by offset in descending order to avoid index shifting
      const sortedMatches = data.matches.sort((a, b) => b.offset - a.offset);
      
      // Apply ALL corrections from the API
      for (const match of sortedMatches) {
        if (match.replacements && match.replacements.length > 0) {
          // Use the first replacement (usually the best)
          const replacement = match.replacements[0].value;
          const start = match.offset;
          const end = match.offset + match.length;
          const originalText = text.substring(start, end);
          
          console.log(`Applying correction: "${originalText}" -> "${replacement}"`);
          
          // Apply the replacement
          correctedText = correctedText.substring(0, start) + 
                         replacement + 
                         correctedText.substring(end);
        }
      }
      
      // Log for debugging
      if (correctedText !== text) {
        console.log('Correction applied:', text, '->', correctedText);
      } else {
        console.log('No corrections found by API for:', text, 'Matches:', data.matches.length);
      }
      
      // If text changed, make another pass to catch any remaining issues
      if (correctedText !== text) {
        // Second pass with corrected text
        const secondResponse = await fetch('https://api.languagetool.org/v2/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            text: correctedText,
            language: 'en-US',
            enabledOnly: 'false',
            level: 'picky'
          })
        });
        
        if (secondResponse.ok) {
          const secondData = await secondResponse.json();
          const secondSortedMatches = secondData.matches.sort((a, b) => b.offset - a.offset);
          
          for (const match of secondSortedMatches) {
            if (match.replacements && match.replacements.length > 0) {
              const replacement = match.replacements[0].value;
              const start = match.offset;
              const end = match.offset + match.length;
              
              correctedText = correctedText.substring(0, start) + 
                             replacement + 
                             correctedText.substring(end);
            }
          }
        }
      }
      
      return correctedText;
      
    } catch (error) {
      console.warn('Spelling/Grammar API failed, using fallback:', error.message);
      return text;
    }
  };

  // Comprehensive grammar and style polish using LanguageTool
  const polishWithLanguageTool = async (text) => {
    if (!text.trim()) return text;
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          text,
          language: 'en-US',
          enabledOnly: 'false',
          level: 'picky' // Most comprehensive level for grammar and style
        })
      });
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();

      let polished = text;
      const sorted = data.matches.sort((a, b) => b.offset - a.offset);
      
      for (const match of sorted) {
        if (match.replacements && match.replacements.length > 0) {
          // Use the best replacement (first one is usually the best)
          const candidate = match.replacements[0].value;
          const start = match.offset;
          const end = match.offset + match.length;
          polished = polished.substring(0, start) + candidate + polished.substring(end);
        }
      }
      
      return polished;
    } catch (e) {
      console.warn('Grammar polish API failed, using fallback:', e.message);
      return text;
    }
  };


  // Transform email + leave help requests - return text as-is, let API handle corrections
  const transformEmailLeaveHelp = (text, context) => {
    return text;
  };

  // Dynamic professional rewriting using intelligent pattern matching
  const professionalRewriteAPI = async (text) => {
    if (!text.trim()) return text;
    
    // Intelligent context-aware professional rewriting
    let rewritten = text;
    
    // Detect context and apply appropriate transformations
    const context = detectContext(text);
    
    switch (context.type) {
      case 'email_leave_help':
        rewritten = transformEmailLeaveHelp(text, context);
        break;
      case 'leave_request':
        rewritten = transformLeaveRequest(text, context);
        break;
      case 'email_help':
        rewritten = transformEmailHelp(text, context);
        break;
      case 'general_help':
        rewritten = transformGeneralHelp(text, context);
        break;
      case 'complaint_feedback':
        rewritten = transformComplaintFeedback(text, context);
        break;
      case 'meeting_request':
        rewritten = transformMeetingRequest(text, context);
        break;
      case 'project_update':
        rewritten = transformProjectUpdate(text, context);
        break;
      default:
        rewritten = transformGeneric(text, context);
    }
    
    // Apply universal professional improvements
    return rewritten;
  };

  // Context detection for intelligent rewriting
  const detectContext = (text) => {
    const lowerText = text.toLowerCase();
    
    // Combined patterns: help + email + leave (highest priority)
    if ((lowerText.includes('help') || lowerText.includes('need') || lowerText.includes('want')) && 
        (lowerText.includes('email') || lowerText.includes('mail') || lowerText.includes('write') || lowerText.includes('draft')) &&
        (lowerText.includes('leave') || lowerText.includes('days') || lowerText.includes('vacation'))) {
      return { type: 'email_leave_help', urgency: 'normal', duration: extractDuration(text) };
    }
    
    // Leave request patterns
    if (lowerText.includes('leave') || lowerText.includes('vacation') || lowerText.includes('holiday') || 
        lowerText.includes('sick') || lowerText.includes('personal') || lowerText.includes('family') ||
        (lowerText.includes('days') && (lowerText.includes('taking') || lowerText.includes('need') || lowerText.includes('want')))) {
      return { type: 'leave_request', urgency: 'normal', duration: extractDuration(text) };
    }
    
    // Email help patterns
    if (lowerText.includes('email') && (lowerText.includes('help') || lowerText.includes('write') || lowerText.includes('draft'))) {
      return { type: 'email_help', purpose: extractEmailPurpose(text) };
    }
    
    // General help patterns
    if (lowerText.includes('help') || lowerText.includes('assist') || lowerText.includes('support')) {
      return { type: 'general_help', topic: extractTopic(text) };
    }
    
    // Complaint/feedback patterns
    if (lowerText.includes('issue') || lowerText.includes('problem') || lowerText.includes('wrong') || 
        lowerText.includes('bad') || lowerText.includes('fix') || lowerText.includes('complaint')) {
      return { type: 'complaint_feedback', severity: 'medium' };
    }
    
    // Meeting request patterns
    if (lowerText.includes('meeting') || lowerText.includes('call') || lowerText.includes('discuss') || 
        lowerText.includes('schedule') || lowerText.includes('appointment')) {
      return { type: 'meeting_request', urgency: 'normal' };
    }
    
    // Project update patterns
    if (lowerText.includes('project') || lowerText.includes('update') || lowerText.includes('progress') || 
        lowerText.includes('status') || lowerText.includes('report')) {
      return { type: 'project_update', frequency: 'regular' };
    }
    
    return { type: 'generic', confidence: 'low' };
  };

  // Extract duration from text (e.g., "2 days", "1 week", "two days")
  const extractDuration = (text) => {
    // Word to number mapping
    const wordToNumber = {
      'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
      'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10'
    };
    
    // Try to match digit first
    let durationMatch = text.match(/(\d+)\s*(days?|weeks?|months?|hours?)/i);
    if (durationMatch) {
      return `${durationMatch[1]} ${durationMatch[2]}`;
    }
    
    // Try to match word numbers
    const wordMatch = text.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+(days?|weeks?|months?|hours?)/i);
    if (wordMatch) {
      const num = wordToNumber[wordMatch[1].toLowerCase()] || wordMatch[1];
      return `${num} ${wordMatch[2]}`;
    }
    
    return 'unspecified';
  };

  // Extract email purpose from text
  const extractEmailPurpose = (text) => {
    if (text.toLowerCase().includes('leave')) return 'leave_request';
    if (text.toLowerCase().includes('meeting')) return 'meeting_request';
    if (text.toLowerCase().includes('project')) return 'project_update';
    return 'general';
  };

  // Extract topic from help requests
  const extractTopic = (text) => {
    const topics = ['writing', 'email', 'presentation', 'report', 'analysis', 'research', 'coding', 'design'];
    for (const topic of topics) {
      if (text.toLowerCase().includes(topic)) return topic;
    }
    return 'general';
  };

  // Transform leave requests - return text as-is, let API handle corrections
  const transformLeaveRequest = (text, context) => {
    return text;
  };

  // Transform email help requests - return text as-is, let API handle corrections
  const transformEmailHelp = (text, context) => {
    return text;
  };

  // Transform general help requests - return text as-is, let API handle corrections
  const transformGeneralHelp = (text, context) => {
    return text;
  };

  // Transform functions - return text as-is, let API handle corrections
  const transformComplaintFeedback = (text, context) => {
    return text;
  };

  const transformMeetingRequest = (text, context) => {
    return text;
  };

  const transformProjectUpdate = (text, context) => {
    return text;
  };

  // Transform generic requests - minimal transformation, let API handle most corrections
  const transformGeneric = (text, context) => {
    // Return text as-is, let LanguageTool and professional improvements handle it
    return text;
  };


  const professionalRewrite = async (text) => {
    // Step 1: Apply comprehensive spelling and grammar correction first
    let rewritten = await correctSpelling(text);
    
    // Step 2: Apply dynamic professional rewriting using context-aware transformations
    rewritten = await professionalRewriteAPI(rewritten);
    
    // Step 3: Apply comprehensive grammar and style polish using LanguageTool
    rewritten = await polishWithLanguageTool(rewritten);
    
    // Step 4: If nothing changed meaningfully, apply a stronger generic rewrite pass
    const normalizedOriginal = text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9\s]/g, '');
    const normalizedRewritten = rewritten.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[^a-z0-9\s]/g, '');
    
    // Skip pattern-based transformations - rely on API for intelligent rewriting

    // Step 5: Final grammar check with LanguageTool again to catch any remaining issues
    rewritten = await polishWithLanguageTool(rewritten);
    
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
    </div>
  );
}
