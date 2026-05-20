import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { state } = useGame();

  const entries = state.leaderboard.length > 0
    ? state.leaderboard
    : [
        { name: 'CIPHER', score: 8500 },
        { name: 'N3ON', score: 7200 },
        { name: 'PHANTOM', score: 6800 },
        { name: 'VORTEX', score: 5400 },
        { name: 'SPECTR3', score: 4100 },
      ];

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">🏆 RANKING GLOBAL 🏆</div>
      {entries.map((entry, i) => (
        <div key={entry.id || i} className="leaderboard-entry">
          <span className="leaderboard-rank">#{i + 1}</span>
          <span className="leaderboard-name">{entry.name}</span>
          <span className="leaderboard-score">{entry.score?.toLocaleString()}</span>
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
