@echo off
title LUSH - Smart Landscape Garden Planner
echo ===================================================
echo   Starting LUSH - Smart Landscape Garden Planner
echo ===================================================
echo.
cd /d "%~dp0"
echo Opening browser at http://localhost:3000 ...
start http://localhost:3000
echo Running Vite dev server...
npm.cmd run dev
pause
