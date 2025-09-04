# Construction CRM - Deployment Guide

## Local Development

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   ```

2. Create environment files:
   - Copy `.env.example` to `.env` in both root and backend directories
   - Update the values with your configuration

3. Start the development servers:
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   cd frontend
   npm start
   ```

## Vercel Deployment

The application is configured for deployment to Vercel with the following structure:

- Frontend: React application in the `frontend` directory
- Backend: Express API in the `backend` directory
- API Routes: Handled by `api/index.js` which uses `serverless-http`

### Environment Variables

Set the following environment variables in Vercel:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration time

### Deployment Process

1. Push to your GitHub repository
2. Connect the repository to Vercel
3. Configure the environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` file handles the routing:
- `/api/*` routes are handled by the serverless function
- All other routes serve the React frontend