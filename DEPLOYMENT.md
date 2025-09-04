# Deployment Guide for Construction CRM

This guide explains how to deploy the Construction CRM application to Vercel.

## Prerequisites

1. Vercel account (free at [vercel.com](https://vercel.com))
2. Supabase account (free at [supabase.com](https://supabase.com))
3. GitHub account (optional but recommended)

## Architecture Overview

The Construction CRM consists of:
- Frontend: React application
- Backend: Node.js/Express API
- Database: Supabase (PostgreSQL)

## Deployment Steps

### 1. Prepare Your Supabase Project

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL script from `supabase_tables.sql` in your Supabase SQL editor
3. Note down your Supabase credentials:
   - Project URL
   - Anonymous key
   - Service role key

### 2. Set Up Environment Variables

#### Frontend Environment Variables
Create the following environment variables in your Vercel frontend project:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_USE_MOCK_AUTH=false
```

#### Backend Environment Variables
Create the following environment variables in your Vercel backend project:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### 3. Deploy the Backend

1. Push your backend code to a GitHub repository
2. Import the repository to Vercel
3. Set the build command to `npm install`
4. Set the output directory to `.`
5. Add the environment variables from step 2
6. Deploy

### 4. Deploy the Frontend

1. Push your frontend code to a GitHub repository
2. Import the repository to Vercel
3. Set the build command to `npm run build`
4. Set the output directory to `build`
5. Add the environment variables from step 2
6. Deploy

### 5. Configure CORS

After deploying both applications, update the `CORS_ORIGIN` environment variable in your backend with the URL of your deployed frontend.

## Local Testing

Before deploying, you can test the production configuration locally:

1. In the frontend directory:
   ```
   npm run build
   npx serve -s build
   ```

2. In the backend directory:
   ```
   NODE_ENV=production node src/server.js
   ```

## Troubleshooting

### Common Issues

1. **CORS errors**: Make sure `CORS_ORIGIN` is set correctly in your backend environment variables
2. **API connection errors**: Verify that `REACT_APP_API_URL` points to your deployed backend
3. **Database connection errors**: Check that all Supabase environment variables are set correctly

### Environment Variables Checklist

Make sure all these environment variables are set in Vercel:

Backend:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- CORS_ORIGIN

Frontend:
- REACT_APP_API_URL

## Updating the Application

To update your deployed application:

1. Push changes to your GitHub repository
2. Vercel will automatically redeploy your application
3. For environment variable changes, update them in the Vercel dashboard

## Security Considerations

1. Never commit sensitive keys to version control
2. Use Vercel's environment variable management for secrets
3. Regularly rotate your API keys
4. Monitor your application logs for suspicious activity