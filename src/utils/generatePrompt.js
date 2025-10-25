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
