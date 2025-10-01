# FinCoach Vercel Deployment Guide

This guide will help you deploy your FinCoach Expo Router app to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **OpenAI API Key**: Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's an Expo project
5. Configure the following settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### 3. Configure Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `OPENAI_API_KEY` | `your_openai_api_key` | Required for AI features |
| `NODE_ENV` | `production` | App environment |

### 4. Configure Domain (Optional)

1. In Vercel dashboard, go to "Domains"
2. Add your custom domain if you have one
3. Follow the DNS configuration instructions

## Project Structure

The deployment uses the following configuration:

- **`vercel.json`**: Vercel deployment configuration
- **`app.config.ts`**: Updated for static export
- **`package.json`**: Added Vercel build scripts
- **`env.example`**: Environment variables template

## API Routes

Your app includes the following API routes that will work on Vercel:

- `/api/analyze` - Financial data analysis
- `/api/chat` - AI chat functionality  
- `/api/generate` - Content generation

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **API Errors**: Verify `OPENAI_API_KEY` is set correctly
3. **Routing Issues**: Ensure `vercel.json` configuration is correct

### Build Logs

Check build logs in Vercel dashboard:
1. Go to your project
2. Click on the latest deployment
3. View build logs for any errors

### Local Testing

Test your build locally:

```bash
npm run vercel-build
```

This will create a `dist` folder with the static export.

## Performance Optimization

- **Static Export**: The app uses static export for better performance
- **API Routes**: Serverless functions for API endpoints
- **CDN**: Vercel automatically provides global CDN

## Security Notes

- Never commit your `.env` file
- Use Vercel's environment variables for sensitive data
- The `OPENAI_API_KEY` should only be set in Vercel dashboard

## Support

If you encounter issues:

1. Check Vercel's [documentation](https://vercel.com/docs)
2. Review Expo Router [deployment guide](https://docs.expo.dev/router/introduction/)
3. Check the build logs in Vercel dashboard

## Next Steps

After successful deployment:

1. Test all functionality on the live site
2. Set up monitoring (optional)
3. Configure custom domain (optional)
4. Set up CI/CD for automatic deployments
