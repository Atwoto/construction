# Troubleshooting "Failed to Load Data" Error

If you're seeing a "failed to load data" error in the Construction CRM application, here are some steps to diagnose and fix the issue:

## 1. Check API Connectivity

First, verify that the frontend can connect to the backend API:

1. Open your browser's developer tools (F12)
2. Go to the Network tab
3. Refresh the page
4. Look for failed requests to `/api/*` endpoints
5. Check the status codes and error messages

## 2. Verify Environment Variables

Make sure the frontend is configured with the correct API URL:

1. Check that you have a `.env` file in the `frontend` directory
2. Verify that it contains:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
   for local development, or:
   ```
   REACT_APP_API_URL=/api
   ```
   for production/Vercel deployment

## 3. Check Backend Server

Ensure the backend server is running:

1. In your terminal, navigate to the `backend` directory
2. Run `npm run dev` to start the development server
3. You should see a message like "🚀 Construction CRM API Server running on http://localhost:5000"

## 4. Test API Endpoints Directly

You can test the API endpoints directly:

1. Open your browser and go to `http://localhost:5000/health`
2. You should see a JSON response with status "OK"
3. Try `http://localhost:5000/api/projects/stats` to test the stats endpoint

## 5. Check CORS Configuration

If you're getting CORS errors:

1. Check that the backend's `CORS_ORIGIN` environment variable is set correctly
2. For local development, it should be `http://localhost:3000` (or 3001 if you've changed the port)

## 6. Vercel Deployment Issues

If you're deploying to Vercel and having issues:

1. Check that your `vercel.json` file is correctly configured
2. Verify that environment variables are set in the Vercel dashboard
3. Check the deployment logs for any errors

## 7. Common Solutions

1. **Restart both servers**: Stop both frontend and backend servers and restart them
2. **Clear browser cache**: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
3. **Check firewall**: Make sure your firewall isn't blocking the ports
4. **Verify database connection**: Ensure your database is accessible and the connection details are correct

If you're still having issues, please check the browser console and server logs for more detailed error messages.