import { useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function Bank() {
  const { state, dispatch } = useGame();
  const [vaultAnswer, setVaultAnswer] = useState('');
  const [showVaultPuzzle, setShowVaultPuzzle] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const hackVault = () => {
    if (state.vault) return;
    setShowVaultPuzzle(true);
    setVaultAnswer('');
    setFeedback(null);
    dispatch({ type: 'START_TRACING' });
  };

  const checkVault = () => {
    const puzzle = state.puzzles.vault;
    if (!puzzle) return;
    
    if (vaultAnswer.trim() === puzzle.answer) {
      dispatch({ type: 'VAULT_COMPLETE' });
      dispatch({ type: 'ADD_SCORE', points: 500 });
      dispatch({ type: 'ADD_ACHIEVEMENT', id: 'vault_cracked' });
      setFeedback({ type: 'success', text: '✅ COFRE ABERTO! $50M transferidos!' });
      setTimeout(() => setShowVaultPuzzle(false), 1500);
    } else {
      dispatch({ type: 'ADD_TRACE', amount: 10 });
      setFeedback({ type: 'error', text: '❌ Sequência incorreta — Trace +10%' });
    }
  };

  const hackTransfer = () => {
    if (!state.vault) {
      setFeedback({ type: 'error', text: '⚠️ Abra o cofre primeiro!' });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }
    if (state.transfer) return;
    dispatch({ type: 'TRANSFER_COMPLETE' });
    dispatch({ type: 'ADD_SCORE', points: 500 });
    dispatch({ type: 'ADD_ACHIEVEMENT', id: 'money_transfer' });
    setFeedback({ type: 'success', text: '💰 $50M redirecionados para conta offshore!' });
  };

  return (
    <div style={{ padding: 14 }}>
      {/* Vault Puzzle Modal */}
      {showVaultPuzzle && state.puzzles.vault && (
        <div className="puzzle-overlay">
          <div className="puzzle-box">
            <div className="puzzle-title">🏦 COFRE DIGITAL</div>
            <div className="puzzle-desc" style={{ whiteSpace: 'pre-line' }}>
              {state.puzzles.vault.desc}
            </div>
            <input
              className="puzzle-input"
              value={vaultAnswer}
              onChange={(e) => setVaultAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkVault()}
              placeholder="Resposta..."
              autoFocus
            />
            {feedback && (
              <div className={`puzzle-feedback ${feedback.type}`}>{feedback.text}</div>
            )}
            <div className="puzzle-buttons" style={{ marginTop: 12 }}>
              <button className="puzzle-btn puzzle-btn-ok" onClick={checkVault}>ENVIAR</button>
              <button className="puzzle-btn puzzle-btn-hint" onClick={() => {
                setFeedback({ type: 'hint', text: `💡 ${state.puzzles.vault.hint}` });
                dispatch({ type: 'ADD_TRACE', amount: 3 });
              }}>DICA</button>
              <button className="puzzle-btn puzzle-btn-cancel" onClick={() => setShowVaultPuzzle(false)}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}

      {/* Balance */}
      <div className="bank-balance-card">
        <div className="bank-balance-label">Saldo Disponível</div>
        <div className="bank-balance-value">
          ${state.bankBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* Hack Targets */}
      <div
        className={`hack-target ${state.vault ? 'completed' : ''}`}
        onClick={hackVault}
      >
        <div className="hack-target-info">
          <div className="hack-target-name">🔐 Cofre Digital</div>
          <div className="hack-target-desc">Contas offshore — $50M disponíveis</div>
        </div>
        <span className="hack-target-status">{state.vault ? '🟢' : '🔴'}</span>
      </div>

      <div
        className={`hack-target ${state.transfer ? 'completed' : ''}`}
        onClick={hackTransfer}
      >
        <div className="hack-target-info">
          <div className="hack-target-name">💸 Transferência</div>
          <div className="hack-target-desc">Redirecionar fundos para conta segura</div>
        </div>
        <span className="hack-target-status">{state.transfer ? '🟢' : '🔴'}</span>
      </div>

      {feedback && !showVaultPuzzle && (
        <div className={`puzzle-feedback ${feedback.type}`} style={{ marginTop: 12 }}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}
