@echo off
echo Starting full-stack deployment to Vercel...

echo.
echo Step 1: Installing Vercel CLI (if not already installed)
npm list -g vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
) else (
    echo Vercel CLI already installed
)

echo.
echo Step 2: Installing dependencies
echo Installing root dependencies...
call npm install
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Step 3: Testing frontend build
cd frontend
echo Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)
cd ..

echo.
echo Step 4: Deploying to Vercel (Full-Stack)
echo This will deploy both frontend and backend...
vercel

echo.
echo Deployment complete!
echo.
echo Next steps:
echo 1. Set up your Supabase database
echo 2. Add environment variables in Vercel dashboard:
echo    - SUPABASE_URL
echo    - SUPABASE_ANON_KEY  
echo    - SUPABASE_SERVICE_ROLE_KEY
echo    - JWT_SECRET
echo    - JWT_REFRESH_SECRET
echo.
echo Your app will be available at the URL shown above!
echo.
pause