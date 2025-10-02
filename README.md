# FinCoach - AI Financial Advisor

A comprehensive Expo React Native app that provides AI-powered financial advice, goal tracking, and expense analysis.

## Features

### 🤖 AI Financial Advisor

- Real-time chat with OpenAI-powered financial advisor
- Streaming responses for better user experience
- Offline message queuing with automatic sync when online
- Educational disclaimers and professional guidance

### 🎯 Financial Goals

- Create and track multiple financial goals
- Realistic savings plan calculation
- Progress tracking with visual indicators
- Goal completion and editing capabilities

### 📊 Expense Analysis

- CSV file upload and parsing (up to 10,000 rows)
- AI-powered financial insights and recommendations
- Key metrics visualization
- Category breakdown and spending analysis

### ⚙️ Settings & Customization

- Multiple currency support (SAR, USD, EUR, GBP, JPY)
- Dark theme with system preference support
- Data management and reset options
- Locale detection

## Tech Stack

- **Framework**: Expo React Native with TypeScript
- **Navigation**: Expo Router with tab-based navigation
- **UI**: Tamagui with dark theme
- **Storage**: AsyncStorage for local data persistence
- **AI**: OpenAI API integration with streaming responses
- **CSV Processing**: PapaParse for file parsing
- **Monitoring**: Sentry for error tracking
- **Networking**: Custom offline queue system

## Getting Started

### Prerequisites

- Node.js 20.19.4 or higher
- Expo CLI
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd fincoach
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

4. Update app.json with your EAS hosting domain:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://your-eas-hosting-domain.com"
        }
      ]
    ],
    "extra": {
      "router": {
        "origin": "https://your-eas-hosting-domain.com"
      }
    }
  }
}
```

### Running the App

#### Development

```bash
# Start the development server
npx expo start

# Run on specific platforms
npx expo start --web
npx expo start --ios
npx expo start --android
```

#### Production Build

```bash
# Build for web
npx expo build:web

# Build for mobile (requires EAS)
npx eas build --platform all
```

## Project Structure

```
fincoach/
├── app/
│   ├── (tabs)/
│   │   ├── advisor.tsx      # AI chat interface
│   │   ├── goals.tsx       # Financial goals management
│   │   ├── analysis.tsx     # CSV analysis and insights
│   │   ├── settings.tsx    # App settings and preferences
│   │   └── _layout.tsx     # Tab navigation layout
│   ├── api/
│   │   ├── chat+api.ts     # OpenAI chat API endpoint
│   │   └── analyze+api.ts   # CSV analysis API endpoint
│   ├── _layout.tsx         # Root layout with Tamagui
│   └── index.tsx           # App entry point
├── lib/
│   ├── ai.ts              # AI API helpers and storage
│   ├── csv.ts             # CSV processing utilities
│   ├── goals.ts           # Goal calculation logic
│   ├── currency.ts        # Currency formatting
│   ├── offlineQueue.ts    # Offline message queuing
│   ├── net.ts             # Network status detection
│   └── sentry.ts          # Error monitoring setup
├── components/
│   ├── ChatView.tsx       # Chat interface component
│   ├── GoalCard.tsx       # Goal display component
│   └── MetricCard.tsx     # Metrics display component
├── assets/
│   └── sample.csv         # Sample CSV file
├── types.ts               # TypeScript type definitions
├── tamagui.config.ts      # Tamagui configuration
└── app.json               # Expo configuration
```

## API Routes

### `/api/chat`

- **Method**: POST
- **Body**: `{ message: string }`
- **Response**: Streaming text response from OpenAI
- **Purpose**: Handles chat messages with AI financial advisor

### `/api/analyze`

- **Method**: POST
- **Body**: `{ summary: object }`
- **Response**: `{ analysis: string }`
- **Purpose**: Analyzes CSV data and provides financial insights

## Key Features Explained

### Offline Support

- Messages are queued when offline
- Automatic sync when connection is restored
- Visual indicators for offline status

### Goal Planning

- Realistic savings calculations based on income assumptions
- Visual progress tracking
- Deadline management and suggestions

### CSV Analysis

- Supports up to 10,000 rows
- Automatic data type detection
- AI-powered insights and recommendations
- Sample CSV template provided

### Security

- OpenAI API key stored server-side only
- No sensitive data in client code
- Proper error handling and validation

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key

### App Configuration

- Update `app.json` with your production domain
- Configure Sentry DSN in `lib/sentry.ts`
- Customize Tamagui theme in `tamagui.config.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Check the documentation
- Open an issue on GitHub
- Contact the development team

## Disclaimer

This app is for educational purposes only and does not provide professional financial advice. Always consult with qualified financial professionals for important financial decisions.
