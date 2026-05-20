import { useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function HackTools() {
  const { state, dispatch } = useGame();
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const targets = [
    { id: 'firewall', icon: '🛡️', name: 'Firewall', desc: 'Sistema de proteção perimetral', requires: null },
    { id: 'encryption', icon: '🔐', name: 'Criptografia', desc: 'Descriptografar arquivos classificados', requires: 'firewall' },
    { id: 'auth', icon: '🔑', name: 'Autenticação 2FA', desc: 'Bypassar login administrativo', requires: 'encryption' },
    { id: 'database', icon: '🗄️', name: 'SQL Injection', desc: 'Acessar banco de dados interno', requires: null },
    { id: 'network', icon: '📡', name: 'Interceptar Rede', desc: 'Man-in-the-middle attack', requires: null },
  ];

  const hackPct = (state.hackCount / 5) * 100;

  const openPuzzle = (target) => {
    if (state[target.id]) return; // already done
    if (target.requires && !state[target.requires]) {
      setFeedback({ type: 'error', text: `⚠️ Precisa hackear ${target.requires} primeiro!` });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    dispatch({ type: 'START_TRACING' });
    setActivePuzzle(target.id);
    setAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const puzzle = state.puzzles[activePuzzle];
    if (!puzzle) return;

    let correct = false;
    if (puzzle.check) {
      correct = puzzle.check(answer);
    } else {
      correct = answer.trim().toUpperCase() === puzzle.answer.toUpperCase();
    }

    if (correct) {
      dispatch({ type: 'HACK_COMPLETE', hack: activePuzzle });
      dispatch({ type: 'ADD_SCORE', points: activePuzzle === 'auth' ? 300 : 200 });
      dispatch({ type: 'ADD_ACHIEVEMENT', id: `hack_${activePuzzle}` });
      setFeedback({ type: 'success', text: '✅ ACESSO CONCEDIDO!' });

      // Narrative triggers
      if (activePuzzle === 'auth') {
        dispatch({
          type: 'PUSH_NARRATIVE',
          narrative: {
            speaker: 'ARIA — I.A. PARCEIRA',
            text: 'Excelente, GHOST! Você agora tem acesso ROOT ao sistema.\n\nCom privilégios de administrador, você pode acessar o painel DEFCON-1.\n\nMas atenção: o General Webb está monitorando. O ícone do DEFCON-1 aparecerá no desktop quando tivermos hacks suficientes.',
          },
        });
        dispatch({ type: 'SHOW_NEXT_NARRATIVE' });
      }

      if (state.hackCount + 1 >= 3) {
        dispatch({
          type: 'PUSH_NARRATIVE',
          narrative: {
            speaker: 'ZERO-DAY — FACÇÃO',
            text: '📡 Mensagem criptografada recebida:\n\n"Ghost, progresso impressionante. O painel DEFCON-1 está desbloqueado no desktop. Use os códigos dos emails e arquivos para abortar os mísseis.\n\nVocê é nossa última esperança."\n\n— ZERO-DAY',
          },
        });
        setTimeout(() => dispatch({ type: 'SHOW_NEXT_NARRATIVE' }), 500);
      }

      setTimeout(() => {
        setActivePuzzle(null);
        setFeedback(null);
      }, 1500);
    } else {
      dispatch({ type: 'ADD_TRACE', amount: 8 });
      setFeedback({ type: 'error', text: '❌ ACESSO NEGADO — Trace +8%' });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const showHint = () => {
    const puzzle = state.puzzles[activePuzzle];
    if (puzzle) {
      setFeedback({ type: 'hint', text: `💡 ${puzzle.hint}` });
      dispatch({ type: 'ADD_TRACE', amount: 3 });
    }
  };

  return (
    <div style={{ padding: 14 }}>
      {/* Puzzle Modal */}
      {activePuzzle && state.puzzles[activePuzzle] && (
        <div className="puzzle-overlay">
          <div className="puzzle-box">
            <div className="puzzle-title">
              {targets.find(t => t.id === activePuzzle)?.icon} {targets.find(t => t.id === activePuzzle)?.name?.toUpperCase()}
            </div>
            <div className="puzzle-desc" style={{ whiteSpace: 'pre-line' }}>
              {state.puzzles[activePuzzle].desc}
            </div>
            <input
              className="puzzle-input"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Resposta..."
              autoFocus
            />
            {feedback && (
              <div className={`puzzle-feedback ${feedback.type === 'success' ? 'success' : 'error'}`}>
                {feedback.text}
              </div>
            )}
            <div className="puzzle-buttons" style={{ marginTop: 12 }}>
              <button className="puzzle-btn puzzle-btn-ok" onClick={checkAnswer}>
                ENVIAR
              </button>
              <button className="puzzle-btn puzzle-btn-hint" onClick={showHint}>
                DICA
              </button>
              <button className="puzzle-btn puzzle-btn-cancel" onClick={() => setActivePuzzle(null)}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Target List */}
      {targets.map((target) => (
        <div
          key={target.id}
          className={`hack-target ${state[target.id] ? 'completed' : ''}`}
          onClick={() => openPuzzle(target)}
        >
          <div className="hack-target-info">
            <div className="hack-target-name">
              {target.icon} {target.name}
              {target.requires && !state[target.requires] && (
                <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 8 }}>
                  🔒 requer {target.requires}
                </span>
              )}
            </div>
            <div className="hack-target-desc">{target.desc}</div>
          </div>
          <span className="hack-target-status">
            {state[target.id] ? '🟢' : '🔴'}
          </span>
        </div>
      ))}

      {/* Inline feedback */}
      {feedback && !activePuzzle && (
        <div className={`puzzle-feedback ${feedback.type}`} style={{ marginTop: 8 }}>
          {feedback.text}
        </div>
      )}

      {/* Progress */}
      <div className="hack-progress-section">
        <div className="hack-progress-label">PROGRESSO DA INFILTRAÇÃO</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${hackPct}%` }} />
        </div>
        <div className="progress-text">{hackPct}% — {state.hackCount}/5 sistemas comprometidos</div>
      </div>

      {/* Power-ups */}
      <div className="powerup-bar">
        <div
          className={`powerup-item ${state.powerups.vpn ? 'used' : ''}`}
          onClick={() => {
            if (!state.powerups.vpn) {
              dispatch({ type: 'USE_POWERUP', id: 'vpn' });
              dispatch({ type: 'ADD_SCORE', points: 50 });
            }
          }}
        >
          🛡️ VPN {state.vpnActive ? '(ATIVO)' : ''}
        </div>
        <div
          className={`powerup-item ${state.powerups.proxy ? 'used' : ''}`}
          onClick={() => {
            if (!state.powerups.proxy) {
              dispatch({ type: 'USE_POWERUP', id: 'proxy' });
              dispatch({ type: 'ADD_SCORE', points: 50 });
              setTimeout(() => dispatch({ type: 'DEACTIVATE_PROXY' }), 30000);
            }
          }}
        >
          🔄 Proxy {state.proxyActive ? '(30s)' : ''}
        </div>
      </div>
    </div>
  );
}
