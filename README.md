# Construction CRM

A comprehensive Customer Relationship Management system specifically designed for construction companies to manage all aspects of their business operations.

## Deployment Guide

### Vercel Deployment

1. Set up the following environment variables in your Vercel project:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `JWT_SECRET` - Secret for JWT tokens
   - `JWT_EXPIRES_IN` - Token expiration time
   - `JWT_REFRESH_SECRET` - Secret for refresh tokens
   - `JWT_REFRESH_EXPIRES_IN` - Refresh token expiration time

2. Deploy to Vercel using the provided `vercel.json` configuration.

### Local Development

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. Create environment files:
   - Copy `backend/.env.example` to `backend/.env` and update the values
   - Copy `frontend/.env.example` to `frontend/.env` and update the values

3. Start the development servers:
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev
   
   # Terminal 2: Start frontend
   cd frontend
   npm start
   ```

## Troubleshooting

If you're having issues with authentication:

1. Make sure the Supabase credentials are correctly configured
2. Check that the CORS settings allow requests from your frontend domain
3. Verify that the API routes are correctly configured for your deployment environment