import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';

export default function Login() {
  const { loginAnonymous, loginEmail } = useAuth();
  const { dispatch } = useGame();
  const [mode, setMode] = useState('main'); // main, email
  const [codename, setCodename] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const startGame = () => {
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
