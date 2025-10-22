# PromptCraft - AI Prompt Generator ✨

A beautiful, responsive web application that helps users craft perfect ChatGPT prompts based on their problem and desired context. Built with React 19, Vite, and TailwindCSS.

![PromptCraft](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.11-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.15-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

- **8 Prompt Categories**: Email, Coding, Business, Content, Resume, Marketing, UX, and General Help
- **5 Tone Options**: Formal, Friendly, Creative, Technical, and Casual
- **Smart Prompt Generation**: Context-aware templates for each category
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

## 📁 Project Structure

```
src/
├── App.jsx                 # Main application component
├── components/
│   ├── InputSection.jsx   # Problem input and type selection
│   ├── PromptResult.jsx   # Generated prompt display
│   └── RecentPrompts.jsx  # Recent prompts history
├── utils/
│   └── generatePrompt.js  # Prompt generation logic
└── index.css              # TailwindCSS styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v22.3.0 or higher)
- npm (v10.8.1 or higher)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
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

4. Open your browser and navigate to `http://localhost:3000`

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

## 🌟 Usage

1. **Describe your problem** in the textarea (max 500 characters)
2. **Select a prompt type** from 8 categories
3. **Choose a tone** from 5 options
4. **Click "Generate Perfect Prompt"**
5. **Copy** the generated prompt or **open in ChatGPT**
6. **View recent prompts** in the history section

## 🚀 Deployment

### GitHub Pages

1. Update the `homepage` field in `package.json`:
```json
"homepage": "https://yourusername.github.io/prompt-generator"
```

2. Deploy:
```bash
npm run deploy
```

### Netlify/Vercel

Simply connect your repository and deploy. The build command is `npm run build` and the output directory is `dist`.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for React 19
- Vite team for the amazing build tool
- TailwindCSS for the utility-first CSS framework
- Lucide for the beautiful icons

---

Built with ❤️ using React, Vite, and TailwindCSS
