@echo off
cd /d "%~dp0"

set "BUNDLED_NODE=%~dp0runtime\node-windows\node-v22.23.2-win-x64"
if exist "%BUNDLED_NODE%\node.exe" (
  set "PATH=%BUNDLED_NODE%;%PATH%"
) else (
  where node >nul 2>nul
  if errorlevel 1 (
    echo.
    echo Bundled Node.js was not found and system Node.js is not installed.
    pause
    exit /b 1
  )
)

if not exist "node_modules\playwright" (
  echo Installing dependencies. Please wait...
  call npm install
  if errorlevel 1 (
    echo.
    echo Installation failed. Check that Node.js and npm are installed.
    pause
    exit /b 1
  )
)

node server.mjs --lan --open
pause
