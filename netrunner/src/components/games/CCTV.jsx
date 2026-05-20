import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

export default function CCTV() {
  const { state, dispatch } = useGame();
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('pt-BR'));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const cameras = [
    { id: 'cam1', label: 'CAM-01: Lobby', online: true },
    { id: 'cam2', label: 'CAM-02: Server Room', online: true },
    { id: 'cam3', label: 'CAM-03: Vault', online: false },
    { id: 'cam4', label: 'CAM-04: Control Room', online: true },
  ];

  const handleDisable = () => {
    if (state.cctvDisabled) return;
    dispatch({ type: 'DISABLE_CCTV' });
    dispatch({ type: 'ADD_SCORE', points: 200 });
    dispatch({ type: 'ADD_ACHIEVEMENT', id: 'cameras_off' });
    dispatch({ type: 'START_TRACING' });
  };

  return (
    <div style={{ padding: 14 }}>
      <div className="cctv-grid">
        {cameras.map((cam) => (
          <div
            key={cam.id}
            className={`cctv-feed ${state.cctvDisabled ? 'glitch' : ''}`}
          >
            {state.cctvDisabled ? (
              <span className="cctv-label offline">📵 DESATIVADA</span>
            ) : cam.online ? (
              <>
                <span className="cctv-label">{cam.label}</span>
                <span className="cctv-timestamp">{time}</span>
              </>
            ) : (
              <span className="cctv-label offline">{cam.label}: OFFLINE</span>
            )}
          </div>
        ))}
      </div>

      <button
        className="cctv-disable-btn"
        onClick={handleDisable}
        disabled={state.cctvDisabled}
        style={state.cctvDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
      >
        {state.cctvDisabled ? '📵 CÂMERAS DESATIVADAS' : '🚫 DESATIVAR TODAS AS CÂMERAS'}
      </button>
    </div>
  );
}
