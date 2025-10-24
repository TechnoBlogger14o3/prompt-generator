import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronRight, Lightbulb, Target, Clock, Users } from 'lucide-react';

const EnhancedContextQuestions = ({ problem, promptType, tone, onAnswersChange }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [smartSuggestions, setSmartSuggestions] = useState([]);

  // Generate enhanced context questions based on problem analysis
  useEffect(() => {
    generateEnhancedQuestions(problem, promptType);
  }, [problem, promptType]);

  const generateEnhancedQuestions = (inputProblem, type) => {
    const lowerProblem = inputProblem.toLowerCase();
    let enhancedQuestions = [];

    // Leave request enhanced questions
    if (type === 'leave' || lowerProblem.includes('leave')) {
      enhancedQuestions = [
        {
          id: 'leave-details',
          title: 'Leave Details',
          icon: <Clock className="w-4 h-4" />,
          questions: [
            { id: 'duration', question: 'How many days of leave do you need?', type: 'text', placeholder: 'e.g., 2 days, 1 week', required: true },
            { id: 'reason', question: 'What is the reason for your leave?', type: 'select', options: ['Personal reasons', 'Medical appointment', 'Family event', 'Vacation', 'Emergency', 'Other'], required: true },
            { id: 'urgency', question: 'How urgent is this request?', type: 'select', options: ['Immediate', 'This week', 'Next week', 'Flexible'], required: false },
            { id: 'manager', question: 'Who is your direct manager?', type: 'text', placeholder: 'Manager name', required: false },
            { id: 'coverage', question: 'Do you need coverage arrangements?', type: 'select', options: ['Yes, I\'ll arrange coverage', 'No coverage needed', 'Manager will handle'], required: false }
          ]
        },
        {
          id: 'professional-context',
          title: 'Professional Context',
          icon: <Users className="w-4 h-4" />,
          questions: [
            { id: 'department', question: 'What department do you work in?', type: 'text', placeholder: 'e.g., Engineering, Marketing', required: false },
            { id: 'company-size', question: 'Company size?', type: 'select', options: ['Startup (1-50)', 'Small (51-200)', 'Medium (201-1000)', 'Large (1000+)'], required: false },
            { id: 'work-remote', question: 'Do you work remotely?', type: 'select', options: ['Yes', 'No', 'Hybrid'], required: false }
          ]
        }
      ];
    }

    // Learning enhanced questions
    if (type === 'learning' || lowerProblem.includes('learn')) {
      enhancedQuestions = [
        {
          id: 'learning-profile',
          title: 'Learning Profile',
          icon: <Target className="w-4 h-4" />,
          questions: [
            { id: 'level', question: 'What is your current skill level?', type: 'select', options: ['Complete beginner', 'Some experience', 'Intermediate', 'Advanced'], required: true },
            { id: 'timeframe', question: 'How much time can you dedicate per week?', type: 'select', options: ['1-2 hours', '3-5 hours', '6-10 hours', '10+ hours'], required: true },
            { id: 'goal', question: 'What do you want to achieve?', type: 'text', placeholder: 'e.g., Build a mobile app, Get a job, Personal project', required: true },
            { id: 'budget', question: 'What is your learning budget?', type: 'select', options: ['Free resources only', 'Under $50', '$50-200', '$200+'], required: false },
            { id: 'learning-style', question: 'Preferred learning style?', type: 'select', options: ['Video tutorials', 'Reading documentation', 'Hands-on projects', 'Interactive courses'], required: false }
          ]
        },
        {
          id: 'technical-context',
          title: 'Technical Context',
          icon: <Lightbulb className="w-4 h-4" />,
          questions: [
            { id: 'experience', question: 'Previous programming experience?', type: 'text', placeholder: 'e.g., Python, JavaScript, none', required: false },
            { id: 'platform', question: 'Target platform?', type: 'select', options: ['Web', 'Mobile', 'Desktop', 'All platforms'], required: false },
            { id: 'deadline', question: 'Any specific deadline?', type: 'text', placeholder: 'e.g., 3 months, no deadline', required: false }
          ]
        }
      ];
    }

    // Blog enhanced questions
    if (type === 'blog' || lowerProblem.includes('blog')) {
      enhancedQuestions = [
        {
          id: 'content-strategy',
          title: 'Content Strategy',
          icon: <Target className="w-4 h-4" />,
          questions: [
            { id: 'audience', question: 'Who is your target audience?', type: 'text', placeholder: 'e.g., Beginners, Professionals, General public', required: true },
            { id: 'length', question: 'What length are you aiming for?', type: 'select', options: ['Short (500-800 words)', 'Medium (800-1500 words)', 'Long (1500+ words)'], required: true },
            { id: 'style', question: 'What writing style do you prefer?', type: 'select', options: ['Informative', 'Conversational', 'Technical', 'Storytelling'], required: true },
            { id: 'purpose', question: 'What is the main purpose?', type: 'select', options: ['Educate', 'Entertain', 'Persuade', 'Inform'], required: true },
            { id: 'keywords', question: 'Any specific keywords to include?', type: 'text', placeholder: 'e.g., SEO keywords, important terms', required: false }
          ]
        },
        {
          id: 'publishing-context',
          title: 'Publishing Context',
          icon: <Users className="w-4 h-4" />,
          questions: [
            { id: 'platform', question: 'Where will this be published?', type: 'select', options: ['Personal blog', 'Company blog', 'Medium', 'LinkedIn', 'Other'], required: false },
            { id: 'expertise', question: 'Your expertise level on this topic?', type: 'select', options: ['Expert', 'Intermediate', 'Beginner', 'Learning'], required: false },
            { id: 'competitors', question: 'Any competitor content to reference?', type: 'text', placeholder: 'e.g., specific articles or approaches', required: false }
          ]
        }
      ];
    }

    setQuestions(enhancedQuestions);
  };

  const handleAnswerChange = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const generateSmartSuggestions = (questionId, currentValue) => {
    // Generate smart suggestions based on question context
    const suggestions = {
      'duration': ['2 days', '1 week', '2 weeks', '1 month'],
      'reason': ['Family wedding', 'Medical procedure', 'Mental health break', 'Vacation'],
      'level': ['Complete beginner', 'Some experience', 'Intermediate'],
      'audience': ['Beginners', 'Professionals', 'Students', 'General public']
    };
    
    return suggestions[questionId] || [];
  };

  if (questions.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center">
        <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Enhanced Context Questions
        </h3>
      </div>

      {questions.map((section) => (
        <div key={section.id} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded-xl"
          >
            <div className="flex items-center">
              {section.icon}
              <span className="ml-2 text-sm font-medium text-blue-800 dark:text-blue-200">
                {section.title}
              </span>
            </div>
            {expandedSections[section.id] ? (
              <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            )}
          </button>

          {expandedSections[section.id] && (
            <div className="px-4 pb-4 space-y-3">
              {section.questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {question.type === 'text' ? (
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={question.placeholder}
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {/* Smart suggestions */}
                      {answers[question.id] && generateSmartSuggestions(question.id, answers[question.id]).length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {generateSmartSuggestions(question.id, answers[question.id]).map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleAnswerChange(question.id, suggestion)}
                              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <select
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-blue-200 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select an option</option>
                      {question.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EnhancedContextQuestions;
