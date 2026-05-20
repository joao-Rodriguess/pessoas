import { useGame } from '../context/GameContext';

export default function TraceBar() {
  const { state } = useGame();

  if (!state.tracing) return null;

  return (
    <div className="trace-bar">
      <span className="trace-label">⚠️ RASTREAMENTO:</span>
      <div className="trace-bar-track">
        <div
          className="trace-bar-fill"
          style={{ width: `${state.trace}%` }}
        />
      </div>
      <span className="trace-pct">{Math.round(state.trace)}%</span>
      {state.vpnActive && (
        <span style={{ fontSize: 10, color: 'var(--green-400)' }}>🛡️ VPN</span>
      )}
      {state.proxyActive && (
        <span style={{ fontSize: 10, color: 'var(--amber-400)' }}>🔄 PROXY</span>
      )}
    </div>
  );
}
