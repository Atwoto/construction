@echo off
echo 🔧 Deploying TypeScript fix...

echo.
echo 🚀 Deploying to Vercel...
call vercel --prod

echo.
echo ✅ Deployment complete!
echo Check your Vercel dashboard for the deployment status.
pause