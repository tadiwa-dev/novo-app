@echo off
echo Deploying Novo App to GitHub...
echo.

echo Please enter your GitHub username:
set /p GITHUB_USERNAME=

echo.
echo Adding remote repository...
git remote add origin https://github.com/%GITHUB_USERNAME%/novo-app.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo Done! Your code is now on GitHub.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Import your repository
echo 3. Add environment variables
echo 4. Deploy!
echo.
pause
