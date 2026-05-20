import { useGame } from '../context/GameContext';

export default function HUD() {
  const { state } = useGame();

  return (
    <div className="hud">
      <div className="hud-item">
        <div>
          <div className="hud-item-label">SCORE</div>
          <div className="hud-item-value green">{state.score.toLocaleString()}</div>
        </div>
      </div>
      <div className="hud-item">
        <div>
          <div className="hud-item-label">HACKS</div>
          <div className={`hud-item-value ${state.hackCount >= 5 ? 'green' : ''}`}>
            {state.hackCount}/5
          </div>
        </div>
      </div>
      <div className="hud-item">
        <div>
          <div className="hud-item-label">NÍVEL</div>
          <div className={`hud-item-value ${state.isAdmin ? 'green' : 'amber'}`}>
            {state.isAdmin ? 'ROOT' : 'GUEST'}
          </div>
        </div>
      </div>
      {state.countdown !== null && (
        <div className="hud-item" style={{ borderColor: 'var(--red-500)' }}>
          <div>
            <div className="hud-item-label" style={{ color: 'var(--red-400)' }}>COUNTDOWN</div>
            <div className="hud-item-value red">
              00:{state.countdown.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
