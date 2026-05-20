import { useGame } from '../../context/GameContext';

export default function PowerGrid() {
  const { state, dispatch } = useGame();

  const sectors = [
    { id: 'east', name: 'Leste', watts: '15.2 GW' },
    { id: 'west', name: 'Oeste', watts: '18.7 GW' },
    { id: 'north', name: 'Norte', watts: '12.1 GW' },
    { id: 'south', name: 'Sul', watts: '20.5 GW' },
  ];

  const toggle = (id) => {
    dispatch({ type: 'TOGGLE_POWER', sector: id });
    dispatch({ type: 'ADD_SCORE', points: 100 });
    dispatch({ type: 'START_TRACING' });
  };

  const allOff = Object.values(state.powerSectors).every((v) => !v);

  return (
    <div style={{ padding: 14 }}>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          color: allOff ? 'var(--red-glow)' : 'var(--amber-400)',
          letterSpacing: 2,
        }}>
          {allOff ? '⚠️ BLACKOUT TOTAL ⚠️' : '⚡ GRADE DE ENERGIA — NEXUS'}
        </span>
      </div>

      <div className="power-grid">
        {sectors.map((sector) => {
          const online = state.powerSectors[sector.id];
          return (
            <div
              key={sector.id}
              className={`power-sector ${!online ? 'offline' : ''}`}
              onClick={() => toggle(sector.id)}
            >
              <div className="power-sector-status">
                {online ? '🟢' : '🔴'}
              </div>
              <div className="power-sector-name">{sector.name}</div>
              <div className="power-sector-watts">
                {online ? sector.watts : '0.0 GW'}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>
                {online ? 'ONLINE' : 'OFFLINE'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 16,
        padding: 12,
        background: 'rgba(0,15,30,0.5)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: 11,
        color: 'var(--text-secondary)',
        textAlign: 'center',
      }}>
        Clique nos setores para desligar/ligar a energia.
        {allOff && (
          <div style={{ color: 'var(--red-400)', marginTop: 8, fontWeight: 'bold' }}>
            🚨 ALERTA: Toda a energia da NEXUS foi cortada!
          </div>
        )}
      </div>
    </div>
  );
}
