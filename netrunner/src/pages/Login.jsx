import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';

export default function Login() {
  const { loginAnonymous, loginEmail, loginGoogle, user } = useAuth();
  const { dispatch, loadGameProgress } = useGame();
  const [mode, setMode] = useState('main'); // main, email, resume
  const [codename, setCodename] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);

  useEffect(() => {
    // Check for saved progress after email login
    if (user && !user.offline && user.email && user.email.includes('@')) {
      loadGameProgress(user).then((saved) => {
        if (saved && saved.score > 0) {
          setSavedProgress(saved);
          setMode('resume');
        } else {
          // No saved progress, start new game
          startNewGame();
        }
      });
    }
  }, [user, loadGameProgress]);

  const startNewGame = () => {
    dispatch({ type: 'INIT_PUZZLES' });
    dispatch({
      type: 'PUSH_NARRATIVE',
      narrative: {
        speaker: 'ARIA — I.A. PARCEIRA',
        text: 'GHOST, estou conectada. Meu nome é ARIA.\n\nA facção ZERO-DAY te contratou para uma missão crítica: infiltrar os servidores da MegaCorp NEXUS e abortar o Projeto DEFCON-1.\n\nSe não pararmos os mísseis autônomos a tempo, 3 cidades serão destruídas.\n\nComece pelo Terminal e pelo HackTools. Eu vou te guiar.',
      },
    });
    dispatch({ type: 'SHOW_NEXT_NARRATIVE' });
    dispatch({ type: 'SET_PHASE', phase: 'desktop' });
  };

  const resumeGame = () => {
    if (!savedProgress) return;
    // Restore game state from saved progress
    dispatch({ type: 'LOAD_SAVED_STATE', data: savedProgress });
    dispatch({
      type: 'PUSH_NARRATIVE',
      narrative: {
        speaker: 'ARIA — I.A. PARCEIRA',
        text: `GHOST, recuperei sua sessão anterior.\n\nScore: ${savedProgress.score} | Hacks: ${savedProgress.stats?.hackCount || 0}/5 | Trace: ${Math.round(savedProgress.trace || 0)}%\n\nVamos terminar essa missão!`,
      },
    });
    dispatch({ type: 'SHOW_NEXT_NARRATIVE' });
    dispatch({ type: 'SET_PHASE', phase: 'desktop' });
  };

  const startGame = () => {
    startNewGame();
  };

  const handleAnonymous = async () => {
    setLoading(true);
    setError('');
    try {
      await loginAnonymous(codename || 'GHOST');
      startGame();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await loginGoogle();
      const isOffline = !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'demo-key';
      if (isOffline) {
        startGame();
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginEmail(email, password, codename || email.split('@')[0]);
      startGame();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">NETRUNNER</div>
        <div className="login-subtitle">SHADOW PROTOCOL</div>

        {error && (
          <div style={{ color: 'var(--red-400)', fontSize: 11, textAlign: 'center', marginBottom: 12, padding: '8px', background: 'rgba(255,23,68,0.1)', borderRadius: 'var(--radius-sm)' }}>
            ⚠️ {error}
          </div>
        )}

        {mode === 'main' ? (
          <>
            <input
              className="login-input"
              type="text"
              placeholder="Codinome (ex: GHOST)"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              maxLength={20}
              onKeyDown={(e) => e.key === 'Enter' && handleAnonymous()}
              autoFocus
            />

            <button
              className="login-btn login-btn-primary"
              onClick={handleAnonymous}
              disabled={loading}
            >
              {loading ? '⏳ CONECTANDO...' : '💀 INICIAR MISSÃO'}
            </button>

            <div className="login-divider">OU</div>

            <button
              className="login-btn login-btn-ghost"
              onClick={() => setMode('email')}
            >
              📧 LOGIN COM EMAIL (salva progresso)
            </button>

            <button
              className="login-btn login-btn-google"
              onClick={handleGoogle}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" style={{ fill: 'currentColor' }}>
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.74-.08-1.3-.176-1.859H12.24z"/>
              </svg>
              CONECTAR COM GOOGLE
            </button>
          </>
        ) : mode === 'resume' ? (
          <>
            <div style={{ background: 'rgba(100, 200, 255, 0.1)', padding: 12, borderRadius: 'var(--radius-sm)', marginBottom: 16, borderLeft: '3px solid var(--blue-400)' }}>
              <div style={{ color: 'var(--blue-300)', fontSize: 13, fontWeight: 'bold', marginBottom: 8 }}>📊 PROGRESSO SALVO</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Score: <span style={{ color: 'var(--green-400)' }}>{savedProgress?.score?.toLocaleString() || 0}</span><br />
                Hacks: {savedProgress?.stats?.hackCount || 0}/5 | Trace: {Math.round(savedProgress?.trace || 0)}%
              </div>
            </div>

            <button
              className="login-btn login-btn-primary"
              onClick={resumeGame}
              disabled={loading}
            >
              ▶️ RETOMAR MISSÃO
            </button>

            <button
              className="login-btn login-btn-ghost"
              onClick={startNewGame}
              style={{ marginTop: 8 }}
            >
              🆕 NOVA MISSÃO
            </button>
          </>
        ) : (
          <form onSubmit={handleEmail}>
            <input
              className="login-input"
              type="text"
              placeholder="Codinome"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              maxLength={20}
            />
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <input
              className="login-input"
              type="password"
              placeholder="Senha (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button
              className="login-btn login-btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? '⏳ CONECTANDO...' : '🔐 ENTRAR / REGISTRAR'}
            </button>

            <button
              className="login-btn login-btn-ghost"
              type="button"
              onClick={() => setMode('main')}
              style={{ marginTop: 8 }}
            >
              ← VOLTAR
            </button>
          </form>
        )}

        <div style={{ marginTop: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 9, lineHeight: 1.8 }}>
          "O futuro pertence àqueles que hackeiam o presente"<br />
          — ZERO-DAY, 2047
        </div>
      </div>
    </div>
  );
}
