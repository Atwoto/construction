@echo off
echo Deploying full-stack Construction CRM to Vercel...

echo.
echo Step 1: Adding all changes to git...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "Deploy full-stack Construction CRM with complete backend API"

echo.
echo Step 3: Pushing to GitHub...
git push

echo.
echo ✅ Deployment initiated!
echo.
echo Your app will be available at:
echo 🌐 Frontend: https://construction-six-lovat.vercel.app
echo 🔧 API Health: https://construction-six-lovat.vercel.app/api/health
echo 🔐 Login API: https://construction-six-lovat.vercel.app/api/auth/login
echo 👥 Users API: https://construction-six-lovat.vercel.app/api/users
echo 🏢 Clients API: https://construction-six-lovat.vercel.app/api/clients
echo 🏗️ Projects API: https://construction-six-lovat.vercel.app/api/projects
echo.
echo ⚠️ Don't forget to set environment variables in Vercel dashboard:
echo   - SUPABASE_URL
echo   - SUPABASE_ANON_KEY
echo   - SUPABASE_SERVICE_ROLE_KEY
echo   - JWT_SECRET
echo   - JWT_REFRESH_SECRET
echo.
echo Check Vercel dashboard for deployment status!
echo.
pause