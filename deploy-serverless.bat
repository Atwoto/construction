@echo off
echo ========================================
echo   Deploying Serverless Construction CRM
echo ========================================

echo.
echo 1. Installing API dependencies...
cd api
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install API dependencies
    pause
    exit /b 1
)

echo.
echo 2. Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo 3. Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

echo.
echo 4. Testing API connection...
cd ..
node test-serverless-api.js
if %errorlevel% neq 0 (
    echo ❌ API test failed
    pause
    exit /b 1
)

echo.
echo ✅ All checks passed! Ready for Vercel deployment.
echo.
echo Next steps:
echo 1. Run: vercel --prod
echo 2. Or push to GitHub and deploy via Vercel dashboard
echo.
pause