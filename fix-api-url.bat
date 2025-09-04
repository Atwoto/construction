@echo off
echo Fixing API URL issue - frontend connecting to localhost instead of Vercel...

echo.
echo Step 1: Adding changes to git...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Fix API URL - use relative URLs in production"

echo.
echo Step 3: Pushing to GitHub...
git push

echo.
echo ✅ Changes deployed!
echo.
echo The fix:
echo - In production: Uses /api (relative URLs)
echo - In development: Uses localhost:5001
echo.
echo After deployment, the login should work!
echo Check browser console for API URL logs.
echo.
pause