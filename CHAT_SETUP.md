# Chat API Setup

## OpenAI API Key Configuration

To enable the full AI chat functionality, you need to set up an OpenAI API key:

### Option 1: Environment Variable (Recommended)
1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in your project root
3. Add your API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### Option 2: Direct Configuration
1. Open `app/api/chat+api.ts`
2. Replace `process.env.OPENAI_API_KEY` with your actual API key (not recommended for production)

## Fallback Mode

If no API key is configured, the app will use intelligent fallback responses that:
- Analyze the user's question for keywords
- Provide contextual financial advice based on the question type
- Use the selected currency (SAR, USD, EUR, AED)
- Cover topics like budgeting, savings, debt, investments, and goal setting

## Testing the Chat

1. **With API Key**: Full AI-powered responses using GPT-4o-mini
2. **Without API Key**: Intelligent keyword-based responses covering:
   - Budget management
   - Emergency funds
   - Debt reduction
   - Investment basics
   - Goal setting
   - General financial advice

The chat will automatically detect whether an API key is available and use the appropriate response system.

