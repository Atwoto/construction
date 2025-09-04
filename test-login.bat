@echo off
echo Fixing login with unified API handler...

echo.
echo Step 1: Adding changes to git...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Fix login - unified API handler with proper routing"

echo.
echo Step 3: Pushing to GitHub...
git push

echo.
echo ✅ Changes deployed!
echo.
echo Test these URLs after deployment:
echo 🔍 Debug: https://construction-six-lovat.vercel.app/api/debug
echo ❤️ Health: https://construction-six-lovat.vercel.app/api/health
echo 🔐 Login: POST to https://construction-six-lovat.vercel.app/api/auth/login
echo.
echo ⚠️ Environment variables should be set in Vercel dashboard
echo.
echo Try logging in through your app after deployment!
echo.
pause