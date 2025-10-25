# PromptCraft - AI Prompt Generator ✨

A beautiful, responsive web application that helps users craft perfect ChatGPT prompts with intelligent text processing, professional rewriting, and context-aware generation. Built with React 19, Vite, and TailwindCSS.

![PromptCraft](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.11-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.15-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### Core Features
- **8 Prompt Categories**: Email, Coding, Business, Content, Resume, Marketing, UX, and General Help
- **5 Tone Options**: Formal, Friendly, Creative, Technical, and Casual
- **Smart Prompt Generation**: Context-aware templates for each category
- **Real-Time Preview**: Live preview of generated prompts as you type
- **Professional Text Rewriter**: Transform any text into professional, polite language

### Advanced Text Processing
- **Dynamic Spelling Correction**: Uses LanguageTool API for real-time spelling fixes
- **Grammar Enhancement**: Automatic grammar correction and improvement
- **Intelligent Context Detection**: Automatically detects leave requests, email help, complaints, etc.
- **Professional Rewriting**: Context-aware professional language transformation
- **Duplicate Pronoun Prevention**: Smart handling to avoid "i i" or "I I" issues

### User Experience
- **Dark/Light Mode**: Smooth theme transitions with system preference detection
- **Recent History**: Last 5 prompts saved in localStorage
- **Export Functionality**: Download all prompts as JSON
- **Copy to Clipboard**: One-click copy for generated prompts
- **ChatGPT Integration**: Direct link to open prompts in ChatGPT
- **Responsive Design**: Mobile-first, works on all devices
- **Beautiful UI**: Animated gradients, floating orbs, and smooth transitions

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: TailwindCSS with custom animations
- **Icons**: Lucide React
- **Storage**: localStorage for recent prompts
- **Build Tool**: Vite for fast development
- **APIs**: LanguageTool API for spelling/grammar correction

## 📁 Current Repository Structure

```
prompt-generator/
├── public/
│   └── manifest.json              # PWA manifest
├── src/
│   ├── components/
│   │   ├── InputSection.jsx       # Main input form with text processing
│   │   ├── PromptResult.jsx       # Generated prompt display
│   │   ├── RealTimePreview.jsx    # Live preview component
│   │   └── RecentPrompts.jsx      # Recent prompts history
│   ├── utils/
│   │   └── generatePrompt.js      # Core prompt generation logic
│   ├── App.jsx                    # Main application component
│   ├── index.css                  # TailwindCSS styles and animations
│   └── main.jsx                   # React entry point
├── dist/                          # Production build output
├── package.json                   # Project dependencies and scripts
├── package-lock.json              # Dependency lock file
├── README.md                      # This file
├── tailwind.config.js             # TailwindCSS configuration
├── postcss.config.js              # PostCSS configuration
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # TypeScript app configuration
├── tsconfig.node.json              # TypeScript node configuration
└── eslint.config.js               # ESLint configuration
```

## 🔧 How It Works

### 1. Text Processing Pipeline

The application uses a sophisticated text processing pipeline:

```
User Input → Spelling Correction → Professional Rewriting → Grammar Enhancement → Prompt Generation
```

#### Step 1: Spelling Correction
- Uses **LanguageTool API** for dynamic spelling correction
- Handles any misspelling automatically
- Example: `"nnneed heelp"` → `"need help"`

#### Step 2: Professional Rewriting
- **Intelligent Context Detection**: Automatically identifies the type of request
- **Context Types**: Leave requests, email help, complaints, meeting requests, project updates
- **Smart Transformations**: Context-aware professional language improvements
- Example: `"need help writing email"` → `"I would like to request assistance in drafting a professional email"`

#### Step 3: Grammar Enhancement
- Fixes capitalization, punctuation, and sentence structure
- Prevents duplicate pronouns (e.g., "i i" → "I")
- Adds proper spacing and formatting

#### Step 4: Prompt Generation
- Uses the processed text to generate contextually appropriate prompts
- Applies tone and category-specific templates
- Creates professional, actionable prompts

### 2. Context Detection System

The system intelligently detects context from user input:

```javascript
// Example context detection
if (text.includes('leave') || text.includes('vacation')) {
  return { type: 'leave_request', duration: extractDuration(text) };
}
if (text.includes('email') && text.includes('help')) {
  return { type: 'email_help', purpose: extractEmailPurpose(text) };
}
```

### 3. Professional Rewriting Engine

The rewriting engine uses pattern matching and context awareness:

```javascript
// Example transformation
.replace(/\bneed\s+help\s+writing\s+email\b/gi, 
         'I would like to request assistance in drafting a professional email')
```

### 4. Real-Time Preview

- **Debounced Updates**: Prevents excessive API calls while typing
- **Live Processing**: Shows spelling correction and professional rewriting in real-time
- **Contextual Suggestions**: Provides smart suggestions based on detected context

## 🚀 Getting Started

### Prerequisites

- Node.js (v22.3.0 or higher)
- npm (v10.8.1 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TechnoBlogger14o3/prompt-generator.git
cd prompt-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173/prompt-generator/`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## 🎨 Design Features

### Visual Design
- Purple-to-blue gradient theme
- Animated gradient background with floating orbs
- Rounded corners (rounded-3xl) with backdrop blur
- Enhanced shadows for depth
- Bold headings with gradient text effects

### Interactive Elements
- Scale animations (105% selected, 110% hover)
- Glow effects and ring borders
- Pulsing animations for selected items
- Ripple effects on button clicks
- Loading states with spinning icons

### Responsive Design
- Mobile-First approach
- Responsive 3-column layout
- Touch-friendly buttons and touch targets
- Breakpoints: Desktop (1024px+), Tablet (768px-1023px), Mobile (320px-767px)

## 🌟 Usage Examples

### Example 1: Leave Request
**Input**: `"nnneed heelp in wwritng email for 2 daays leave"`

**Processing**:
1. Spelling: `"need help in writing email for 2 days leave"`
2. Professional: `"I would like to request assistance in drafting a professional email to request 2 days of leave"`
3. Prompt: Generates a complete leave request email template

### Example 2: Meeting Request
**Input**: `"need meeting with team"`

**Processing**:
1. Professional: `"I would like to schedule a meeting with the team"`
2. Prompt: Generates a professional meeting request template

### Example 3: Complaint/Feedback
**Input**: `"this is wrong and you need to fix it"`

**Processing**:
1. Professional: `"This appears to be incorrect and it would be beneficial to address it"`
2. Prompt: Generates a polite feedback template

## 🔧 API Integration

### LanguageTool API
- **Purpose**: Spelling and grammar correction
- **Endpoint**: `https://api.languagetool.org/v2/check`
- **Usage**: Free tier, no API key required
- **Fallback**: Local pattern-based correction if API fails

### Error Handling
- Graceful fallback to local corrections
- Console warnings for debugging
- User-friendly error messages

## 🚀 Deployment

### GitHub Pages

The application is currently deployed at: https://technoblogger14o3.github.io/prompt-generator/

1. Update the `homepage` field in `package.json`:
```json
"homepage": "https://technoblogger14o3.github.io/prompt-generator"
```

2. Deploy:
```bash
npm run deploy
```

### Netlify/Vercel

Simply connect your repository and deploy. The build command is `npm run build` and the output directory is `dist`.

## 🧪 Testing

### Local Testing
1. Start development server: `npm run dev`
2. Navigate to `http://localhost:5173/prompt-generator/`
3. Test various inputs:
   - `"nnneed heelp in wwritng email for 2 daays leave"`
   - `"this is wrong and needs fixing"`
   - `"need meeting with team"`

### Production Testing
Visit the live site: https://technoblogger14o3.github.io/prompt-generator/

## 🔮 Future Enhancements

- [ ] Prompt quality scoring and suggestions
- [ ] Prompt templates library with examples
- [ ] Prompt optimization suggestions
- [ ] Enhanced prompt history with search and filtering
- [ ] Prompt sharing and collaboration features
- [ ] Prompt performance analytics
- [ ] Prompt validation and error checking

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for React 19
- Vite team for the amazing build tool
- TailwindCSS for the utility-first CSS framework
- Lucide for the beautiful icons
- LanguageTool for the spelling/grammar API

## 📞 Support

If you encounter any issues or have suggestions, please:
1. Check the [GitHub Issues](https://github.com/TechnoBlogger14o3/prompt-generator/issues)
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

---

**Built with ❤️ by Aman Shekhar • 2025 PromptCraft**

*Transform your ideas into perfect prompts with intelligent text processing and professional rewriting.*