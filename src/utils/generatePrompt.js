// Tone instructions mapping
const TONE_INSTRUCTIONS = {
  formal: 'Use a professional, structured tone.',
  friendly: 'Use a warm, approachable tone.',
  creative: 'Use an imaginative, engaging tone.',
  technical: 'Use a detailed, precise tone.',
  casual: 'Use a relaxed, conversational tone.'
};

// Intelligent prompt type detection based on keywords
const detectPromptType = (problem, selectedType) => {
  const lowerProblem = problem.toLowerCase();
  
  // Presentation/Slides keywords
  const presentationKeywords = ['slide', 'slides', 'presentation', 'townhall', 'town hall', 'meeting', 'pitch', 'deck', 'powerpoint', 'ppt', 'speech', 'address'];
  
  // HR keywords
  const hrKeywords = ['hr', 'human resources', 'employee', 'employees', 'staff', 'workforce', 'recruitment', 'hiring', 'training', 'performance'];
  
  // Check for presentation context
  if (presentationKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'presentation';
  }
  
  // Check for HR context
  if (hrKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'hr';
  }
  
  // Return the selected type if no specific context detected
  return selectedType;
};

// Generate the final prompt with detailed templates
export const generatePrompt = (problem, promptType, tone) => {
  if (!problem.trim()) {
    return {
      system: "Please enter a description of what you need help with.",
      prompt: "Please describe your problem to generate a prompt."
    };
  }

  // Use intelligent detection to override the selected type
  const detectedType = detectPromptType(problem, promptType);
  const baseInstructions = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.friendly;
  let systemPrompt = "";
  let userPrompt = "";

  switch (detectedType) {
    case 'email':
      systemPrompt = "You are an expert email writer.";
      userPrompt = `Write a professional email based on this request: "${problem}".
${baseInstructions}
Structure the email with:
- Appropriate greeting
- Clear subject line
- Main message body with all necessary details
- Professional closing
- Proper email etiquette

Make it ready to send and include all relevant information the recipient needs.`;
      break;
    
    case 'coding':
      systemPrompt = "You are an expert software developer and coding instructor.";
      userPrompt = `Help solve this coding problem: "${problem}".
${baseInstructions}
Provide:
- Step-by-step solution approach
- Complete code examples with comments
- Explanation of the logic and algorithms used
- Best practices and optimization tips
- Error handling and edge cases
- Testing suggestions

Make the solution clear, well-documented, and production-ready.`;
      break;
    
    case 'business':
      systemPrompt = "You are a business strategy consultant and startup advisor.";
      userPrompt = `Create a comprehensive business plan for: "${problem}".
${baseInstructions}
Include:
- Executive summary
- Market analysis and target audience
- Competitive landscape
- Revenue model and pricing strategy
- Marketing and sales approach
- Operations plan
- Financial projections
- Risk assessment and mitigation
- Implementation timeline

Make it actionable, realistic, and investor-ready.`;
      break;
    
    case 'content':
      systemPrompt = "You are a professional content creator and social media strategist.";
      userPrompt = `Create engaging content for: "${problem}".
${baseInstructions}
Develop:
- Compelling headline/title
- Structured content outline
- Engaging copy for the main content
- Call-to-action
- Content variations for different platforms
- SEO optimization suggestions
- Engagement strategies

Make it shareable, engaging, and platform-optimized.`;
      break;
    
    case 'resume':
      systemPrompt = "You are a professional resume writer and career coach.";
      userPrompt = `Help optimize a resume for: "${problem}".
${baseInstructions}
Focus on:
- Professional summary/objective
- Skills section optimization
- Achievement-focused bullet points
- Action verbs and quantifiable results
- ATS-friendly formatting
- Industry-specific keywords
- Cover letter suggestions
- Interview preparation tips

Make it stand out to recruiters and pass ATS systems.`;
      break;
    
    case 'marketing':
      systemPrompt = "You are a marketing copywriter and brand strategist.";
      userPrompt = `Create compelling marketing materials for: "${problem}".
${baseInstructions}
Develop:
- Attention-grabbing headlines
- Persuasive copy that converts
- Emotional triggers and benefits
- Call-to-action statements
- Multiple variations for A/B testing
- Brand voice consistency
- Target audience messaging
- Conversion optimization tips

Make it persuasive, memorable, and conversion-focused.`;
      break;
    
    case 'ux':
      systemPrompt = "You are a UX writer and user experience designer.";
      userPrompt = `Design user-centered copy for: "${problem}".
${baseInstructions}
Create:
- Clear, concise interface text
- User-friendly error messages
- Helpful microcopy and tooltips
- Accessible language for all users
- Consistent tone and voice
- User journey optimization
- Conversion-focused messaging
- Accessibility considerations

Make it intuitive, helpful, and user-friendly.`;
      break;
    
    case 'presentation':
      systemPrompt = "You are an expert presentation designer and corporate communications specialist.";
      userPrompt = `Create a compelling presentation for: "${problem}".
${baseInstructions}
Develop:
- Clear, engaging slide content
- Logical flow and structure
- Key talking points for each slide
- Visual suggestions and layout ideas
- Audience-appropriate messaging
- Call-to-action or next steps
- Speaker notes and delivery tips
- Time management recommendations

Make it professional, engaging, and ready for delivery.`;
      break;
    
    case 'hr':
      systemPrompt = "You are an HR specialist and employee communications expert.";
      userPrompt = `Create HR-focused content for: "${problem}".
${baseInstructions}
Develop:
- Employee-centered messaging
- Clear communication strategy
- Appropriate tone for internal audience
- Actionable information and next steps
- Compliance considerations
- Engagement and participation elements
- Follow-up and feedback mechanisms
- Cultural sensitivity and inclusivity

Make it clear, engaging, and aligned with HR best practices.`;
      break;
    
    case 'general':
    default:
      systemPrompt = "You are an expert problem-solver and consultant.";
      userPrompt = `Provide comprehensive assistance with: "${problem}".
${baseInstructions}
Deliver:
- Detailed problem analysis
- Multiple solution approaches
- Step-by-step implementation guide
- Practical examples and case studies
- Potential challenges and solutions
- Best practices and recommendations
- Resources for further learning
- Success metrics and evaluation

Make it thorough, practical, and immediately actionable.`;
      break;
  }
  
  return {
    system: systemPrompt,
    prompt: userPrompt
  };
};

