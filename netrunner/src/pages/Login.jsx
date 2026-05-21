import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';

export default function Login() {
  const { loginAnonymous, loginEmail, loginGoogle, user } = useAuth();
  const { state, dispatch, loadGameProgress } = useGame();
  const [mode, setMode] = useState('main'); // main, email, resume
  const [codename, setCodename] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);

  // Detecção automática de dispositivo móvel na montagem
  useEffect(() => {
    const isMobileSize = window.innerWidth <= 768;
    dispatch({ type: 'SET_MOBILE_MODE', isMobileMode: isMobileSize });
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    // Se for um usuário offline, anônimo ou sem email estruturado, inicia um novo jogo imediatamente
    if (user.offline || user.isAnonymous || !user.email || !user.email.includes('@')) {
      startNewGame();
      return;
    }

    // Se for um usuário autenticado online com e-mail (Google ou E-mail/Senha)
    setLoading(true);
    loadGameProgress(user)
      .then((saved) => {
        if (saved && saved.score > 0) {
          setSavedProgress(saved);
          setMode('resume');
        } else {
          // Sem progresso prévio, inicia novo jogo
          startNewGame();
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar progresso salvo:', err);
        // Fallback seguro: inicia jogo novo mesmo se o carregamento falhar
        startNewGame();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, loadGameProgress]);

  const startNewGame = () => {
    dispatch({ type: 'INIT_PUZZLES' });

    const narrativeText = state.isMobileMode
      ? 'GHOST, as transmissões indicam que a Nexus-Core e seus financiadores terroristas estão reunidos no bunker subterrâneo agora. Conectei o detonador remoto ao seu celular hacker, mas as frequências ALPHA e BETA estão trancadas nos servidores da corporação. Invada os sistemas deles e ative a detonação antes que o FBI triangule seu sinal móvel!'
      : 'GHOST, estou conectada. Meu nome é ARIA.\n\nA facção ZERO-DAY te contratou para uma missão crítica: infiltrar os servidores da MegaCorp NEXUS e abortar o Projeto DEFCON-1.\n\nSe não pararmos os mísseis autônomos a tempo, 3 cidades serão destruídas.\n\nComece pelo Terminal e pelo HackTools. Eu vou te guiar.';

    dispatch({
      type: 'PUSH_NARRATIVE',
      narrative: {
        speaker: state.isMobileMode ? 'ARIA — I.A. TÁTICA' : 'ARIA — I.A. PARCEIRA',
        text: narrativeText,
      },
    });
    dispatch({ type: 'SHOW_NEXT_NARRATIVE' });
    dispatch({ type: 'SET_PHASE', phase: 'desktop' });
  };

  const resumeGame = () => {
    if (!savedProgress) return;
    // Restore game state from saved progress
    dispatch({ type: 'LOAD_SAVED_STATE', data: savedProgress });

    const resumeText = state.isMobileMode
      ? `GHOST, sinal criptografado restabelecido.\n\nScore: ${savedProgress.score} | Hacks: ${savedProgress.stats?.hackCount || 0}/5 | Rastreamento do FBI: ${Math.round(savedProgress.trace || 0)}%\n\nO bunker deles está logo à frente. Termine de coletar as chaves de acesso!`
      : `GHOST, recuperei sua sessão anterior.\n\nScore: ${savedProgress.score} | Hacks: ${savedProgress.stats?.hackCount || 0}/5 | Trace: ${Math.round(savedProgress.trace || 0)}%\n\nVamos terminar essa missão!`;

    dispatch({
      type: 'PUSH_NARRATIVE',
      narrative: {
        speaker: state.isMobileMode ? 'ARIA — I.A. TÁTICA' : 'ARIA — I.A. PARCEIRA',
        text: resumeText,
      },
    });
    dispatch({ type: 'SHOW_NEXT_NARRATIVE' });
    dispatch({ type: 'SET_PHASE', phase: 'desktop' });
  };

  const handleAnonymous = async () => {
    setLoading(true);
    setError('');
    try {
      await loginAnonymous(codename || 'GHOST');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await loginGoogle();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginEmail(email, password, codename || email.split('@')[0]);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">NETRUNNER</div>
        <div className="login-subtitle">SHADOW PROTOCOL</div>

        {/* Seletor de Modo de Dispositivo Cyberpunk */}
        <div className="login-mode-selector" style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '14px 0 18px 0', padding: '4px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--blue-500)' }}>
          <button 
            type="button"
            onClick={() => dispatch({ type: 'SET_MOBILE_MODE', isMobileMode: false })}
            style={{ flex: 1, padding: '8px 0', fontSize: 10, background: !state.isMobileMode ? 'rgba(0, 212, 255, 0.15)' : 'transparent', color: !state.isMobileMode ? 'var(--blue-300)' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: !state.isMobileMode ? 'bold' : 'normal', fontFamily: 'var(--font-mono)', textShadow: !state.isMobileMode ? '0 0 5px rgba(0, 212, 255, 0.4)' : 'none' }}
          >
            🖥️ MODO DESKTOP
          </button>
          <button 
            type="button"
            onClick={() => dispatch({ type: 'SET_MOBILE_MODE', isMobileMode: true })}
            style={{ flex: 1, padding: '8px 0', fontSize: 10, background: state.isMobileMode ? 'rgba(0, 255, 102, 0.15)' : 'transparent', color: state.isMobileMode ? 'var(--green-400)' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: state.isMobileMode ? 'bold' : 'normal', fontFamily: 'var(--font-mono)', textShadow: state.isMobileMode ? '0 0 5px rgba(0, 255, 102, 0.4)' : 'none' }}
          >
            📱 CELULAR HACKER
          </button>
        </div>

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
