import { createContext, useContext, useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { rtdb, isFirebaseConfigured } from '../firebase';
import { ref, set, get, push, onValue, query, orderByChild, limitToLast } from 'firebase/database';

const GameContext = createContext(null);

// ── Puzzle pools (randomized each game) ──
const PUZZLE_POOLS = {
  firewall: [
    { desc: 'F(n) = 2^n + n²\n\nSe n = 4, F(n) = ?', answer: '32', hint: '2⁴ = 16, 4² = 16, 16+16 = ?' },
    { desc: 'F(n) = 3n² - 2n + 1\n\nSe n = 5, F(n) = ?', answer: '66', hint: '3×25 - 10 + 1' },
    { desc: 'Sequência XOR: 1010 ⊕ 0110 = ?', answer: '1100', hint: 'XOR: bits iguais = 0, diferentes = 1' },
    { desc: 'Hex: 0xFF - 0x0A = ? (em decimal)', answer: '245', hint: '255 - 10' },
  ],
  encryption: [
    { desc: 'Cifra de César +3:\nVHQKD = ?', answer: 'SENHA', hint: 'V-3=S, H-3=E, Q-3=N...' },
    { desc: 'Cifra de César +5:\nHTZWJ = ?', answer: 'CORPO', hint: 'H-5=C, T-5=O...' },
    { desc: 'Base64: R0hPU1Q= = ?', answer: 'GHOST', hint: 'Decodifique Base64' },
    { desc: 'ROT13: NPPRFF = ?', answer: 'ACCESS', hint: 'ROT13: A↔N, B↔O, C↔P...' },
  ],
  auth: [
    { desc: '(hora × 1000) + (min × 10)\n\n14:35 = ?', answer: '14350', hint: '14×1000 + 35×10' },
    { desc: 'TOTP: seed=42, counter=3\nHash = seed × counter + 777', answer: '903', hint: '42 × 3 + 777' },
    { desc: 'SHA parcial: os 3 primeiros dígitos de\n2^10 = ?', answer: '102', hint: '2^10 = 1024' },
  ],
  database: [
    { desc: "Para bypass de login SQL:\npass = ' + ? = bypass", answer: "' OR 1=1", hint: "OR 1=1 faz a condição ser sempre verdadeira", check: (v) => v.toLowerCase().replace(/\s/g, '').includes("or1=1") },
    { desc: "Complete o SQL Injection:\nSELECT * FROM users WHERE id = ?;\n(para retornar TODOS os registros)", answer: "1 OR 1=1", hint: "1 OR 1=1 retorna todas as linhas", check: (v) => v.toLowerCase().replace(/\s/g, '').includes("or1=1") },
  ],
  network: [
    { desc: 'Binário para IP:\n11000000.10101000.00000001.00000001', answer: '192.168.1.1', hint: '11000000 = 192' },
    { desc: 'Qual é a máscara /24 em notação decimal?', answer: '255.255.255.0', hint: '/24 = 24 bits 1, 8 bits 0' },
    { desc: 'IP Classe A privado começa com:\n10._._._ \nQual o range? (ex: 10.0.0.0)', answer: '10.0.0.0', hint: 'Classe A privada: 10.x.x.x' },
  ],
  vault: [
    { desc: 'Sequência:\n2, 6, 12, 20, 30, ?', answer: '42', hint: '+4, +6, +8, +10, +12' },
    { desc: 'Fibonacci modificado:\n1, 1, 2, 3, 5, 8, 13, ?', answer: '21', hint: 'Cada número é a soma dos 2 anteriores' },
    { desc: 'Fatorial: 6! ÷ 3! = ?', answer: '120', hint: '720 ÷ 6' },
  ],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const initialState = {
  phase: 'boot', // boot → login → narrative → desktop → victory / gameover
  score: 0,
  trace: 0,
  tracing: false,
  traceInterval: null,
  isAdmin: false,
  alertMode: false, // trace > 70%

  // Hacks
  firewall: false,
  encryption: false,
  auth: false,
  database: false,
  network: false,
  hackCount: 0,

  // Bank
  vault: false,
  transfer: false,
  bankBalance: 0,

  // Power
  powerSectors: { east: true, west: true, north: true, south: true },

  // CCTV
  cctvDisabled: false,

  // Missile
  codeAlpha: false,
  codeBeta: false,
  countdown: null,
  missileAborted: false,

  // Puzzles (randomized)
  puzzles: {},

  // Power-ups
  powerups: { vpn: false, proxy: false, exploit: false },
  vpnActive: false,
  proxyActive: false,

  // Windows
  openWindows: [],
  focusedWindow: null,

  // Narrative
  narrativeQueue: [],
  currentNarrative: null,

  // Achievements
  achievements: [],

  // Leaderboard
  leaderboard: [],

  // Game Over flag
  gameOver: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'INIT_PUZZLES':
      return {
        ...state,
        puzzles: {
          firewall: pickRandom(PUZZLE_POOLS.firewall),
          encryption: pickRandom(PUZZLE_POOLS.encryption),
          auth: pickRandom(PUZZLE_POOLS.auth),
          database: pickRandom(PUZZLE_POOLS.database),
          network: pickRandom(PUZZLE_POOLS.network),
          vault: pickRandom(PUZZLE_POOLS.vault),
        },
      };

    case 'ADD_SCORE':
      return { ...state, score: state.score + action.points };

    case 'ADD_TRACE': {
      const newTrace = Math.min(100, state.trace + action.amount);
      const newAlert = newTrace >= 70;
      if (newTrace >= 100) {
        return { ...state, trace: 100, alertMode: true, phase: 'gameover', gameOver: true };
      }
      return { ...state, trace: newTrace, alertMode: newAlert };
    }

    case 'START_TRACING':
      return { ...state, tracing: true };

    case 'HACK_COMPLETE': {
      const newState = { ...state, [action.hack]: true };
      newState.hackCount = ['firewall', 'encryption', 'auth', 'database', 'network']
        .filter((h) => newState[h]).length;
      if (action.hack === 'auth') {
        newState.isAdmin = true;
      }
      return newState;
    }

    case 'VAULT_COMPLETE':
      return { ...state, vault: true, bankBalance: 50000000 };

    case 'TRANSFER_COMPLETE':
      return { ...state, transfer: true };

    case 'TOGGLE_POWER': {
      const sectors = { ...state.powerSectors };
      sectors[action.sector] = !sectors[action.sector];
      return { ...state, powerSectors: sectors };
    }

    case 'DISABLE_CCTV':
      return { ...state, cctvDisabled: true };

    case 'CODE_ALPHA':
      return { ...state, codeAlpha: true };

    case 'CODE_BETA':
      return { ...state, codeBeta: true, countdown: 30 };

    case 'TICK_COUNTDOWN': {
      if (state.countdown === null || state.gameOver) return state;
      const next = state.countdown - 1;
      if (next <= 0) return { ...state, countdown: 0, phase: 'gameover', gameOver: true };
      return { ...state, countdown: next };
    }

    case 'ABORT_MISSILE':
      return { ...state, missileAborted: true, countdown: null, phase: 'victory', gameOver: true };

    case 'OPEN_WINDOW': {
      if (state.openWindows.includes(action.id)) {
        return { ...state, focusedWindow: action.id };
      }
      return {
        ...state,
        openWindows: [...state.openWindows, action.id],
        focusedWindow: action.id,
      };
    }

    case 'CLOSE_WINDOW':
      return {
        ...state,
        openWindows: state.openWindows.filter((w) => w !== action.id),
        focusedWindow: state.openWindows.filter((w) => w !== action.id).slice(-1)[0] || null,
      };

    case 'FOCUS_WINDOW':
      return { ...state, focusedWindow: action.id };

    case 'PUSH_NARRATIVE':
      return { ...state, narrativeQueue: [...state.narrativeQueue, action.narrative] };

    case 'SHOW_NEXT_NARRATIVE': {
      const [next, ...rest] = state.narrativeQueue;
      return { ...state, currentNarrative: next || null, narrativeQueue: rest };
    }

    case 'DISMISS_NARRATIVE':
      return { ...state, currentNarrative: null };

    case 'ADD_ACHIEVEMENT':
      if (state.achievements.includes(action.id)) return state;
      return { ...state, achievements: [...state.achievements, action.id] };

    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.data };

    case 'USE_POWERUP': {
      const pups = { ...state.powerups, [action.id]: true };
      const extras = {};
      if (action.id === 'vpn') extras.vpnActive = true;
      if (action.id === 'proxy') extras.proxyActive = true;
      return { ...state, powerups: pups, ...extras };
    }

    case 'DEACTIVATE_PROXY':
      return { ...state, proxyActive: false };

    case 'LOAD_SAVED_STATE': {
      if (!action.data) return state;
      const { stats, achievements, score, vault, transfer, powerups, ...otherData } = action.data;
      return {
        ...state,
        ...otherData,
        score,
        achievements,
        vault,
        transfer,
        powerups,
        ...(stats && {
          firewall: stats.firewall,
          encryption: stats.encryption,
          auth: stats.auth,
          database: stats.database,
          network: stats.network,
          hackCount: stats.hackCount,
          bankBalance: stats.bankBalance,
          cctvDisabled: stats.cctvDisabled,
          missileAborted: stats.missileAborted,
        }),
      };
    }

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState('ready'); // ready | saving | saved | error
  const traceRef = useRef(null);
  const countdownRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Trace timer
  useEffect(() => {
    if (state.tracing && !state.gameOver) {
      if (traceRef.current) clearInterval(traceRef.current);
      traceRef.current = setInterval(() => {
        if (!state.proxyActive) {
          const amount = state.vpnActive ? 0.5 : 1;
          dispatch({ type: 'ADD_TRACE', amount });
        }
      }, 1000);
    }
    return () => { if (traceRef.current) clearInterval(traceRef.current); };
  }, [state.tracing, state.gameOver, state.vpnActive, state.proxyActive]);

  // Countdown timer
  useEffect(() => {
    if (state.countdown !== null && state.countdown > 0 && !state.gameOver) {
      if (countdownRef.current) clearInterval(countdownRef.current);
      countdownRef.current = setInterval(() => {
        dispatch({ type: 'TICK_COUNTDOWN' });
      }, 1000);
    }
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [state.countdown, state.gameOver]);

  // Leaderboard listener
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    try {
      const dbRef = ref(rtdb, 'leaderboard');
      const q = query(dbRef, orderByChild('score'), limitToLast(10));
      const unsub = onValue(q, (snap) => {
        const scores = [];
        snap.forEach((child) => {
          scores.push({ id: child.key, ...child.val() });
        });
        // Realtime Database queries return in ascending order.
        // We reverse to get descending order (highest score first).
        scores.reverse();
        dispatch({ type: 'SET_LEADERBOARD', data: scores });
      }, (err) => {
        console.warn('Leaderboard error:', err);
      });
      return () => unsub();
    } catch (err) {
      console.warn('Realtime Database not available:', err);
    }
  }, []);

  // ── Firebase Helper: Save game progress ──
  const saveGameProgress = useCallback(async (currentUser, currentState) => {
    if (!isFirebaseConfigured || !currentUser || currentUser.offline) return null;
    try {
      setSaveStatus('saving');
      const userRef = ref(rtdb, 'users/' + currentUser.uid);
      const gameProgressData = {
        displayName: currentUser.displayName || 'GHOST',
        score: currentState.score,
        trace: currentState.trace,
        phase: currentState.phase,
        achievements: currentState.achievements,
        stats: {
          firewall: currentState.firewall,
          encryption: currentState.encryption,
          auth: currentState.auth,
          database: currentState.database,
          network: currentState.network,
          vault: currentState.vault,
          hackCount: currentState.hackCount,
          bankBalance: currentState.bankBalance,
          cctvDisabled: currentState.cctvDisabled,
          missileAborted: currentState.missileAborted,
        },
        powerups: currentState.powerups,
        lastSaved: Date.now(),
      };
      await set(userRef, gameProgressData);
      setSaveStatus('saved');
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('ready'), 2000);
    } catch (err) {
      console.warn('Game save error:', err);
      setSaveStatus('error');
    }
  }, []);

  // ── Firebase Helper: Load saved game progress ──
  const loadGameProgress = useCallback(async (currentUser) => {
    if (!isFirebaseConfigured || !currentUser || currentUser.offline) return null;
    try {
      const userRef = ref(rtdb, 'users/' + currentUser.uid);
      const snap = await get(userRef);
      if (snap.exists()) {
        return snap.val();
      }
    } catch (err) {
      console.warn('Game load error:', err);
    }
    return null;
  }, []);

  // ── Firebase Helper: Log achievement unlock ──
  const logAchievementUnlock = useCallback(async (currentUser, achievementId) => {
    if (!isFirebaseConfigured || !currentUser || currentUser.offline) return;
    try {
      const achievementsRef = ref(rtdb, `users/${currentUser.uid}/achievements`);
      await push(achievementsRef, {
        achievementId,
        unlockedAt: Date.now(),
        score: state.score,
      });
    } catch (err) {
      console.warn('Achievement log error:', err);
    }
  }, [state.score]);

  const submitScore = useCallback(async (submitUser) => {
    if (!isFirebaseConfigured || !submitUser) return;
    try {
      const leaderboardRef = ref(rtdb, 'leaderboard');
      await push(leaderboardRef, {
        uid: submitUser.uid,
        name: submitUser.displayName || 'GHOST',
        score: state.score,
        achievements: state.achievements.length,
        hacks: state.hackCount,
        trace: state.trace,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.warn('Score submit error:', err);
    }
  }, [state.score, state.achievements, state.hackCount, state.trace]);

  // ── Track user for auto-save ──
  // The user is set by the AuthContext integration above

  // ── Auto-save game progress every 30 seconds when playing ──
  useEffect(() => {
    if (!user || user.offline || !isFirebaseConfigured) return;
    if (state.phase === 'boot' || state.phase === 'login') return; // Don't save on these screens

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveGameProgress(user, state);
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state, user, saveGameProgress]);

  // ── Log new achievements ──
  useEffect(() => {
    if (!user || user.offline || !isFirebaseConfigured) return;
    state.achievements.forEach((ach) => {
      logAchievementUnlock(user, ach);
    });
  }, [state.achievements, user, logAchievementUnlock]);

  return (
    <GameContext.Provider value={{ state, dispatch, submitScore, saveGameProgress, loadGameProgress, saveStatus, setUser }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