// Save prompt to local storage
export const saveToHistory = (promptData) => {
  const history = getHistory();
  const newPrompt = {
    id: Date.now(),
    ...promptData,
    timestamp: new Date().toISOString()
  };
  
  // Keep only the last 5 prompts
  const updatedHistory = [newPrompt, ...history].slice(0, 5);
  localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
  return updatedHistory;
};

// Get prompt history from local storage
export const getHistory = () => {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem('promptHistory');
  return history ? JSON.parse(history) : [];
};

// Clear prompt history
export const clearHistory = () => {
  localStorage.removeItem('promptHistory');
  return [];
};

// Export prompts as formatted text
export const exportPromptsAsText = () => {
  const history = getHistory();
  if (history.length === 0) {
    return 'No prompts to export.';
  }
  
  let exportText = 'PromptCraft - Exported Prompts\n';
  exportText += '='.repeat(50) + '\n\n';
  
  history.forEach((entry, index) => {
    exportText += `${index + 1}. ${entry.type || 'General Help'}\n`;
    exportText += `Problem: ${entry.problem}\n`;
    exportText += `Tone: ${entry.tone}\n`;
    exportText += `Generated: ${new Date(entry.timestamp).toLocaleString()}\n`;
    exportText += `\nSystem Prompt:\n${entry.system}\n`;
    exportText += `\nUser Prompt:\n${entry.prompt}\n`;
    exportText += '-'.repeat(50) + '\n\n';
  });
  
  return exportText;
};
