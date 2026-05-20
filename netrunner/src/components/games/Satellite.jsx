import { useGame } from '../../context/GameContext';

export default function Satellite() {
  const { state } = useGame();

  const silos = [
    { id: 'silo1', label: 'SILO-01 Montana', top: '32%', left: '22%' },
    { id: 'silo2', label: 'SILO-02 Wyoming', top: '38%', left: '28%' },
    { id: 'silo3', label: 'SILO-03 Colorado', top: '44%', left: '25%' },
  ];

  return (
    <div className="satellite-map" style={{ height: '100%' }}>
      <div className="satellite-grid-lines" />

      {/* Data streams decoration */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: 2,
            height: 2,
            background: 'rgba(0, 212, 255, 0.3)',
            borderRadius: '50%',
            animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Silo markers */}
      {silos.map((silo) => (
        <div
          key={silo.id}
          className="silo-marker"
          style={{ top: silo.top, left: silo.left }}
          title={silo.label}
        />
      ))}

      {/* Connection lines between silos */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <line x1="23%" y1="33%" x2="29%" y2="39%" stroke="rgba(255,23,68,0.3)" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="29%" y1="39%" x2="26%" y2="45%" stroke="rgba(255,23,68,0.3)" strokeWidth="1" strokeDasharray="4,4" />
      </svg>

      {/* Info panel */}
      <div className="satellite-info">
        <div>DEFCON: <span className="satellite-defcon">1</span></div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
          Silos: {state.codeAlpha && state.codeBeta ? '🟢 DESBLOQUEADOS' : '🔴 ARMADOS'}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
          Aborted: {state.missileAborted ? '✅ SIM' : '❌ NÃO'}
        </div>
      </div>

      {/* Orbit line */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '80%',
        height: '60%',
        border: '1px dashed rgba(0, 212, 255, 0.1)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Satellite icon orbiting */}
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '25%',
        fontSize: 20,
        animation: 'pulse 3s ease-in-out infinite',
        filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.6))',
      }}>
        🛰️
      </div>
    </div>
  );
}
