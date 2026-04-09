@echo off
cd /d "%~dp0"
call npx electron-builder --win --dir
echo Build completed!
pause
