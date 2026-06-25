# 🔥 Firebase Setup Automático

## Pré-requisitos

Você precisa que **Node.js 18+** esteja instalado. Se não tiver:

### Windows
1. Baixe em: https://nodejs.org/
2. Clique em **LTS** (recomendado)
3. Instale normalmente
4. Reinicie o PowerShell

### Verificar instalação
```powershell
node --version  # Deve mostrar v18.x.x ou maior
npm --version   # Deve mostrar 9.x.x ou maior
```

---

## 1️⃣ Criar Projeto Firebase (MANUAL - você faz)

### A. Acesse o Console
1. Vá para: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"** ou **"Create project"**

### B. Preencha os dados
- **Nome do projeto:** netrunner-shadow-protocol
- **Localização:** Brasil (ou seu país)
- Desmarque "Google Analytics" (opcional)
- Clique **"Criar projeto"**

### C. Ative Autenticação
1. No console, vá para **Authentication** (menu esquerdo)
2. Clique em **"Get started"** ou **"Começar"**
3. Ative os métodos:
   - ✅ **Anonymous** (sem email/senha)
   - ✅ **Email/Password** (com login)
4. Clique **Save**

### D. Crie Firestore Database
1. Vá para **Firestore Database** (menu esquerdo)
2. Clique **Create database**
3. Escolha **Start in test mode** (para desenvolvimento)
4. Escolha **Brazil** como região (ou mais próximo de você)
5. Clique **Create**

### E. Copie Suas Credenciais
1. Vá para **Project Settings** (⚙️ ícone no topo)
2. Procure a seção **"Your apps"**
3. Se há um app Web criado, clique nele
4. Se NÃO há, clique **"Add app"** → **Web** (ícone `</>`), preencha "netrunner"
5. Copie as 6 linhas de credenciais

Você vai ter algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-123456",
  storageBucket: "seu-projeto-123456.appspot.com",
  messagingSenderId: "123456789000",
  appId: "1:123456789000:web:abc123def456"
};
```

---

## 2️⃣ Configurar no Projeto (AUTOMÁTICO)

### Script de Setup

Copie este script e salve como `setup-firebase.ps1` na pasta `netrunner/`:

```powershell
# setup-firebase.ps1

Write-Host "🔥 Netrunner Firebase Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Pedir credenciais ao usuário
$apiKey = Read-Host "Cole seu API Key (AIzaSy...)"
$authDomain = Read-Host "Cole seu Auth Domain (seu-projeto.firebaseapp.com)"
$projectId = Read-Host "Cole seu Project ID (seu-projeto)"
$storageBucket = Read-Host "Cole seu Storage Bucket (seu-projeto.appspot.com)"
$messagingSenderId = Read-Host "Cole seu Messaging Sender ID (123456789000)"
$appId = Read-Host "Cole seu App ID (1:123456789000:web:abc123)"

# Criar .env.local
$envContent = @"
VITE_FIREBASE_API_KEY=$apiKey
VITE_FIREBASE_AUTH_DOMAIN=$authDomain
VITE_FIREBASE_PROJECT_ID=$projectId
VITE_FIREBASE_STORAGE_BUCKET=$storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
VITE_FIREBASE_APP_ID=$appId
"@

# Salvar .env.local
Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
Write-Host "✅ .env.local criado com sucesso!" -ForegroundColor Green
Write-Host ""

# Mostrar o que foi criado
Write-Host "📋 Conteúdo do .env.local:" -ForegroundColor Cyan
Get-Content .env.local

Write-Host ""
Write-Host "✅ Setup completo!" -ForegroundColor Green
Write-Host "Próximo passo: npm run dev" -ForegroundColor Yellow
```

### Executar Setup

```powershell
cd c:\pessoas\netrunner

# Copie as credenciais do console Firebase e Cole aqui
.\setup-firebase.ps1
```

O script vai:
1. ✅ Pedir suas 6 credenciais
2. ✅ Criar `.env.local` automaticamente
3. ✅ Configurar tudo
4. ✅ Mostrar o resultado

---

## 3️⃣ Testar Firebase

```powershell
cd c:\pessoas\netrunner
npm install
npm run dev
```

Quando abrir no navegador:
- ✅ Faça login com email
- ✅ Jogue um pouco
- ✅ Feche o navegador
- ✅ Reabra
- ✅ Faça login novamente
- ✅ Clique **"▶️ RETOMAR MISSÃO"** ← Prova que está funcionando!

---

## 4️⃣ Verificar no Firebase Console

Vá para: https://console.firebase.google.com → seu projeto

### Firestore Database
- Coleção `leaderboard` → Seus scores
- Coleção `users` → Seu perfil e progresso

### Authentication
- Clique em **Users**
- Deve mostrar sua conta de email

---

## 🆘 Se der erro 404

```
404: NOT_FOUND
```

Significa credenciais erradas. Verifique:
1. ❌ Copiou toda a credencial (sem espaços extras)?
2. ❌ Project ID está correto?
3. ❌ API deve começar com "AIzaSy"?

Se tudo estiver certo mas ainda der erro:
- Verifique no Firebase Console se o projeto foi criado
- Tente criar novo app Web no console
- Copie as credenciais novamente

---

## 💡 Alternativa: Já funcionando em Offline Mode!

Se tudo isso for complicado, **já está funcionando** em modo offline com dados de exemplo. Isso é perfeito para:
- ✅ Testar o jogo
- ✅ Jogar
- ✅ Ver como funciona

Depois when tiver Firebase real, é só atualizar `.env.local`!

---

**Qualquer dúvida, me chama!** 🎮💀
