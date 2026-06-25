@echo off
REM Firebase Setup - Windows Batch Script
REM Execute this file: setup-firebase.bat

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════╗
echo ║   🔥 NETRUNNER FIREBASE SETUP 🔥          ║
echo ║        Configurador Automático             ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Node.js NAO esta instalado!
    echo.
    echo Instale em: https://nodejs.org/
    echo - Clique em LTS (recomendado)
    echo - Instale normalmente
    echo - Reinicie o PowerShell/CMD
    echo.
    pause
    exit /b 1
)

echo.
echo 📝 Voce vai precisar das CREDENTIALS do Firebase Console
echo    Se nao tem, va para: https://console.firebase.google.com/
echo.
echo Leia: SETUP_FIREBASE_AUTO.md
echo.
set /p confirm="Tem as 6 credenciais? (s/n): "
if not "%confirm%"=="s" (
    echo.
    echo Quando tiver as credenciais, execute novamente!
    echo.
    pause
    exit /b 0
)

echo.
echo Cole EXATAMENTE como aparece no Firebase Console:
echo.

set /p apiKey="1. API Key (AIzaSy...): "
set /p authDomain="2. Auth Domain (seu-projeto.firebaseapp.com): "
set /p projectId="3. Project ID (seu-projeto): "
set /p storageBucket="4. Storage Bucket (seu-projeto.appspot.com): "
set /p messagingSenderId="5. Messaging Sender ID (numeros): "
set /p appId="6. App ID (1:numeros:web:...): "

echo.
echo Validando credenciais...
echo %apiKey%| findstr /R "AIzaSy" >nul
if errorlevel 1 (
    echo.
    echo Erro: API Key nao parece valida (deve comecar com AIzaSy)
    pause
    exit /b 1
)

if "%projectId%"=="" (
    echo.
    echo Erro: Project ID nao pode estar vazio
    pause
    exit /b 1
)

echo Credenciais validadas!
echo.
echo Criando .env.local...

(
    echo VITE_FIREBASE_API_KEY=%apiKey%
    echo VITE_FIREBASE_AUTH_DOMAIN=%authDomain%
    echo VITE_FIREBASE_PROJECT_ID=%projectId%
    echo VITE_FIREBASE_STORAGE_BUCKET=%storageBucket%
    echo VITE_FIREBASE_MESSAGING_SENDER_ID=%messagingSenderId%
    echo VITE_FIREBASE_APP_ID=%appId%
) > .env.local

if errorlevel 1 (
    echo.
    echo Erro ao criar .env.local
    pause
    exit /b 1
)

echo.
echo .env.local criado com sucesso!
echo.
echo Conteudo:
echo ────────────────────────────────────────────
type .env.local
echo ────────────────────────────────────────────
echo.
echo Firebase configurado!
echo.
echo Proximos passos:
echo   1. npm install
echo   2. npm run dev
echo.
echo Teste:
echo   1. Faca login com seu email
echo   2. Jogue um pouco
echo   3. Feche o navegador
echo   4. Reabra e faca login novamente
echo   5. Clique 'Retomar Missao' - prova que funciona!
echo.
echo Divirta-se! 🎮💀
echo.
pause
