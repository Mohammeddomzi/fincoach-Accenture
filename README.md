# FinCoach - Personal Finance Management App

A comprehensive financial coaching application built with Expo and React Native.

## 🚀 Features

- **Financial Analysis** - Upload CSV data and get AI-powered insights
- **Goal Tracking** - Set and monitor your financial goals
- **Community Hub** - Share tips and connect with other users
- **AI Chatbot** - Get personalized financial advice
- **Settings** - Customize currency, theme, and language preferences

## 🛠️ Tech Stack

- **Frontend**: Expo, React Native, TypeScript
- **UI Library**: Tamagui
- **State Management**: Zustand
- **API**: OpenAI GPT-4
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/fincoach-accenture.git
cd fincoach-accenture
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Add your OpenAI API key
OPENAI_API_KEY=your_openai_api_key_here
EXPO_PUBLIC_API_BASE_URL=https://fincoach-accenture.vercel.app
```

## 🚀 Development

Start the development server:
```bash
npm start
```

For web development:
```bash
npm run web
```

## 🌐 Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
npm run deploy
```

3. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `EXPO_PUBLIC_API_BASE_URL`: https://fincoach-accenture.vercel.app

### Environment Variables

- `OPENAI_API_KEY`: Required for AI chatbot functionality
- `EXPO_PUBLIC_API_BASE_URL`: Base URL for API calls (production URL)

## 📱 Usage

1. **Analysis Page**: Upload financial data or use sample data to get insights
2. **Goals Page**: Create and track your financial goals
3. **Community Page**: Share tips and connect with other users
4. **Advisor Page**: Chat with the AI financial advisor
5. **Settings Page**: Customize your preferences

## 🔧 API Routes

- `/api/chat` - AI chatbot endpoint
- `/api/analyze` - Financial data analysis
- `/api/generate` - Content generation

## 🎯 Production URL

The app is deployed at: https://fincoach-accenture.vercel.app

## 📄 License

This project is licensed under the MIT License.