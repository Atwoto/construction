@echo off
echo ================================
echo Construction CRM Deployment Script
echo ================================

echo.
echo 1. Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    exit /b %errorlevel%
)
cd ..

echo.
echo 2. Preparing deployment files...
REM Copy build files to deployment directory if needed
REM This step may not be necessary depending on your deployment method

echo.
echo 3. Deployment ready!
echo.
echo To deploy to Vercel:
echo   1. Commit all changes to your repository
echo   2. Push to GitHub
echo   3. Vercel will automatically deploy the new version
echo.
echo To deploy manually:
echo   1. Run "vercel --prod" from the project root directory
echo.
echo Diagnostic Test Pages:
echo   - /comprehensive-test.html - Tests all API endpoints
echo   - /dashboard-endpoint-test.html - Tests dashboard-specific endpoints
echo   - /auth-debug.html - Tests authentication and tokens
echo   - /final-verification.html - Final system verification
echo.

echo ✅ Deployment preparation completed successfully!
pause