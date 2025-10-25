import { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { generatePrompt } from '../utils/generatePrompt';

const RealTimePreview = ({ problem, promptType, tone, isVisible, onToggle }) => {
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [corrections, setCorrections] = useState(null);

  // Dynamic spelling correction using pattern recognition and edit distance
  const correctSpelling = (text) => {
    // Common English words database (can be expanded or loaded from external source)
    const commonWords = [
      // Time-related
      'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years', 'hour', 'hours', 'minute', 'minutes', 'second', 'seconds',
      // Verbs
      'need', 'want', 'have', 'can', 'will', 'should', 'must', 'could', 'would', 'may', 'might', 'shall',
      // Nouns
      'leave', 'work', 'job', 'position', 'email', 'meeting', 'time', 'person', 'people', 'place', 'thing', 'way', 'day', 'man', 'woman', 'child', 'hand', 'eye', 'life', 'world', 'house', 'water', 'food', 'money', 'book', 'school', 'company', 'business', 'project', 'team', 'manager', 'employee', 'client', 'customer', 'product', 'service', 'problem', 'solution', 'idea', 'plan', 'goal', 'result', 'success', 'failure', 'help', 'support', 'information', 'data', 'report', 'document', 'file', 'system', 'process', 'method', 'approach', 'strategy', 'policy', 'rule', 'law', 'right', 'wrong', 'good', 'bad', 'better', 'best', 'worse', 'worst', 'important', 'urgent', 'necessary', 'possible', 'available', 'ready', 'complete', 'finished', 'done', 'start', 'begin', 'end', 'stop', 'continue', 'change', 'update', 'improve', 'increase', 'decrease', 'reduce', 'add', 'remove', 'delete', 'create', 'make', 'build', 'develop', 'design', 'test', 'check', 'verify', 'confirm', 'approve', 'reject', 'accept', 'agree', 'disagree', 'like', 'dislike', 'love', 'hate', 'prefer', 'choose', 'select', 'pick', 'decide', 'think', 'believe', 'know', 'understand', 'learn', 'teach', 'explain', 'describe', 'tell', 'say', 'speak', 'talk', 'discuss', 'meet', 'see', 'look', 'watch', 'listen', 'hear', 'read', 'write', 'send', 'receive', 'get', 'give', 'take', 'put', 'place', 'move', 'go', 'come', 'leave', 'arrive', 'stay', 'wait', 'find', 'search', 'look', 'ask', 'question', 'answer', 'reply', 'respond', 'call', 'phone', 'email', 'message', 'text', 'contact', 'connect', 'link', 'join', 'leave', 'exit', 'enter', 'open', 'close', 'start', 'begin', 'end', 'finish', 'complete', 'done', 'ready', 'available', 'free', 'busy', 'working', 'playing', 'sleeping', 'eating', 'drinking', 'walking', 'running', 'driving', 'flying', 'sitting', 'standing', 'lying', 'sleeping', 'waking', 'living', 'dying', 'born', 'dead', 'alive', 'healthy', 'sick', 'tired', 'rested', 'happy', 'sad', 'angry', 'excited', 'nervous', 'calm', 'quiet', 'loud', 'fast', 'slow', 'big', 'small', 'large', 'tiny', 'long', 'short', 'tall', 'wide', 'narrow', 'thick', 'thin', 'heavy', 'light', 'strong', 'weak', 'hard', 'soft', 'smooth', 'rough', 'clean', 'dirty', 'new', 'old', 'young', 'fresh', 'stale', 'hot', 'cold', 'warm', 'cool', 'dry', 'wet', 'full', 'empty', 'rich', 'poor', 'expensive', 'cheap', 'free', 'paid', 'public', 'private', 'open', 'closed', 'safe', 'dangerous', 'easy', 'difficult', 'simple', 'complex', 'clear', 'confusing', 'obvious', 'hidden', 'visible', 'invisible', 'real', 'fake', 'true', 'false', 'correct', 'incorrect', 'right', 'wrong', 'yes', 'no', 'maybe', 'perhaps', 'probably', 'definitely', 'certainly', 'surely', 'absolutely', 'completely', 'totally', 'entirely', 'partially', 'mostly', 'mainly', 'usually', 'often', 'sometimes', 'rarely', 'never', 'always', 'forever', 'temporary', 'permanent', 'recent', 'ancient', 'modern', 'traditional', 'classic', 'popular', 'famous', 'unknown', 'common', 'rare', 'special', 'normal', 'regular', 'standard', 'basic', 'advanced', 'beginner', 'expert', 'professional', 'amateur', 'official', 'unofficial', 'formal', 'informal', 'serious', 'funny', 'fun', 'boring', 'interesting', 'exciting', 'amazing', 'wonderful', 'terrible', 'awful', 'great', 'excellent', 'perfect', 'flawless', 'broken', 'fixed', 'working', 'broken', 'damaged', 'repaired', 'maintained', 'updated', 'upgraded', 'downgraded', 'improved', 'worsened', 'better', 'worse', 'same', 'different', 'similar', 'opposite', 'equal', 'unequal', 'more', 'less', 'most', 'least', 'many', 'few', 'some', 'all', 'none', 'every', 'each', 'both', 'either', 'neither', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'hundred', 'thousand', 'million', 'billion', 'first', 'second', 'third', 'last', 'next', 'previous', 'current', 'past', 'future', 'present', 'today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk', 'sunrise', 'sunset', 'spring', 'summer', 'autumn', 'winter', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'weekend', 'weekday', 'holiday', 'vacation', 'trip', 'journey', 'travel', 'visit', 'tour', 'adventure', 'experience', 'memory', 'dream', 'nightmare', 'hope', 'fear', 'worry', 'concern', 'problem', 'issue', 'trouble', 'difficulty', 'challenge', 'obstacle', 'barrier', 'block', 'prevent', 'stop', 'allow', 'permit', 'forbid', 'ban', 'prohibit', 'restrict', 'limit', 'control', 'manage', 'handle', 'deal', 'cope', 'survive', 'thrive', 'succeed', 'fail', 'win', 'lose', 'beat', 'defeat', 'victory', 'defeat', 'triumph', 'success', 'achievement', 'accomplishment', 'goal', 'target', 'aim', 'purpose', 'reason', 'cause', 'effect', 'result', 'consequence', 'outcome', 'impact', 'influence', 'affect', 'change', 'transform', 'convert', 'turn', 'become', 'grow', 'develop', 'evolve', 'progress', 'advance', 'move', 'shift', 'transfer', 'transport', 'carry', 'bring', 'take', 'deliver', 'send', 'receive', 'get', 'obtain', 'acquire', 'gain', 'earn', 'win', 'lose', 'spend', 'cost', 'pay', 'buy', 'sell', 'trade', 'exchange', 'swap', 'replace', 'substitute', 'alternative', 'option', 'choice', 'decision', 'selection', 'preference', 'favorite', 'best', 'worst', 'top', 'bottom', 'high', 'low', 'up', 'down', 'above', 'below', 'over', 'under', 'on', 'off', 'in', 'out', 'inside', 'outside', 'here', 'there', 'where', 'when', 'why', 'how', 'what', 'who', 'which', 'whose', 'whom', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'me', 'you', 'him', 'her', 'us', 'them', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves', 'i', 'we', 'he', 'she', 'it', 'they', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall', 'and', 'or', 'but', 'so', 'yet', 'for', 'nor', 'because', 'since', 'as', 'if', 'unless', 'although', 'though', 'while', 'whereas', 'wherever', 'whenever', 'however', 'therefore', 'thus', 'hence', 'moreover', 'furthermore', 'additionally', 'also', 'too', 'either', 'neither', 'both', 'all', 'some', 'any', 'every', 'each', 'one', 'two', 'three', 'first', 'second', 'third', 'last', 'next', 'other', 'another', 'same', 'different', 'similar', 'various', 'several', 'many', 'much', 'few', 'little', 'more', 'most', 'less', 'least', 'enough', 'too', 'very', 'quite', 'rather', 'pretty', 'fairly', 'somewhat', 'almost', 'nearly', 'about', 'around', 'approximately', 'exactly', 'precisely', 'just', 'only', 'even', 'still', 'yet', 'already', 'soon', 'immediately', 'quickly', 'slowly', 'carefully', 'easily', 'hardly', 'barely', 'scarcely', 'never', 'always', 'often', 'sometimes', 'rarely', 'seldom', 'usually', 'normally', 'typically', 'generally', 'commonly', 'frequently', 'occasionally', 'regularly', 'constantly', 'continuously', 'permanently', 'temporarily', 'recently', 'lately', 'now', 'then', 'today', 'yesterday', 'tomorrow', 'tonight', 'this', 'that', 'here', 'there', 'where', 'when', 'why', 'how', 'what', 'who', 'which', 'whose', 'whom'
    ];

    // Calculate edit distance between two strings
    const editDistance = (str1, str2) => {
      const matrix = [];
      const len1 = str1.length;
      const len2 = str2.length;

      for (let i = 0; i <= len2; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= len1; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }

      return matrix[len2][len1];
    };

    // Find the best correction using edit distance
    const findBestCorrection = (word) => {
      const lowerWord = word.toLowerCase();
      
      // If it's already a common word, return it
      if (commonWords.includes(lowerWord)) {
        return word;
      }

      let bestMatch = word;
      let minDistance = Infinity;

      // Find the closest match in common words
      for (const commonWord of commonWords) {
        const distance = editDistance(lowerWord, commonWord);
        
        // Only consider corrections if the distance is reasonable (max 2 edits for short words, 3 for longer)
        const maxDistance = word.length <= 4 ? 2 : 3;
        
        if (distance <= maxDistance && distance < minDistance) {
          minDistance = distance;
          bestMatch = commonWord;
        }
      }

      // If no good match found, return original word
      if (minDistance === Infinity || minDistance > (word.length <= 4 ? 2 : 3)) {
        return word;
      }

      return bestMatch;
    };

    // Split text into words and correct each one
    return text.split(/\s+/).map(word => {
      // Preserve punctuation
      const punctuation = word.match(/[.,!?;:]+$/);
      const cleanWord = word.replace(/[.,!?;:]+$/, '');
      const corrected = findBestCorrection(cleanWord);
      
      // Restore capitalization for first word of sentence
      if (word === text.split(/\s+/)[0]) {
        return corrected.charAt(0).toUpperCase() + corrected.slice(1) + (punctuation ? punctuation[0] : '');
      }
      
      return corrected + (punctuation ? punctuation[0] : '');
    }).join(' ');
  };

  // Auto-rewrite function (same as in generatePrompt.js)
  const autoRewriteInput = (text) => {
    if (!text.trim()) return text;
    
    // First, apply dynamic spelling correction
    let rewritten = correctSpelling(text);
    
    // Then apply grammar and style improvements
    rewritten = rewritten
      // Fix common grammar issues
      .replace(/\bi need\b/gi, 'I need')
      .replace(/\bi want\b/gi, 'I want')
      .replace(/\bi would like\b/gi, 'I would like')
      .replace(/\bi can\b/gi, 'I can')
      .replace(/\bi should\b/gi, 'I should')
      .replace(/\bi will\b/gi, 'I will')
      .replace(/\bi have\b/gi, 'I have')
      .replace(/\bi am\b/gi, 'I am')
      .replace(/\bi was\b/gi, 'I was')
      .replace(/\bi were\b/gi, 'I were')
      
      // Fix common contractions and informal language
      .replace(/\bwanna\b/gi, 'want to')
      .replace(/\bgonna\b/gi, 'going to')
      .replace(/\bgotta\b/gi, 'got to')
      .replace(/\bhafta\b/gi, 'have to')
      .replace(/\bneeda\b/gi, 'need to')
      .replace(/\boughta\b/gi, 'ought to')
      .replace(/\bwoulda\b/gi, 'would have')
      .replace(/\bcoulda\b/gi, 'could have')
      .replace(/\bshoulda\b/gi, 'should have')
      
      // Fix common typos and misspellings
      .replace(/\bteh\b/gi, 'the')
      .replace(/\badn\b/gi, 'and')
      .replace(/\btaht\b/gi, 'that')
      .replace(/\bthier\b/gi, 'their')
      .replace(/\bthere\b/gi, 'their')
      .replace(/\byour\b/gi, 'you are')
      .replace(/\bits\b/gi, 'it is')
      .replace(/\byoure\b/gi, 'you are')
      .replace(/\btheyre\b/gi, 'they are')
      .replace(/\bwere\b/gi, 'we are')
      .replace(/\barent\b/gi, 'are not')
      .replace(/\bisnt\b/gi, 'is not')
      .replace(/\bwasnt\b/gi, 'was not')
      .replace(/\bwerent\b/gi, 'were not')
      .replace(/\bhavent\b/gi, 'have not')
      .replace(/\bhasnt\b/gi, 'has not')
      .replace(/\bhadnt\b/gi, 'had not')
      .replace(/\bwont\b/gi, 'will not')
      .replace(/\bwouldnt\b/gi, 'would not')
      .replace(/\bcouldnt\b/gi, 'could not')
      .replace(/\bshouldnt\b/gi, 'should not')
      .replace(/\bcant\b/gi, 'cannot')
      .replace(/\bdont\b/gi, 'do not')
      .replace(/\bdoesnt\b/gi, 'does not')
      .replace(/\bdidnt\b/gi, 'did not')
      
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
      
      // Add more structure and clarity (be more specific to avoid over-correction)
      .replace(/\bfor\b/gi, (match, offset, string) => {
        // Don't replace "for" if it's part of common phrases
        const before = string.substring(Math.max(0, offset - 20), offset).toLowerCase();
        const after = string.substring(offset + 3, Math.min(string.length, offset + 23)).toLowerCase();
        
        // Keep "for" in these contexts
        if (before.includes('apply') || before.includes('looking') || before.includes('searching') || 
            before.includes('waiting') || before.includes('asking') || before.includes('requesting') ||
            after.includes('position') || after.includes('job') || after.includes('role') ||
            after.includes('interview') || after.includes('meeting') || after.includes('appointment')) {
          return 'for';
        }
        
        // Replace with "regarding" in other contexts
        return 'regarding';
      })
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
    
    return rewritten;
  };
  useEffect(() => {
    if (!problem.trim() || !isVisible) {
      setPreviewData(null);
      setCorrections(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsGenerating(true);
      
      // Check for corrections
      const correctedText = autoRewriteInput(problem);
      const hasCorrections = correctedText !== problem.trim();
      
      if (hasCorrections) {
        setCorrections({
          original: problem.trim(),
          corrected: correctedText
        });
      } else {
        setCorrections(null);
      }
      
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
          {/* Text Corrections Display */}
          {corrections && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Text Corrected
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Original:</span> "{corrections.original}"
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">
                  <span className="font-medium">Corrected:</span> "{corrections.corrected}"
                </div>
              </div>
            </div>
          )}

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
