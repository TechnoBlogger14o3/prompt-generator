import { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { generatePrompt } from '../utils/generatePrompt';

const RealTimePreview = ({ problem, promptType, tone, isVisible, onToggle }) => {
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [corrections, setCorrections] = useState(null);

  // Enhanced spelling correction with comprehensive pattern matching
  const correctSpelling = async (text) => {
    // Enhanced pattern-based spelling correction (no API key required)
    return text
      // Common misspellings with multiple variations
      .replace(/\bnneed\b/gi, 'need')
      .replace(/\bneeed\b/gi, 'need')
      .replace(/\bnead\b/gi, 'need')
      .replace(/\bneede\b/gi, 'need')
      
      // Days variations
      .replace(/\bdaayss\b/gi, 'days')
      .replace(/\bdaays\b/gi, 'days')
      .replace(/\bdaya\b/gi, 'days')
      .replace(/\bdaysa\b/gi, 'days')
      .replace(/\bdaay\b/gi, 'day')
      .replace(/\bdayy\b/gi, 'day')
      
      // Leave variations
      .replace(/\bleaave\b/gi, 'leave')
      .replace(/\bleav\b/gi, 'leave')
      .replace(/\bleve\b/gi, 'leave')
      .replace(/\bleavve\b/gi, 'leave')
      .replace(/\bleaev\b/gi, 'leave')
      
      // Vacation variations
      .replace(/\bvacaation\b/gi, 'vacation')
      .replace(/\bvacaton\b/gi, 'vacation')
      .replace(/\bvacatin\b/gi, 'vacation')
      .replace(/\bvacationn\b/gi, 'vacation')
      
      // Weeks variations
      .replace(/\bweekks\b/gi, 'weeks')
      .replace(/\bweekk\b/gi, 'week')
      .replace(/\bweeka\b/gi, 'weeks')
      .replace(/\bweeksa\b/gi, 'weeks')
      .replace(/\bweeky\b/gi, 'week')
      
      // Months variations
      .replace(/\bmonnths\b/gi, 'months')
      .replace(/\bmonnth\b/gi, 'month')
      .replace(/\bmontha\b/gi, 'months')
      .replace(/\bmonthsa\b/gi, 'months')
      .replace(/\bmonthh\b/gi, 'month')
      
      // Years variations
      .replace(/\byearrs\b/gi, 'years')
      .replace(/\byearr\b/gi, 'year')
      .replace(/\byeara\b/gi, 'years')
      .replace(/\byearsa\b/gi, 'years')
      .replace(/\byeary\b/gi, 'year')
      
      // Hours variations
      .replace(/\bhouurs\b/gi, 'hours')
      .replace(/\bhouur\b/gi, 'hour')
      .replace(/\bhoura\b/gi, 'hours')
      .replace(/\bhoursa\b/gi, 'hours')
      .replace(/\bhoury\b/gi, 'hour')
      
      // Minutes variations
      .replace(/\bminutess\b/gi, 'minutes')
      .replace(/\bminutte\b/gi, 'minute')
      .replace(/\bminutea\b/gi, 'minutes')
      .replace(/\bminutesa\b/gi, 'minutes')
      .replace(/\bminutey\b/gi, 'minute')
      
      // Seconds variations
      .replace(/\bsecondss\b/gi, 'seconds')
      .replace(/\bsecondd\b/gi, 'second')
      .replace(/\bseconda\b/gi, 'seconds')
      .replace(/\bsecondsa\b/gi, 'seconds')
      .replace(/\bsecondy\b/gi, 'second')
      
      // Work variations
      .replace(/\bworkk\b/gi, 'work')
      .replace(/\bwrk\b/gi, 'work')
      .replace(/\bwrok\b/gi, 'work')
      .replace(/\bworek\b/gi, 'work')
      
      // Job variations
      .replace(/\bjobb\b/gi, 'job')
      .replace(/\bjb\b/gi, 'job')
      .replace(/\bjoob\b/gi, 'job')
      .replace(/\bjobe\b/gi, 'job')
      
      // Meeting variations
      .replace(/\bmeetin\b/gi, 'meeting')
      .replace(/\bmeetng\b/gi, 'meeting')
      .replace(/\bmeetting\b/gi, 'meeting')
      .replace(/\bmeetiing\b/gi, 'meeting')
      
      // Important variations
      .replace(/\bimporttant\b/gi, 'important')
      .replace(/\bimportnt\b/gi, 'important')
      .replace(/\bimporant\b/gi, 'important')
      .replace(/\bimportaant\b/gi, 'important')
      
      // Urgent variations
      .replace(/\burgentt\b/gi, 'urgent')
      .replace(/\burgnt\b/gi, 'urgent')
      .replace(/\burgen\b/gi, 'urgent')
      .replace(/\burgeent\b/gi, 'urgent')
      
      // Fix capitalization for first word
      .replace(/^[a-z]/, (match) => match.toUpperCase())
      .replace(/\. [a-z]/g, (match) => match.toUpperCase())
      
      // Fix punctuation
      .replace(/\s+([,.!?])/g, '$1')
      .replace(/([,.!?])([a-zA-Z])/g, '$1 $2')
      
      // Add proper spacing
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Auto-rewrite function (same as in generatePrompt.js)
  const autoRewriteInput = async (text) => {
    if (!text.trim()) return text;
    
    // First, apply dynamic spelling correction using API
    let rewritten = await correctSpelling(text);
    
    // Then apply grammar and style improvements
    rewritten = rewritten
      // Fix missing subject pronouns
      .replace(/^need\b/gi, 'I need')
      .replace(/^want\b/gi, 'I want')
      .replace(/^would like\b/gi, 'I would like')
      .replace(/^can\b/gi, 'I can')
      .replace(/^should\b/gi, 'I should')
      .replace(/^will\b/gi, 'I will')
      .replace(/^have\b/gi, 'I have')
      .replace(/^am\b/gi, 'I am')
      .replace(/^was\b/gi, 'I was')
      .replace(/^were\b/gi, 'I were')
      
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
      
      // Fix leave request grammar patterns
      .replace(/\bneed (\d+) days? leave if\b/gi, 'need $1 days of leave for')
      .replace(/\bneed (\d+) days? leave for\b/gi, 'need $1 days of leave for')
      .replace(/\bneed (\d+) days? leave\b/gi, 'need $1 days of leave')
      .replace(/\bwant (\d+) days? leave if\b/gi, 'want $1 days of leave for')
      .replace(/\bwant (\d+) days? leave for\b/gi, 'want $1 days of leave for')
      .replace(/\bwant (\d+) days? leave\b/gi, 'want $1 days of leave')
      
      // Fix vacation/leave context
      .replace(/\bif vacation\b/gi, 'for vacation')
      .replace(/\bif holiday\b/gi, 'for holiday')
      .replace(/\bif sick\b/gi, 'for sick leave')
      .replace(/\bif personal\b/gi, 'for personal reasons')
      .replace(/\bif family\b/gi, 'for family reasons')
      .replace(/\bif emergency\b/gi, 'for emergency')
      
      // Fix article usage
      .replace(/\bfor vacation\b/gi, 'for vacation')
      .replace(/\bfor holiday\b/gi, 'for holiday')
      .replace(/\bfor sick leave\b/gi, 'for sick leave')
      .replace(/\bfor personal reasons\b/gi, 'for personal reasons')
      .replace(/\bfor family reasons\b/gi, 'for family reasons')
      .replace(/\bfor emergency\b/gi, 'for emergency')
      
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

    const timeoutId = setTimeout(async () => {
      setIsGenerating(true);
      
      try {
        // Check for corrections using API
        const correctedText = await autoRewriteInput(problem);
        const hasCorrections = correctedText !== problem.trim();
        
        if (hasCorrections) {
          setCorrections({
            original: problem.trim(),
            corrected: correctedText
          });
        } else {
          setCorrections(null);
        }
        
        const { system, prompt } = await generatePrompt(problem, promptType, tone);
        setPreviewData({ system, prompt });
        setIsGenerating(false);
        setLastUpdate(Date.now());
      } catch (error) {
        console.error('Preview generation failed:', error);
        setIsGenerating(false);
        // Fallback to basic preview
        const { system, prompt } = generatePrompt(problem, promptType, tone);
        setPreviewData({ system, prompt });
        setLastUpdate(Date.now());
      }
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
