@echo off
cls
echo ============================================
echo   Game Collection - APK Build Helper
echo ============================================
echo.
echo This script prepares your project for GitHub upload.
echo You'll need a free GitHub account.
echo.
echo ============================================
echo.

echo Step 1: Install Git (if not installed)
echo ----------------------------------------
echo Download: https://git-scm.com/download/win
echo After installation, come back and run this script again.
echo.
pause
cls

echo ============================================
echo   Game Collection - APK Build Helper
echo ============================================
echo.
echo Step 2: Initialize Git Repository
echo ----------------------------------------
set /p username=Enter your GitHub username: 
set /p reponame=Enter repository name (e.g., game-collection): 

echo.
echo Initializing git repository...
git init
git add .
git commit -m "Initial commit - 22 game collection"

echo.
echo Adding remote repository...
git remote add origin https://github.com/%username%/%reponame%.git

echo.
echo ============================================
echo   READY TO UPLOAD!
echo ============================================
echo.
echo Run these commands to upload:
echo.
echo   git branch -M main
echo   git push -u origin main
echo.
echo OR use GitHub Desktop (easier):
echo   https://desktop.github.com/
echo.
echo After uploading:
echo   1. Go to https://github.com/%username%/%reponame%/actions
echo   2. Wait for build to complete (5-10 minutes)
echo   3. Download APK from Artifacts
echo.
echo ============================================
echo.
pause
