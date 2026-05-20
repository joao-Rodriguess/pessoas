import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { state } = useGame();

  const entries = state.leaderboard.length > 0
    ? state.leaderboard.map((entry, i) => ({
        ...entry,
        rank: i + 1,
      }))
    : [
        { name: 'CIPHER', score: 8500, achievements: 12, hacks: 5, rank: 1 },
        { name: 'N3ON', score: 7200, achievements: 10, hacks: 5, rank: 2 },
        { name: 'PHANTOM', score: 6800, achievements: 8, hacks: 4, rank: 3 },
        { name: 'VORTEX', score: 5400, achievements: 6, hacks: 3, rank: 4 },
        { name: 'SPECTR3', score: 4100, achievements: 4, hacks: 2, rank: 5 },
      ];

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">🏆 RANKING GLOBAL 🏆</div>
      {entries.map((entry) => (
        <div key={entry.id || entry.rank} className="leaderboard-entry" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(100,255,150,0.1)' }}>
          <div>
            <span className="leaderboard-rank" style={{ display: 'inline-block', width: '30px' }}>#{entry.rank}</span>
            <span className="leaderboard-name">{entry.name}</span>
          </div>
          <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <div style={{ color: 'var(--green-400)', fontWeight: 'bold' }}>{entry.score?.toLocaleString()}</div>
            <div>🎖️ {entry.achievements || 0} | 🎯 {entry.hacks || 0}/5</div>
          </div>
        </div>
      ))}
      {state.leaderboard.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 10, marginTop: 12 }}>
          ⚠️ Firebase offline — dados de exemplo
        </div>
      )}
    </div>
  );
}
