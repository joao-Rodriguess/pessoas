# 💀 NETRUNNER: SHADOW PROTOCOL

> **Um minigame de hacking cyberpunk com história imersiva, puzzles e leaderboard global.**

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-cyan)
![React](https://img.shields.io/badge/React-18-blue)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![Vite](https://img.shields.io/badge/Vite-5-purple)

---

## 📖 A HISTÓRIA

**Ano: 2047.**

O mundo mudou. Megacorporações controlam governos, dados e armas. A **NEXUS Corp**, a mais poderosa delas, desenvolveu secretamente o **Projeto DEFCON-1**: um sistema de mísseis autônomos capaz de destruir cidades inteiras sem aprovação humana.

O **General Marcus Webb**, comandante corrupto da divisão militar da NEXUS, planeja usar os mísseis como ferramenta de chantagem geopolítica. Três cidades foram marcadas como alvos.

A **facção rebelde ZERO-DAY** descobriu o plano e contratou você — **GHOST**, um netrunner freelancer lendário — para a missão mais perigosa da sua carreira:

> **Infiltrar os servidores da NEXUS, hackear seus sistemas de segurança e ABORTAR o lançamento dos mísseis antes que seja tarde demais.**

Você não está sozinho. **ARIA**, uma inteligência artificial renegada que escapou dos laboratórios da NEXUS, será sua parceira. Ela guiará seus passos e te avisará dos perigos.

A **Dra. Li Chen**, engenheira sênior da NEXUS, é sua aliada secreta. Ela deixou pistas em emails e arquivos para te ajudar — mas se a NEXUS descobrir, ambos estarão perdidos.

O relógio está correndo. O **trace protocol** está ativo. Cada movimento errado te aproxima da captura pelo FBI.

**Milhões de vidas dependem de você.**

---

## 🎮 COMO JOGAR

### Objetivo
Hackear 5 sistemas de segurança, encontrar os códigos Alpha e Beta, acessar o painel DEFCON-1 e apertar o botão ABORT antes que o countdown chegue a zero.

### Passo a Passo

1. **🔍 Reconhecimento** — Use o **Terminal** e digite `scan` para identificar os alvos
2. **👾 Hacking** — Abra o **HackTools** e resolva os puzzles para hackear cada sistema
3. **📧 Inteligência** — Leia os **Emails** e examine os **Arquivos** em busca de códigos
4. **🗄️ Database** — Use **SQL queries** para extrair informações dos bancos de dados
5. **🏦 Banco** — Hackeie o cofre digital e transfira os fundos
6. **⚡ PowerGrid** — Desative a energia dos setores da NEXUS
7. **📹 CCTV** — Desligue as câmeras de segurança
8. **🚀 DEFCON-1** — Com 3+ hacks completos, acesse o painel de mísseis, insira os códigos Alpha e Beta, e **ABORTE** o lançamento!

### ⚠️ Cuidado!
- O **Trace Protocol** está contando! Se chegar a 100%, você é capturado
- Respostas erradas aumentam o trace
- Use **power-ups** no terminal: `activate vpn`, `activate proxy`
- Anote tudo no **Bloco de Notas** (📝)

---

## 🛠️ TECNOLOGIAS

| Tecnologia | Uso |
|---|---|
| **React 18** | Interface e componentes |
| **Vite 5** | Build tool e dev server |
| **Firebase 10** | 🔥 Autenticação, Firestore, Leaderboard |
| **Firestore** | 📊 Armazenamento de progresso e rankings |
| **Firebase Auth** | 🔐 Autenticação (anônima + email) |
| **Framer Motion** | 🎬 Animações suaves |
| **CSS Puro** | 🎨 Design system cyberpunk customizado |
| **Web Audio API** | 🔊 Efeitos sonoros procedurais |

---

## 🚀 INSTALAÇÃO

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Setup

```bash
# 1. Acesse a pasta do projeto
cd netrunner

# 2. Instale as dependências
npm install

# 3. Copie o arquivo de configuração
cp .env.example .env

# 4. (Opcional) Configure o Firebase com suas credenciais no .env

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

O jogo funciona **sem Firebase configurado** (modo offline) — scores são mantidos apenas na sessão.

### Configurar Firebase (Opcional)

Para habilitar **auto-save, leaderboard global e achievements**:

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative **Authentication** → Métodos sign-in: 
   - ✅ Anonymous
   - ✅ Email/Password
4. Crie um **Firestore Database** (Start in test mode)
5. Copie as credenciais da seção "Project Settings" 
6. Cole os valores no arquivo `.env`

**Resultado**: Game auto-salva progresso, leaderboard funciona em tempo real! 🚀

→ **Guia Completo**: Veja `FIREBASE_SETUP.md` para instruções detalhadas

---

## 🏆 FEATURES

- ✅ **Desktop hacker** simulado com janelas arrastáveis
- ✅ **12 aplicativos** interativos (Terminal, HackTools, Email, Arquivos, Database, Banco, PowerGrid, CCTV, Satélite, DEFCON-1, Calculadora, Notas)
- ✅ **Puzzles aleatorizados** — cada partida é diferente
- ✅ **Sistema de trace** em tempo real com barra de progresso
- ✅ **Narrativa cinemática** com diálogos e personagens
- ✅ **Power-ups** (VPN, Proxy, Exploit Kit)
- ✅ **Conquistas / Achievements**
- ✅ **Leaderboard global** via Firebase (opcional)
- ✅ **Login anônimo ou por email**
- ✅ **Auto-save de progresso** — suas partidas são salvas automaticamente a cada 30s
- ✅ **Resume Game** — retome seu progresso anterior ao fazer login com email
- ✅ **Rastreamento de estatísticas** — firebase guarda seus hacks, scores históricos
- ✅ **Modo alerta** quando trace > 70% (UI muda de cor)
- ✅ **Efeitos visuais** — scanlines, partículas, glassmorphism, glitch effects
- ✅ **Tela de boot** estilo BIOS com animação de inicialização
- ✅ **Design cyberpunk premium** com paleta de cores curada

---

## 🔥 FIREBASE INTEGRATION

O jogo agora tem integração **completa com Firebase** para armazenar progresso e criar um leaderboard global!

### Recursos Firebase Implementados

#### 1️⃣ **Autenticação**
- Login anônimo (sem conta — não salva progresso)
- Login com Email/Password (cria conta e salva tudo)
- Suporte a offline mode (funciona sem Firebase configurado)

#### 2️⃣ **Auto-Save de Progresso**
- Salva automaticamente a cada 30 segundos durante o jogo
- Persiste: score, achievements, hacks completos, powerups, recursos do banco
- Sincroniza com Firestore em tempo real

#### 3️⃣ **Resume Game**
- Ao fazer login com email, sistema detecta progresso anterior
- Opção de **Retomar Missão** (continua de onde parou) ou **Nova Missão**
- Exibe score anterior e hacks completados

#### 4️⃣ **Leaderboard Global**
- Top 10 Players em tempo real
- Atualiza instantaneamente quando novo score é enviado
- Mostra: posição, nome, score, achievements, hacks
- Fallback para dados de exemplo se Firebase offline

#### 5️⃣ **Achievements Tracking**
- Cada achievement desbloqueado é registrado no Firebase
- Armazena timestamp e score no momento do desbloqueio
- Acessível no leaderboard

### Como Usar Firebase

#### Modo Offline (Desenvolvimento)
```javascript
// Funciona sem arquivo .env configurado
// Scores são mantidos apenas na sessão atual
npm run dev
```

#### Modo Online (Com Firebase)
```bash
# 1. Configure o .env com suas credenciais
cp .env.example .env
# Edite .env com seus valores do Firebase Console

# 2. Inicie o app
npm run dev

# 3. Faça login com email para habilitar auto-save
# 4. Altere entre abas — progresso é salvo automaticamente
# 5. Reabra e faça login novamente para resumir!
```

### Configuração Firebase Rápida

Para detalhes completos, veja **`FIREBASE_SETUP.md`**

```bash
# Resumido:
1. Firebase Console → Criar projeto
2. Habilitar: Authentication (Anonymous + Email/Password)
3. Criar: Firestore Database em modo teste
4. Copiar credenciais para .env
5. Pronto! ✅
```

---

## 📂 ESTRUTURA DO PROJETO

```
netrunner/
├── index.html              # HTML raiz
├── package.json            # Dependências
├── vite.config.js          # Configuração Vite
├── .env.example            # Template de credenciais Firebase
├── README.md               # Este arquivo
└── src/
    ├── main.jsx            # Entry point
    ├── App.jsx             # Router de fases do jogo
    ├── index.css           # Design system cyberpunk (900+ linhas)
    ├── firebase.js         # Inicialização Firebase
    ├── context/
    │   ├── AuthContext.jsx  # Autenticação
    │   └── GameContext.jsx  # Estado global + puzzles + timers
    ├── pages/
    │   ├── Boot.jsx         # Sequência de boot
    │   ├── Login.jsx        # Tela de login
    │   ├── Desktop.jsx      # Desktop principal
    │   ├── Victory.jsx      # Tela de vitória
    │   └── GameOver.jsx     # Tela de game over
    └── components/
        ├── Window.jsx       # Janela arrastável
        ├── Taskbar.jsx      # Barra de tarefas
        ├── TraceBar.jsx     # Barra de rastreamento
        ├── HUD.jsx          # Heads-Up Display
        ├── Leaderboard.jsx  # Ranking global
        ├── NarrativeOverlay.jsx # Diálogos narrativos
        └── games/
            ├── Terminal.jsx      # 15+ comandos
            ├── HackTools.jsx     # 5 alvos com puzzles
            ├── Email.jsx         # 5 emails com pistas
            ├── FileSystem.jsx    # 6 arquivos secretos
            ├── Database.jsx      # SQL interativo
            ├── Bank.jsx          # Cofre + transferência
            ├── PowerGrid.jsx     # 4 setores de energia
            ├── CCTV.jsx          # Câmeras com glitch
            ├── Satellite.jsx     # Mapa de silos
            ├── MissileControl.jsx # Painel DEFCON-1
            ├── Calculator.jsx    # Calculadora
            └── Notepad.jsx       # Bloco de notas
```

---

## 🎯 DICAS PARA GANHAR

> **⚠️ SPOILER ALERT** — Só leia se estiver preso!

<details>
<summary>Clique para ver as dicas</summary>

- **Código Alpha**: 742839 (encontrado no email do Gen. Webb)
- **Código Beta**: 470511 (encontrado no email do Sistema e no arquivo projeto_zeus)
- **Senha Admin**: ALPHA1983 (email da Dra. Chen)
- **Cofre**: A resposta é 42 (sequência n×(n+1))
- **Firewall**: Resolva a equação matemática mostrada
- **Criptografia**: Cifra de César — desloque as letras para trás
- **2FA**: Faça a conta matemática com hora e minutos
- **SQL Injection**: Use `' OR 1=1`
- **IP**: Converta binário para decimal

</details>

---

## 📜 CRÉDITOS

- **Design & Código**: Desenvolvido com assistência de IA
- **Inspiração**: Watch_Dogs, Hacknet, Uplink, Mr. Robot
- **Fontes**: Orbitron, Share Tech Mono, Inter (Google Fonts)
- **Stack**: React + Vite + Firebase

---

## 📄 LICENÇA

MIT License — Use como quiser, modifique, distribua.

---

<div align="center">

**"O futuro pertence àqueles que hackeiam o presente."**

*— ZERO-DAY, 2047*

</div>
