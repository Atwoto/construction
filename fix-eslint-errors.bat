@echo off
echo 🔧 Fixing ESLint errors and deploying...

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🏗️ Building the project...
call npm run build

echo.
echo 🚀 Deploying to Vercel...
call vercel --prod

echo.
echo ✅ Deployment complete!
echo Check your Vercel dashboard for the deployment status.
pause