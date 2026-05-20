import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Victory() {
  const { state, submitScore } = useGame();
  const { user } = useAuth();

  useEffect(() => {
    submitScore(user);
  }, [submitScore, user]);

  return (
    <div className="endscreen victory">
      <div className="endscreen-icon">🎖️</div>
      <h1 className="endscreen-title">MISSÃO COMPLETA</h1>
      <p className="endscreen-subtitle">
        Os mísseis foram desativados. Milhões de vidas salvas.
      </p>
      <div className="endscreen-score">
        SCORE: {state.score.toLocaleString()}
      </div>
      <div style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: 12 }}>
        🏆 Conquistas: {state.achievements.length} | 
        🎯 Hacks: {state.hackCount}/5 | 
        ⏱️ Trace: {Math.round(state.trace)}%
      </div>
      <button
        className="endscreen-btn"
        onClick={() => window.location.reload()}
      >
        🔄 JOGAR NOVAMENTE
      </button>
    </div>
  );
}
