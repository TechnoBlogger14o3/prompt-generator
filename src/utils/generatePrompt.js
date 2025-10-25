// Tone instructions mapping
const TONE_INSTRUCTIONS = {
  formal: 'Use a professional, structured tone.',
  friendly: 'Use a warm, approachable tone.',
  creative: 'Use an imaginative, engaging tone.',
  technical: 'Use a detailed, precise tone.',
  casual: 'Use a relaxed, conversational tone.'
};

// Intelligent prompt type detection based on keywords and context
const detectPromptType = (problem, selectedType) => {
  const lowerProblem = problem.toLowerCase();
  
  // Leave/Time-off keywords
  const leaveKeywords = ['leave', 'vacation', 'time off', 'sick leave', 'personal leave', 'days off', 'absence'];
  
  // Learning keywords
  const learningKeywords = ['learn', 'learning', 'study', 'course', 'tutorial', 'guide', 'roadmap', 'beginner', 'how to'];
  
  // Blog keywords
  const blogKeywords = ['blog', 'article', 'post', 'write about', 'benefits of', 'advantages of', 'why'];
  
  // App idea keywords
  const appKeywords = ['app for', 'app idea', 'mobile app', 'application for', 'tracking app', 'expense tracker'];
  
  // Image generation keywords
  const imageKeywords = ['image', 'picture', 'photo', 'visual', 'generate image', 'create image', 'ai image', 'futuristic', 'cinematic'];
  
  // Presentation/Slides keywords
  const presentationKeywords = ['slide', 'slides', 'presentation', 'townhall', 'town hall', 'meeting', 'pitch', 'deck', 'powerpoint', 'ppt', 'speech', 'address'];
  
  // HR keywords
  const hrKeywords = ['hr', 'human resources', 'employee', 'employees', 'staff', 'workforce', 'recruitment', 'hiring', 'training', 'performance'];
  
  // Check for specific contexts first
  if (leaveKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'leave';
  }
  
  if (learningKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'learning';
  }
  
  if (blogKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'blog';
  }
  
  if (appKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'app-idea';
  }
  
  if (imageKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'image-generation';
  }
  
  if (presentationKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'presentation';
  }
  
  if (hrKeywords.some(keyword => lowerProblem.includes(keyword))) {
    return 'hr';
  }
  
  // Return the selected type if no specific context detected
  return selectedType;
};

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

// Auto-rewrite user input for better clarity with spelling and grammar corrections
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
    .replace(/\bthere\b/gi, 'their') // Context-dependent, but common mistake
    .replace(/\byour\b/gi, 'you are') // When used incorrectly
    .replace(/\bits\b/gi, 'it is') // When used incorrectly
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
  
  // Auto-rewrite the user input for better clarity
  const rewrittenProblem = autoRewriteInput(problem);
  
  let systemPrompt = "";
  let userPrompt = "";

  switch (detectedType) {
    case 'leave':
      systemPrompt = "You are an expert email writer specializing in workplace communications.";
      userPrompt = `Write a professional and polite email requesting leave from work for: "Write a short and professional email requesting ${rewrittenProblem.toLowerCase().replace(/[.!?]$/, '')}. The tone should be polite and formal, suitable for sending to my manager.".
${baseInstructions}
Requirements:
- Make the tone respectful and concise
- Include a clear subject line
- Mention the duration and reason for leave (if appropriate)
- Keep it suitable for a workplace email
- Include proper greeting and closing
- Ensure it follows professional email etiquette

Make it ready to send and professional.`;
      break;
    
    case 'learning':
      systemPrompt = "You are an expert educator and learning specialist with deep knowledge in the subject matter.";
      userPrompt = `Create a comprehensive learning roadmap for: "${rewrittenProblem}".
${baseInstructions}
Provide:
- Step-by-step learning path from beginner to advanced
- Prerequisites and fundamentals to master first
- Core topics and concepts to cover
- Intermediate and advanced topics
- Essential tools, resources, and technologies to learn
- Practical projects to build at each stage
- Recommended learning resources (docs, videos, courses, books)
- Time estimates for each learning phase
- Tips for staying consistent and motivated
- Common pitfalls to avoid

Make it actionable, structured, and suitable for self-paced learning.`;
      break;
    
    case 'blog':
      systemPrompt = "You are a skilled content writer and blogger with expertise in creating engaging articles.";
      userPrompt = `Write a detailed and engaging blog post about: "${rewrittenProblem}".
${baseInstructions}
Create:
- Compelling headline and introduction
- Well-structured content with clear sections
- Engaging and informative body paragraphs
- Practical examples and real-world applications
- Data and statistics to support points (if relevant)
- Personal anecdotes or case studies
- Actionable takeaways for readers
- Strong conclusion with call-to-action
- SEO-friendly structure and keywords

Make it shareable, valuable, and engaging for readers.`;
      break;
    
    case 'app-idea':
      systemPrompt = "You are a product designer and mobile app strategist with experience in user-centered design.";
      userPrompt = `Design a comprehensive app concept for: "${problem}".
${baseInstructions}
Develop:
- Clear app concept and value proposition
- Target audience and user personas
- Core features and functionality
- User experience flow and navigation
- UI/UX design considerations
- Technical requirements and platform recommendations
- Monetization strategy (if applicable)
- Competitive analysis and differentiation
- Development phases and MVP features
- Success metrics and KPIs

Make it detailed, realistic, and ready for development planning.`;
      break;
    
    case 'image-generation':
      systemPrompt = "You are an AI image generation specialist with expertise in creating detailed visual prompts.";
      userPrompt = `Generate a detailed AI image prompt for: "${problem}".
${baseInstructions}
Create:
- Detailed visual description with specific elements
- Style and aesthetic direction (photorealistic, artistic, cinematic, etc.)
- Color palette and mood
- Composition and framing details
- Lighting and atmosphere
- Technical specifications (resolution, aspect ratio)
- Artistic style references if applicable
- Quality and detail specifications

Make it specific enough to generate high-quality, accurate images.`;
      break;
    
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
