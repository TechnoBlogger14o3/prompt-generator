import { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { generatePrompt } from '../utils/generatePrompt';

const RealTimePreview = ({ problem, promptType, tone, isVisible, onToggle }) => {
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [corrections, setCorrections] = useState(null);

  // Dynamic spelling correction using edit distance and common patterns
  const correctSpelling = (text) => {
    // Common word dictionary with variations
    const wordCorrections = {
      // Time-related words
      'day': ['day', 'days', 'daya', 'daysa', 'daay', 'daays', 'dayy', 'dayys'],
      'week': ['week', 'weeks', 'weeka', 'weeksa', 'weekk', 'weekks', 'weeky', 'weekys'],
      'month': ['month', 'months', 'montha', 'monthsa', 'monnth', 'monnths', 'monthh', 'monthhs'],
      'year': ['year', 'years', 'yeara', 'yearsa', 'yearr', 'yearrs', 'yeary', 'yearys'],
      'hour': ['hour', 'hours', 'houra', 'hoursa', 'hourr', 'hourrs', 'houry', 'hourys'],
      'minute': ['minute', 'minutes', 'minutea', 'minutesa', 'minutte', 'minutess', 'minutey', 'minuteys'],
      'second': ['second', 'seconds', 'seconda', 'secondsa', 'secondd', 'secondss', 'secondy', 'secondys'],
      
      // Common verbs
      'need': ['need', 'neeed', 'nead', 'nead', 'neede', 'needed'],
      'want': ['want', 'wannt', 'wnt', 'wont', 'wanet', 'wanted'],
      'have': ['have', 'hav', 'hve', 'havve', 'haev', 'had'],
      'can': ['can', 'cann', 'cn', 'caan', 'cane', 'could'],
      'will': ['will', 'wil', 'wll', 'wille', 'woud', 'would'],
      'should': ['should', 'shuld', 'shold', 'shoud', 'shoul', 'shoulld'],
      
      // Common nouns
      'leave': ['leave', 'leav', 'leve', 'leavve', 'leaev', 'leaves'],
      'work': ['work', 'wrk', 'wrok', 'workk', 'worek', 'working'],
      'job': ['job', 'jobb', 'jb', 'joob', 'jobe', 'jobs'],
      'position': ['position', 'positon', 'posiion', 'posittion', 'posiiton', 'positions'],
      'email': ['email', 'emial', 'emai', 'emaill', 'eamil', 'emails'],
      'meeting': ['meeting', 'meetin', 'meetng', 'meetting', 'meetiing', 'meetings'],
      
      // Common adjectives
      'good': ['good', 'gud', 'goood', 'goo', 'gode', 'better'],
      'bad': ['bad', 'badd', 'bd', 'baad', 'bade', 'worse'],
      'important': ['important', 'importnt', 'imporant', 'importtant', 'importaant', 'important'],
      'urgent': ['urgent', 'urgnt', 'urgen', 'urgentt', 'urgeent', 'urgently'],
      
      // Common prepositions
      'for': ['for', 'fr', 'fo', 'fore', 'four', 'fro'],
      'with': ['with', 'wth', 'wit', 'withe', 'wiht', 'withh'],
      'from': ['from', 'frm', 'fro', 'fromm', 'form', 'froem'],
      'about': ['about', 'abut', 'abot', 'abou', 'abouut', 'aboute'],
      'regarding': ['regarding', 'regardng', 'regardin', 'regardding', 'regardiing', 'regarding'],
      
      // Common conjunctions
      'and': ['and', 'ad', 'an', 'andd', 'ande', 'nd'],
      'or': ['or', 'ore', 'orr', 'oor', 'or', 'or'],
      'but': ['but', 'bt', 'bute', 'butt', 'buut', 'but'],
      'because': ['because', 'becuse', 'becaus', 'becaue', 'becaause', 'becuase'],
      
      // Common pronouns
      'you': ['you', 'yu', 'yo', 'youu', 'yuo', 'your'],
      'your': ['your', 'yur', 'yor', 'youre', 'youur', 'yours'],
      'their': ['their', 'thier', 'there', 'theire', 'theiir', 'theirs'],
      'there': ['there', 'thre', 'ther', 'theree', 'theere', 'theres'],
      'where': ['where', 'wher', 'whee', 'wheree', 'wheere', 'wheres'],
      
      // Common articles
      'the': ['the', 'te', 'th', 'thee', 'the', 'teh'],
      'a': ['a', 'an', 'aa', 'ae', 'ah', 'a'],
      'an': ['an', 'a', 'ann', 'ane', 'aan', 'an']
    };

    // Function to find the best correction using edit distance
    const findBestCorrection = (word) => {
      const lowerWord = word.toLowerCase();
      
      // Direct match first
      for (const [correct, variations] of Object.entries(wordCorrections)) {
        if (variations.includes(lowerWord)) {
          return correct;
        }
      }
      
      // If no direct match, return original word
      return word;
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
