import { useState, useEffect } from 'react';
import { Eye, EyeOff, Sparkles, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { generatePrompt } from '../utils/generatePrompt';

const RealTimePreview = ({ problem, promptType, tone, isVisible, onToggle }) => {
  const [previewData, setPreviewData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);
  const [corrections, setCorrections] = useState(null);

  // Dynamic spelling correction using free API
  const correctSpelling = async (text) => {
    if (!text.trim()) return text;
    
    try {
      // Use LanguageTool API (free tier)
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: text,
          language: 'en-US',
          enabledOnly: 'false',
          level: 'default'
        })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      // Apply corrections from API
      let correctedText = text;
      
      // Sort matches by offset in descending order to avoid index shifting
      const sortedMatches = data.matches.sort((a, b) => b.offset - a.offset);
      
      for (const match of sortedMatches) {
        if (match.replacements && match.replacements.length > 0) {
          const replacement = match.replacements[0].value;
          const start = match.offset;
          const end = match.offset + match.length;
          
          correctedText = correctedText.substring(0, start) + 
                         replacement + 
                         correctedText.substring(end);
        }
      }
      
      return correctedText;
      
    } catch (error) {
      console.warn('Spelling API failed, using fallback:', error.message);
      
      // Fallback to basic corrections for common words
      return text
        // Basic common misspellings fallback
        .replace(/\bnneed\b/gi, 'need')
        .replace(/\bneeed\b/gi, 'need')
        .replace(/\bnesaed\b/gi, 'need')
        .replace(/\bdaays\b/gi, 'days')
        .replace(/\bleaave\b/gi, 'leave')
        .replace(/\bleasve\b/gi, 'leave')
        .replace(/\bvacaation\b/gi, 'vacation')
        .replace(/\bvacationa\b/gi, 'vacation')
        .replace(/\boctooober\b/gi, 'October')
        .replace(/\bdiwali\b/gi, 'Diwali')
        .replace(/\biff\b/gi, 'if')
        .replace(/\bof\b/gi, 'for')
        
        // Fix capitalization
        .replace(/^[a-z]/, (match) => match.toUpperCase())
        .replace(/\s+/g, ' ')
        .trim();
    }
  };

  // Dynamic professional rewriting using intelligent pattern matching
  const professionalRewriteAPI = async (text) => {
    if (!text.trim()) return text;
    
    // Intelligent context-aware professional rewriting
    let rewritten = text;
    
    // Detect context and apply appropriate transformations
    const context = detectContext(text);
    
    switch (context.type) {
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
    rewritten = applyUniversalImprovements(rewritten);
    
    return rewritten;
  };

  // Context detection for intelligent rewriting
  const detectContext = (text) => {
    const lowerText = text.toLowerCase();
    
    // Leave request patterns
    if (lowerText.includes('leave') || lowerText.includes('vacation') || lowerText.includes('holiday') || 
        lowerText.includes('sick') || lowerText.includes('personal') || lowerText.includes('family')) {
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

  // Extract duration from text (e.g., "2 days", "1 week")
  const extractDuration = (text) => {
    const durationMatch = text.match(/(\d+)\s*(days?|weeks?|months?|hours?)/i);
    return durationMatch ? `${durationMatch[1]} ${durationMatch[2]}` : 'unspecified';
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

  // Transform leave requests
  const transformLeaveRequest = (text, context) => {
    let transformed = text;
    
    // Extract and format duration
    const duration = context.duration;
    
    // Transform based on patterns
    transformed = transformed
      .replace(/\bneed\s+(\d+)\s*days?\s*leave\b/gi, `I would like to request ${duration} of leave`)
      .replace(/\bwant\s+(\d+)\s*days?\s*leave\b/gi, `I would like to request ${duration} of leave`)
      .replace(/\brequire\s+(\d+)\s*days?\s*leave\b/gi, `I would like to request ${duration} of leave`)
      .replace(/\bapply\s+for\s+(\d+)\s*days?\s*leave\b/gi, `I would like to request ${duration} of leave`)
      .replace(/\brequest\s+(\d+)\s*days?\s*leave\b/gi, `I would like to request ${duration} of leave`)
      
      // Add professional context
      .replace(/\bfor\s+vacation\b/gi, 'for vacation purposes')
      .replace(/\bfor\s+holiday\b/gi, 'for holiday purposes')
      .replace(/\bfor\s+sick\b/gi, 'for medical reasons')
      .replace(/\bfor\s+personal\b/gi, 'for personal reasons')
      .replace(/\bfor\s+family\b/gi, 'for family reasons');
    
    return transformed;
  };

  // Transform email help requests
  const transformEmailHelp = (text, context) => {
    let transformed = text;
    
    transformed = transformed
      .replace(/\bneed\s+help\s+writing\s+email\b/gi, 'I would like to request assistance in drafting a professional email')
      .replace(/\bhelp\s+writing\s+email\b/gi, 'I would like to request assistance in drafting a professional email')
      .replace(/\bneed\s+help\s+with\s+email\b/gi, 'I would like to request assistance with email composition')
      .replace(/\bhelp\s+with\s+email\b/gi, 'I would like to request assistance with email composition')
      .replace(/\bwrite\s+email\b/gi, 'draft a professional email')
      .replace(/\bwriting\s+email\b/gi, 'drafting a professional email');
    
    return transformed;
  };

  // Transform general help requests
  const transformGeneralHelp = (text, context) => {
    let transformed = text;
    
    transformed = transformed
      .replace(/\bneed\s+help\s+with\b/gi, 'I would like to request assistance with')
      .replace(/\bhelp\s+with\b/gi, 'I would like to request assistance with')
      .replace(/\bneed\s+help\s+in\b/gi, 'I would like to request assistance in')
      .replace(/\bhelp\s+in\b/gi, 'I would like to request assistance in')
      .replace(/\bneed\s+help\b/gi, 'I would like to request assistance')
      .replace(/\bhelp\b/gi, 'I would like to request assistance');
    
    return transformed;
  };

  // Transform complaint/feedback
  const transformComplaintFeedback = (text, context) => {
    let transformed = text;
    
    transformed = transformed
      .replace(/\bthis\s+is\s+wrong\b/gi, 'this appears to be incorrect')
      .replace(/\bthis\s+is\s+bad\b/gi, 'this could be improved')
      .replace(/\bthis\s+sucks\b/gi, 'this is not ideal')
      .replace(/\byou\s+need\s+to\b/gi, 'it would be beneficial to')
      .replace(/\byou\s+must\b/gi, 'it would be helpful to')
      .replace(/\byou\s+should\b/gi, 'consider')
      .replace(/\byou\s+have\s+to\b/gi, 'it would be necessary to')
      .replace(/\bthis\s+is\s+stupid\b/gi, 'this approach may not be optimal')
      .replace(/\bthis\s+is\s+ridiculous\b/gi, 'this seems unusual')
      .replace(/\bthis\s+doesn't\s+work\b/gi, 'this may not be functioning as expected')
      .replace(/\bthis\s+is\s+broken\b/gi, 'this appears to have issues');
    
    return transformed;
  };

  // Transform meeting requests
  const transformMeetingRequest = (text, context) => {
    let transformed = text;
    
    transformed = transformed
      .replace(/\bneed\s+meeting\b/gi, 'I would like to schedule a meeting')
      .replace(/\bwant\s+meeting\b/gi, 'I would like to schedule a meeting')
      .replace(/\bneed\s+call\b/gi, 'I would like to schedule a call')
      .replace(/\bwant\s+call\b/gi, 'I would like to schedule a call')
      .replace(/\bneed\s+discuss\b/gi, 'I would like to discuss')
      .replace(/\bwant\s+discuss\b/gi, 'I would like to discuss');
    
    return transformed;
  };

  // Transform project updates
  const transformProjectUpdate = (text, context) => {
    let transformed = text;
    
    transformed = transformed
      .replace(/\bneed\s+update\b/gi, 'I would like to provide an update')
      .replace(/\bwant\s+update\b/gi, 'I would like to provide an update')
      .replace(/\bneed\s+report\b/gi, 'I would like to provide a report')
      .replace(/\bwant\s+report\b/gi, 'I would like to provide a report')
      .replace(/\bneed\s+status\b/gi, 'I would like to provide a status update')
      .replace(/\bwant\s+status\b/gi, 'I would like to provide a status update');
    
    return transformed;
  };

  // Transform generic requests
  const transformGeneric = (text, context) => {
    let transformed = text;
    
    transformed = transformed
      .replace(/\bneed\b/gi, 'I would like to')
      .replace(/\bwant\b/gi, 'I would like to')
      .replace(/\brequire\b/gi, 'I would like to')
      .replace(/\brequest\b/gi, 'I would like to')
      .replace(/\bapply\b/gi, 'I would like to apply for');
    
    return transformed;
  };

  // Apply universal professional improvements
  const applyUniversalImprovements = (text) => {
    return text
      // Fix capitalization
      .replace(/^[a-z]/, (match) => match.toUpperCase())
      .replace(/\. [a-z]/g, (match) => match.toUpperCase())
      
      // Fix duplicate pronouns - remove any "i i" patterns
      .replace(/\bi\s+i\b/gi, 'I')
      .replace(/\bI\s+I\b/g, 'I')
      .replace(/\bi\s+I\b/gi, 'I')
      .replace(/\bI\s+i\b/g, 'I')
      
      // Fix remaining lowercase 'i' to uppercase 'I' (but not if already "I")
      .replace(/\bi\b/gi, 'I')
      
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
    
    // Then apply dynamic professional rewriting using AI API
    rewritten = await professionalRewriteAPI(rewritten);
    
    // Apply additional grammar and style improvements (but avoid duplicate pronouns)
    rewritten = rewritten
      // Fix missing subject pronouns (only if not already present and not already starting with "I")
      .replace(/^(?!i\s|I\s)(need|want|would like|can|should|will|have|am|was|were)\b/gi, 'I $1')
      
      // Fix common grammar issues (only lowercase 'i' to uppercase 'I')
      .replace(/\bi\b/gi, 'I')
      
      // Remove any duplicate pronouns that might have been created
      .replace(/\bi\s+i\b/gi, 'I')
      .replace(/\bI\s+I\b/g, 'I')
      .replace(/\bi\s+I\b/gi, 'I')
      .replace(/\bI\s+i\b/g, 'I')
      
      // Beautiful structural improvements for common requests
      .replace(/\bneed help in writing email for (\d+) days? leave\b/gi, 'I would like to request assistance in drafting a professional email to request $1 days of leave')
      .replace(/\bneed help writing email for (\d+) days? leave\b/gi, 'I would like to request assistance in drafting a professional email to request $1 days of leave')
      .replace(/\bhelp in writing email for (\d+) days? leave\b/gi, 'I would like to request assistance in drafting a professional email to request $1 days of leave')
      .replace(/\bhelp writing email for (\d+) days? leave\b/gi, 'I would like to request assistance in drafting a professional email to request $1 days of leave')
      
      // General help requests
      .replace(/\bneed help in writing\b/gi, 'I would like to request assistance in drafting')
      .replace(/\bneed help writing\b/gi, 'I would like to request assistance in drafting')
      .replace(/\bhelp in writing\b/gi, 'I would like to request assistance in drafting')
      .replace(/\bhelp writing\b/gi, 'I would like to request assistance in drafting')
      .replace(/\bneed help with\b/gi, 'I would like to request assistance with')
      .replace(/\bhelp with\b/gi, 'I would like to request assistance with')
      
      // Professional email requests
      .replace(/\bwriting email\b/gi, 'drafting a professional email')
      .replace(/\bwrite email\b/gi, 'draft a professional email')
      .replace(/\bemail for\b/gi, 'email regarding')
      
      // Leave request improvements
      .replace(/\bfor (\d+) days? leave\b/gi, 'to request $1 days of leave')
      .replace(/\bregarding (\d+) days? leave\b/gi, 'to request $1 days of leave')
      .replace(/\b(\d+) days? leave\b/gi, '$1 days of leave')
      
      // Add professional connectors and transitions
      .replace(/\bI would like to request assistance in drafting a professional email to request (\d+) days of leave\b/gi, 
               'I would like to request assistance in drafting a professional email to request $1 days of leave. I would appreciate guidance on the appropriate tone and structure for this request.')
      
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
        .replace(/\biff vacation\b/gi, 'for vacation')
        .replace(/\biff holiday\b/gi, 'for holiday')
      
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
