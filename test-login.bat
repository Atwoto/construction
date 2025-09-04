@echo off
echo Testing login functionality...

echo.
echo Step 1: Adding changes to git...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Fix login API - create individual serverless functions"

echo.
echo Step 3: Pushing to GitHub...
git push

echo.
echo ✅ Changes deployed!
echo.
echo Test these URLs after deployment:
echo 🔍 Debug: https://construction-six-lovat.vercel.app/api/debug
echo ❤️ Health: https://construction-six-lovat.vercel.app/api/health
echo 🔐 Login: https://construction-six-lovat.vercel.app/api/auth/login
echo.
echo ⚠️ Make sure these environment variables are set in Vercel:
echo   - SUPABASE_URL
echo   - SUPABASE_SERVICE_ROLE_KEY
echo   - JWT_SECRET
echo   - JWT_REFRESH_SECRET
echo.
echo After deployment, try logging in again!
echo.
pause