# FinCoach Production Deployment Guide

## 🚀 Production API Configuration

### 1. Environment Variables

Create a `.env` file in your project root with:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_actual_openai_api_key_here

# Production API Base URL
EXPO_PUBLIC_API_BASE_URL=https://your-production-domain.com

# Environment
NODE_ENV=production
```

### 2. Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# OPENAI_API_KEY=your_key_here
# EXPO_PUBLIC_API_BASE_URL=https://your-app.vercel.app
```

#### Netlify
```bash
# Build for production
npm run build

# Deploy to Netlify
# Set environment variables in Netlify dashboard
```

#### Railway
```bash
# Connect your GitHub repo to Railway
# Set environment variables in Railway dashboard
```

### 3. API Routes Configuration

The app is configured with:
- ✅ `app.config.ts` set to `output: "server"` for API routes
- ✅ Fallback responses when API key is missing
- ✅ Production URL detection
- ✅ Error handling for network issues

### 4. Testing Production API

1. **With API Key**: Full AI responses using OpenAI
2. **Without API Key**: Intelligent fallback responses
3. **Network Issues**: Graceful fallback to local responses

### 5. Environment-Specific Behavior

#### Development
- Uses local API: `http://localhost:8081/api/chat`
- Falls back to intelligent responses if API fails

#### Production
- Uses production API: `https://your-domain.com/api/chat`
- Falls back to intelligent responses if API fails
- Works with or without API keys

### 6. Fallback Response Examples

**Budgeting Question:**
```
Here's a simple budgeting approach for SAR:
• 50/30/20 Rule: 50% needs, 30% wants, 20% savings
• Track expenses for 30 days
• Set monthly limits for each category
• Use apps to monitor transactions

30-Day Plan:
1. Week 1: Track all expenses
2. Week 2: Categorize spending
3. Week 3: Set realistic limits
4. Week 4: Adjust and optimize

*Educational purposes, not financial advice.*
```

### 7. Deployment Checklist

- [ ] Set `OPENAI_API_KEY` in production environment
- [ ] Set `EXPO_PUBLIC_API_BASE_URL` to your production domain
- [ ] Test API endpoints in production
- [ ] Verify fallback responses work
- [ ] Test chatbot functionality
- [ ] Verify all pages load correctly

### 8. Troubleshooting

#### API Not Working
- Check environment variables are set
- Verify API key is valid
- Check network connectivity
- Fallback responses will activate automatically

#### CORS Issues
- API routes are configured for production
- Fallback system handles network errors
- No CORS configuration needed

#### Build Errors
- Ensure `app.config.ts` has `output: "server"`
- Check all dependencies are installed
- Verify TypeScript compilation

## 🎯 Result

Your FinCoach app will work in production with:
- ✅ Full AI chatbot (with API key)
- ✅ Intelligent fallback responses (without API key)
- ✅ All features functional
- ✅ No crashes or errors
- ✅ Production-ready deployment
