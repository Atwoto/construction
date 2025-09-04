@echo off
echo Fixing Vercel runtime configuration...

echo.
echo Adding changes to git...
git add .

echo.
echo Committing changes...
git commit -m "Fix Vercel runtime configuration - use @vercel/node"

echo.
echo Pushing to GitHub...
git push

echo.
echo Changes pushed! Vercel will automatically redeploy.
echo Check your Vercel dashboard for the new deployment.
echo Your app should be working at: https://construction-six-lovat.vercel.app
echo.
pause