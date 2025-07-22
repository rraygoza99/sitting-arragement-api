@echo off
REM Windows batch script for postbuild

echo Starting postbuild process...

REM Remove existing .amplify-hosting directory
if exist ".amplify-hosting" (
    echo Removing existing .amplify-hosting directory...
    rmdir /s /q ".amplify-hosting"
)

REM Create directory structure
echo Creating directory structure...
mkdir ".amplify-hosting\compute\default"

REM Copy compiled JavaScript files from dist folder (for TypeScript)
echo Copying compiled files...
if exist "dist\*.js" (
    copy "dist\*.js" ".amplify-hosting\compute\default\" >nul 2>&1
    echo Copied JS files from dist folder
) else (
    echo No compiled JS files found in dist folder
)

REM Copy package.json
echo Copying package.json...
copy "package.json" ".amplify-hosting\compute\default\" >nul 2>&1

REM Copy node_modules
echo Copying node_modules...
if exist "node_modules" (
    xcopy "node_modules" ".amplify-hosting\compute\default\node_modules" /E /I /Q >nul 2>&1
    echo Node_modules copied successfully
) else (
    echo Warning: node_modules directory not found
)

REM Copy .env if it exists
if exist ".env" (
    echo Copying .env file...
    copy ".env" ".amplify-hosting\compute\default\" >nul 2>&1
) else (
    echo No .env file found, skipping...
)

REM Create public directory if it doesn't exist and copy static files
if not exist "public" (
    echo Creating public directory...
    mkdir "public"
)

echo Copying static files...
xcopy "public" ".amplify-hosting\static" /E /I /Q >nul 2>&1

REM Copy deploy manifest
echo Copying deploy-manifest.json...
copy "deploy-manifest.json" ".amplify-hosting\" >nul 2>&1

echo Postbuild completed successfully!
echo.
echo Directory structure created:
echo .amplify-hosting\
echo   ├── compute\
echo   │   └── default\
echo   │       ├── *.js (compiled files)
echo   │       ├── package.json
echo   │       ├── node_modules\
echo   │       └── .env (if exists)
echo   ├── static\
echo   │   └── (public files)
echo   └── deploy-manifest.json
