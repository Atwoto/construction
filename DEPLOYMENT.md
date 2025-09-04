# Vercel Full-Stack Deployment Guide

## Prerequisites

1. Install Vercel CLI: `npm i -g vercel`
2. Create accounts on:
   - [Vercel](https://vercel.com) (for full-stack deployment)
   - [Supabase](https://supabase.com) (for database)
3. Push your code to GitHub

## Step 1: Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com)
2. Go to SQL Editor and run your database scripts from `backend/supabase_tables.sql`
3. Get your connection details from Settings → Database
4. Note down:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Deploy to Vercel (Full-Stack)

### Method 1: GitHub Integration (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

### Method 2: Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: construction-crm
# - In which directory is your code located? ./
```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

### Required Variables:

```
NODE_ENV=production
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_random_jwt_secret_32_chars_min
JWT_REFRESH_SECRET=your_random_refresh_secret_32_chars_min
CORS_ORIGIN=*
```

### Optional Variables:

```
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 4: Test Your Deployment

1. Your app will be available at `https://your-project-name.vercel.app`
2. Test the API endpoints at `https://your-project-name.vercel.app/api/health`
3. Frontend should load and connect to the API automatically

## Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
vercel dev

# This will run both frontend and backend locally
# Frontend: http://localhost:3000
# Backend API: http://localhost:3000/api
```

## Troubleshooting

### Build Errors

- Check that all dependencies are in the root `package.json`
- Ensure frontend builds locally: `cd frontend && npm run build`
- Check Vercel build logs in the dashboard

### API Connection Issues

- Verify environment variables are set correctly
- Check that `/api/health` endpoint responds
- Ensure CORS is configured properly

### Database Connection Issues

- Verify Supabase credentials are correct
- Check that your database tables exist
- Test connection from Supabase dashboard

## Automatic Deployments

Vercel automatically deploys:

- `main` branch → Production
- Other branches → Preview deployments
- Pull requests → Preview deployments

Configure branch settings in Settings → Git Integration.

## Architecture

```
Your Domain
├── / (Frontend - React App)
├── /api/* (Backend - Serverless Functions)
└── Database (Supabase PostgreSQL)
```

This setup gives you:

- ✅ Frontend and backend on same domain (no CORS issues)
- ✅ Automatic HTTPS
- ✅ Global CDN for frontend assets
- ✅ Serverless backend scaling
- ✅ Automatic deployments from GitHub
