import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function GameOver() {
  const { state, submitScore } = useGame();
  const { user } = useAuth();

  useEffect(() => {
    if (state.score > 0) submitScore(user);
  }, [submitScore, user, state.score]);

  const reason = state.trace >= 100
    ? 'Seu sinal foi rastreado. O FBI localizou seu endereço.'
    : state.countdown !== null && state.countdown <= 0
    ? 'O countdown chegou a zero. Os mísseis foram lançados.'
    : 'A missão falhou.';

  return (
    <div className="endscreen gameover">
      <div className="endscreen-icon">🛡️</div>
      <h1 className="endscreen-title">⚠️ CAPTURADO ⚠️</h1>
      <p className="endscreen-subtitle">{reason}</p>
      <div className="endscreen-score">
        SCORE: {state.score.toLocaleString()}
      </div>
      <button
        className="endscreen-btn"
        onClick={() => window.location.reload()}
      >
        🔄 TENTAR NOVAMENTE
      </button>
    </div>
  );
}
