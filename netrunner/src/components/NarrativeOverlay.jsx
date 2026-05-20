import { useGame } from '../context/GameContext';

export default function NarrativeOverlay() {
  const { state, dispatch } = useGame();

  if (!state.currentNarrative) return null;

  const handleContinue = () => {
    dispatch({ type: 'DISMISS_NARRATIVE' });
    // Show next if queued
    if (state.narrativeQueue.length > 0) {
      setTimeout(() => dispatch({ type: 'SHOW_NEXT_NARRATIVE' }), 300);
    }
  };

  return (
    <div className="narrative-overlay" onClick={handleContinue}>
      <div className="narrative-box" onClick={(e) => e.stopPropagation()}>
        <div className="narrative-speaker">
          {state.currentNarrative.speaker}
        </div>
        <div className="narrative-text" style={{ whiteSpace: 'pre-line' }}>
          {state.currentNarrative.text}
        </div>
        <button className="narrative-continue" onClick={handleContinue}>
          CONTINUAR →
        </button>
      </div>
    </div>
  );
}
