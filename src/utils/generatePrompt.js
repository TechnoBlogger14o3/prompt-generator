import { enhancePromptWithSmallLlm, isLlmConfigured } from './llmEnhancePrompt';

// Human-readable labels for detected template types (used for LLM context)
const PROMPT_TYPE_LABELS = {
  leave: 'Leave Request',
  learning: 'Learning Guide',
  blog: 'Blog Writing',
  'app-idea': 'App Ideas',
  'image-generation': 'AI Images',
  email: 'Email Writing',
  coding: 'Coding Help',
  business: 'Business Plan',
  content: 'Content Creation',
  resume: 'Resume',
  marketing: 'Marketing Copy',
  ux: 'UX Writing',
  presentation: 'Presentations',
  hr: 'HR Communications',
  general: 'General Help'
};

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
    console.warn('Spelling API failed:', error.message);
    return text;
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

// Detect specific learning topics for enhanced prompt generation
const detectLearningTopic = (text) => {
  const lowerText = text.toLowerCase();
  
  // System design detection
  if (lowerText.includes('system design') || lowerText.includes('system-design') || 
      lowerText.includes('systemdesign') || (lowerText.includes('system') && lowerText.includes('design'))) {
    return { 
      topic: 'system_design', 
      specificTopic: 'system design',
      language: null
    };
  }
  
  // Programming/Coding detection
  const codingKeywords = ['coding', 'programming', 'code', 'developer', 'software engineering', 'software development'];
  const languageKeywords = {
    'javascript': 'JavaScript',
    'python': 'Python',
    'java': 'Java',
    'react': 'React',
    'node': 'Node.js',
    'typescript': 'TypeScript',
    'go': 'Go',
    'rust': 'Rust',
    'cpp': 'C++',
    'c++': 'C++',
    'c#': 'C#',
    'csharp': 'C#',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'php': 'PHP',
    'ruby': 'Ruby'
  };
  
  if (codingKeywords.some(keyword => lowerText.includes(keyword))) {
    let detectedLanguage = null;
    for (const [key, value] of Object.entries(languageKeywords)) {
      if (lowerText.includes(key)) {
        detectedLanguage = value;
        break;
      }
    }
    
    return { 
      topic: 'coding', 
      specificTopic: detectedLanguage || 'programming',
      language: detectedLanguage
    };
  }
  
  // Machine Learning / AI
  if (lowerText.includes('machine learning') || lowerText.includes('ml') || 
      lowerText.includes('ai') || lowerText.includes('artificial intelligence') ||
      lowerText.includes('deep learning') || lowerText.includes('neural network')) {
    return { 
      topic: 'ml_ai', 
      specificTopic: 'machine learning and AI',
      language: 'Python'
    };
  }
  
  // Data structures and algorithms
  if (lowerText.includes('data structure') || lowerText.includes('algorithm') ||
      lowerText.includes('dsa') || lowerText.includes('leetcode')) {
    return { 
      topic: 'dsa', 
      specificTopic: 'data structures and algorithms',
      language: null
    };
  }
  
  // Extract the main topic from the text
  const topicMatch = lowerText.match(/(?:learn|learning|study|master|understand)\s+(.+?)(?:,|$|from|to)/);
  const specificTopic = topicMatch ? topicMatch[1].trim() : null;
  
  return { 
    topic: 'general', 
    specificTopic: specificTopic || null,
    language: null
  };
};

// Transform functions - return text as-is, let API handle all corrections
const transformLeaveRequest = (text, context) => {
  return text;
};

const transformEmailHelp = (text, context) => {
  return text;
};

const transformGeneralHelp = (text, context) => {
  return text;
};

const transformComplaintFeedback = (text, context) => {
  return text;
};

const transformMeetingRequest = (text, context) => {
  return text;
};

const transformProjectUpdate = (text, context) => {
  return text;
};

const transformGeneric = (text, context) => {
  return text;
};

// Auto-rewrite user input - use API only, no hardcoded patterns
const autoRewriteInput = async (text) => {
  if (!text.trim()) return text;
  
  // Apply spelling correction using API
  let rewritten = await correctSpelling(text);
  
  // Apply professional rewriting using API
  rewritten = await professionalRewriteAPI(rewritten);
  
  return rewritten;
};

