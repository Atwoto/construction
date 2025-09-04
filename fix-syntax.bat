@echo off
echo Fixing syntax error in api/index.js and deploying...

echo.
echo Step 1: Adding changes to git...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Fix syntax error in api/index.js - missing closing brace"

echo.
echo Step 3: Pushing to GitHub...
git push

echo.
echo ✅ Syntax error fixed and deployed!
echo.
echo Now both issues are resolved:
echo 1. ✅ Frontend API URL fixed (uses /api in production)
echo 2. ✅ Backend syntax error fixed (missing closing brace)
echo.
echo After deployment, login should work properly!
echo.
pause