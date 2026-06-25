# Firebase Automatic Setup Script
# Salve como: setup-firebase.ps1
# Execute com: .\setup-firebase.ps1

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🔥 NETRUNNER FIREBASE SETUP 🔥          ║" -ForegroundColor Cyan
Write-Host "║        Configurador Automático             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
Write-Host "⏳ Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "❌ Node.js NÃO está instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Instale Node.js em: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "   → Clique em LTS (recomendado)" -ForegroundColor Cyan
    Write-Host "   → Instale normalmente" -ForegroundColor Cyan
    Write-Host "   → Reinicie o PowerShell" -ForegroundColor Cyan
    exit 1
}
Write-Host "✅ Node.js $nodeVersion encontrado!" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Você vai precisar das credenciais do Firebase Console..." -ForegroundColor Cyan
Write-Host "   Se não tem, vá para: https://console.firebase.google.com/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Leia o guia: SETUP_FIREBASE_AUTO.md" -ForegroundColor Yellow
Write-Host ""

# Perguntar se deseja continuar
$confirm = Read-Host "Tem as 6 credenciais do Firebase? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "sim") {
    Write-Host "Quando tiver as credenciais, execute novamente!" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "📝 Cole EXATAMENTE como aparece no Firebase Console:" -ForegroundColor Yellow
Write-Host ""

# Pedir credenciais
$apiKey = Read-Host "1️⃣ API Key (começa com AIzaSy)"
$authDomain = Read-Host "2️⃣ Auth Domain (seu-projeto.firebaseapp.com)"
$projectId = Read-Host "3️⃣ Project ID (seu-projeto)"
$storageBucket = Read-Host "4️⃣ Storage Bucket (seu-projeto.appspot.com)"
$messagingSenderId = Read-Host "5️⃣ Messaging Sender ID (números)"
$appId = Read-Host "6️⃣ App ID (1:números:web:...)"

# Validar credenciais
Write-Host ""
Write-Host "🔍 Validando credenciais..." -ForegroundColor Yellow

if ($apiKey -notmatch "AIzaSy") {
    Write-Host "❌ API Key não parece válida (não começa com AIzaSy)" -ForegroundColor Red
    exit 1
}

if ($authDomain -notlike "*firebaseapp.com") {
    Write-Host "❌ Auth Domain não parece válida (deve conter firebaseapp.com)" -ForegroundColor Red
    exit 1
}

if ($projectId -eq "") {
    Write-Host "❌ Project ID não pode estar vazio" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Credenciais parecem válidas!" -ForegroundColor Green
Write-Host ""

# Criar .env.local
Write-Host "📝 Criando .env.local..." -ForegroundColor Cyan

$envContent = @"
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=$authDomain
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_STORAGE_BUCKET=$storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
VITE_FIREBASE_APP_ID=$appId
"@

try {
    Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
    Write-Host "✅ .env.local criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao criar .env.local: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Conteúdo do .env.local:" -ForegroundColor Cyan
Write-Host "────────────────────────────────────────────" -ForegroundColor Gray
Get-Content .env.local | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
Write-Host "────────────────────────────────────────────" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Firebase configurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. npm install" -ForegroundColor Yellow
Write-Host "   2. npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎮 Teste:" -ForegroundColor Cyan
Write-Host "   1. Faça login com seu email" -ForegroundColor Yellow
Write-Host "   2. Jogue um pouco, complete alguns hacks" -ForegroundColor Yellow
Write-Host "   3. Feche o navegador" -ForegroundColor Yellow
Write-Host "   4. Reabra e faça login novamente" -ForegroundColor Yellow
Write-Host "   5. Clique '▶️ RETOMAR MISSÃO' ← Prova que funciona!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Divirta-se! 🎮💀" -ForegroundColor Green
Write-Host ""