/**
 * @param {string} problem
 * @param {string} promptType
 * @param {string} tone
 * @param {{ useLlm?: boolean }} [options] - Set useLlm: false to skip optional LLM refinement (e.g. live preview).
 */
export const generatePrompt = async (problem, promptType, tone, options = {}) => {
  if (!problem.trim()) {
    return {
      system: "Please enter a description of what you need help with.",
      prompt: "Please describe your problem to generate a prompt."
    };
  }

  // Use the problem as-is since it's already been corrected in InputSection
  // Only apply minimal formatting if needed
  const rewrittenProblem = problem.trim();
  
  // Use intelligent detection on the corrected text to override the selected type
  const detectedType = detectPromptType(rewrittenProblem, promptType);
  const baseInstructions = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.friendly;
  
  let systemPrompt = "";
  let userPrompt = "";

  switch (detectedType) {
    case 'leave':
      systemPrompt = "You are an expert email writer specializing in workplace communications.";
      userPrompt = `Write a professional and polite email requesting leave from work based on this request: "${rewrittenProblem}".
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
      // Detect specific learning topics for enhanced prompts
      const lowerProblem = rewrittenProblem.toLowerCase();
      let learningContext = detectLearningTopic(lowerProblem);
      
      if (learningContext.topic === 'system_design') {
        systemPrompt = "You are a senior system design interviewer from a top tech company.";
        userPrompt = `My goal is to master system design from fundamentals to advanced level, with a strong focus on real-world, scalable systems and interview readiness.

Teach me system design in a step-by-step curriculum. For each topic:

1. Explain the core concept clearly (assume I know backend basics).
2. Use real-world analogies where helpful.
3. Show how this concept is used in production systems.
4. Explain trade-offs and when NOT to use it.
5. Cover common interview questions related to this concept.
6. Highlight common mistakes candidates make.
7. Provide a mini design exercise (with expected approach, not full solution).
8. Mention metrics, bottlenecks, and failure scenarios.

Learning progression:
- Start from system design fundamentals
- Move to scalability, reliability, and performance
- Then cover distributed systems patterns
- Finally, do full system design case studies

Core topics to include (in this order):
1. Requirements gathering & capacity estimation
2. High-level architecture & API design
3. Databases (SQL vs NoSQL, sharding, replication)
4. Caching (CDN, Redis, cache eviction strategies)
5. Load balancing & traffic routing
6. Messaging systems (Kafka, queues, streams)
7. Consistency models & CAP theorem
8. Distributed transactions & idempotency
9. Microservices vs monolith
10. Observability (logging, metrics, tracing)
11. Security & authentication
12. Failure handling & disaster recovery

Case studies to design deeply:
- URL Shortener
- News Feed
- Chat Application
- Ride-sharing system
- Payment system

Rules:
- Be concise but thorough
- Use diagrams in text form when helpful
- Always think like an interviewer
- Ask me clarifying questions when appropriate
- After each section, ask if I want to go deeper or move on`;
      } else if (learningContext.topic === 'coding' || learningContext.topic === 'programming') {
        systemPrompt = `You are a senior software engineer and coding instructor from a top tech company, specializing in ${learningContext.specificTopic || 'programming'}.`;
        userPrompt = `My goal is to master ${learningContext.specificTopic || 'programming'} from fundamentals to advanced level, with a strong focus on real-world applications and interview readiness.

Teach me ${learningContext.specificTopic || 'programming'} in a step-by-step curriculum. For each topic:

1. Explain the core concept clearly with examples.
2. Show how this concept is used in real-world applications.
3. Explain best practices and common patterns.
4. Cover common interview questions and coding challenges.
5. Highlight common mistakes and how to avoid them.
6. Provide hands-on exercises with expected approaches.
7. Discuss performance considerations and optimization.
8. Include code examples in ${learningContext.language || 'the most appropriate language'}.

Learning progression:
- Start from fundamentals and core concepts
- Move to intermediate patterns and techniques
- Then cover advanced topics and optimization
- Finally, work on real-world projects and interview preparation

Rules:
- Be concise but thorough
- Provide code examples where helpful
- Always think like an interviewer
- Ask me clarifying questions when appropriate
- After each section, ask if I want to go deeper or move on`;
      } else {
        // Generic learning prompt - comprehensive and detailed
        systemPrompt = `You are an expert educator and learning specialist with deep knowledge in ${learningContext.specificTopic || 'the subject matter'}.`;
        userPrompt = `My goal is to master ${learningContext.specificTopic || rewrittenProblem} from fundamentals to advanced level.

Teach me ${learningContext.specificTopic || rewrittenProblem} in a comprehensive, step-by-step curriculum. For each topic:

1. Explain the core concept clearly and thoroughly.
2. Use real-world examples and analogies where helpful.
3. Show practical applications and use cases.
4. Explain best practices and common patterns.
5. Cover important interview questions or assessment criteria related to this concept.
6. Highlight common mistakes and how to avoid them.
7. Provide practical exercises or mini-projects.
8. Discuss advanced considerations, trade-offs, and optimization.

Learning progression:
- Start from fundamentals and prerequisites
- Move to core concepts and intermediate topics
- Then cover advanced topics and real-world applications
- Finally, work on comprehensive projects and assessments

Structure your teaching:
- Be concise but thorough
- Use examples and analogies when helpful
- Always think like an expert instructor
- Ask me clarifying questions when appropriate
- After each section, ask if I want to go deeper or move on
- Provide actionable next steps

Make it engaging, structured, and suitable for comprehensive learning.`;
      }
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

  const templateResult = {
    system: systemPrompt,
    prompt: userPrompt
  };

  const shouldUseLlm = options.useLlm !== false && isLlmConfigured();
  if (!shouldUseLlm) {
    return templateResult;
  }

  try {
    const typeLabel = PROMPT_TYPE_LABELS[detectedType] || promptType;
    return await enhancePromptWithSmallLlm({
      problem: rewrittenProblem,
      promptTypeLabel: typeLabel,
      tone,
      draftSystem: systemPrompt,
      draftUser: userPrompt
    });
  } catch (e) {
    console.warn('LLM prompt refinement failed, using template:', e?.message || e);
    return templateResult;
  }
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

const sanitizeForFilename = (value) => {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Format a single prompt entry as Markdown.
export const formatPromptEntryAsMarkdown = (entry) => {
  if (!entry) return '';

  const problem = entry.problem || '';
  const type = entry.type || 'General Help';
  const tone = entry.tone || 'friendly';
  const system = entry.system || '';
  const prompt = entry.prompt || '';
  const timestamp = entry.timestamp ? new Date(entry.timestamp) : null;

  const generatedLine = timestamp ? timestamp.toLocaleString() : '';
  const generatedMeta = generatedLine ? `- Generated: ${generatedLine}\n` : '';

  return [
    `# PromptCraft - Generated Prompt`,
    ``,
    `- Type: ${type}`,
    `- Tone: ${tone}`,
    generatedMeta.trimEnd(),
    ``,
    `## Problem`,
    problem ? `\`\`\`text\n${problem}\n\`\`\`` : '',
    ``,
    `## System Prompt`,
    `\`\`\`text\n${system}\n\`\`\``,
    ``,
    `## User Prompt`,
    `\`\`\`text\n${prompt}\n\`\`\``,
    ``,
    `---`,
    `Source: prompt-generator`,
    ``,
    // Keep a stable trailing newline for nicer UX when downloading.
    ''
  ]
    .filter(Boolean)
    .join('\n');
};

// Export all prompts as a single Markdown file.
export const exportPromptsAsMarkdown = () => {
  const history = getHistory();
  if (history.length === 0) {
    return '# PromptCraft - Exported Prompts\n\n_No prompts to export._\n';
  }

  const intro = [`# PromptCraft - Exported Prompts`, ``].join('\n');
  const body = history
    .map((entry, index) => {
      const md = formatPromptEntryAsMarkdown(entry);
      // Add an index label without touching the inner formatting.
      return md.replace('# PromptCraft - Generated Prompt', `# ${index + 1}. PromptCraft - Generated Prompt`);
    })
    .join('\n\n');

  return `${intro}${body}`;
};

export const getPromptMarkdownFilename = (promptData) => {
  const datePart = new Date().toISOString().split('T')[0];
  const slug = sanitizeForFilename(promptData?.type || 'prompt');
  return `promptcraft-${slug || 'prompt'}-${datePart}.md`;
};
