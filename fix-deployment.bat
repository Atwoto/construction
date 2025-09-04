@echo off
echo Fixing frontend routing configuration...

echo.
echo Adding changes to git...
git add .

echo.
echo Committing changes...
git commit -m "Simplify Vercel config - focus on frontend first"

echo.
echo Pushing to GitHub...
git push

echo.
echo Changes pushed! Vercel will automatically redeploy.
echo Check your Vercel dashboard for the new deployment.
echo.
echo Testing URLs:
echo Frontend: https://construction-six-lovat.vercel.app
echo API Health: https://construction-six-lovat.vercel.app/api/health
echo.
pause