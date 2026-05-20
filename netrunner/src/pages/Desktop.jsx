import { useGame } from '../context/GameContext';
import Window from '../components/Window';
import Taskbar from '../components/Taskbar';
import TraceBar from '../components/TraceBar';
import HUD from '../components/HUD';
import Leaderboard from '../components/Leaderboard';
import Terminal from '../components/games/Terminal';
import HackTools from '../components/games/HackTools';
import Email from '../components/games/Email';
import FileSystem from '../components/games/FileSystem';
import Database from '../components/games/Database';
import Bank from '../components/games/Bank';
import PowerGrid from '../components/games/PowerGrid';
import CCTV from '../components/games/CCTV';
import Satellite from '../components/games/Satellite';
import MissileControl from '../components/games/MissileControl';
import Calculator from '../components/games/Calculator';
import Notepad from '../components/games/Notepad';

const DESKTOP_ICONS = [
  { id: 'terminal', icon: '💻', label: 'Terminal' },
  { id: 'hack', icon: '👾', label: 'HackTools' },
  { id: 'email', icon: '📧', label: 'Email' },
  { id: 'files', icon: '📁', label: 'Arquivos' },
  { id: 'db', icon: '🗄️', label: 'Database' },
  { id: 'bank', icon: '🏦', label: 'Banco' },
  { id: 'power', icon: '⚡', label: 'PowerGrid' },
  { id: 'sat', icon: '🛰️', label: 'Satélite' },
  { id: 'cctv', icon: '📹', label: 'CCTV' },
  { id: 'calc', icon: '🔢', label: 'Calculadora' },
  { id: 'note', icon: '📝', label: 'Notas' },
  { id: 'leaderboard', icon: '🏆', label: 'Ranking' },
];

export default function Desktop() {
  const { state, dispatch } = useGame();

  const openWindow = (id) => {
    dispatch({ type: 'OPEN_WINDOW', id });
  };

  // DEFCON-1 icon only appears when 3+ hacks done
  const showMissile = state.hackCount >= 3;

  return (
    <div className="desktop">
      <div className={`desktop-bg ${state.alertMode ? 'alert-mode' : ''}`} />

      {/* Floating particles */}
      <ParticlesBackground />

      {/* Trace bar at top */}
      <TraceBar />

      {/* HUD */}
      <HUD />

      {/* Desktop Icons */}
      <div className="desktop-icons">
        {DESKTOP_ICONS.map((item) => (
          <div
            key={item.id}
            className="desktop-icon"
            onClick={() => openWindow(item.id)}
          >
            <span className="desktop-icon-emoji">{item.icon}</span>
            <span className="desktop-icon-label">{item.label}</span>
          </div>
        ))}

        {/* DEFCON-1 icon — locked until 3 hacks */}
        <div
          className={`desktop-icon ${!showMissile ? 'locked' : ''}`}
          onClick={() => showMissile && openWindow('missile')}
          title={!showMissile ? 'Desbloqueie hackeando 3+ sistemas' : 'DEFCON-1 — Painel de Mísseis'}
        >
          <span className="desktop-icon-emoji">🚀</span>
          <span className="desktop-icon-label">
            {showMissile ? 'DEFCON-1' : '🔒 DEFCON-1'}
          </span>
        </div>
      </div>

      {/* Windows */}
      <Window id="terminal" title="TERMINAL" icon="💻" width={680} height={400}>
        <Terminal />
      </Window>

      <Window id="hack" title="HACKTOOLS" icon="👾" width={520} height={500}>
        <HackTools />
      </Window>

      <Window id="email" title="EMAIL" icon="📧" width={580} height={420}>
        <Email />
      </Window>

      <Window id="files" title="ARQUIVOS" icon="📁" width={520} height={420}>
        <FileSystem />
      </Window>

      <Window id="db" title="DATABASE" icon="🗄️" width={600} height={450}>
        <Database />
      </Window>

      <Window id="bank" title="BANCO FEDERAL" icon="🏦" width={480} height={420}>
        <Bank />
      </Window>

      <Window id="power" title="POWER GRID" icon="⚡" width={480} height={380}>
        <PowerGrid />
      </Window>

      <Window id="cctv" title="CCTV" icon="📹" width={520} height={380}>
        <CCTV />
      </Window>

      <Window id="sat" title="SATÉLITE" icon="🛰️" width={700} height={450}>
        <Satellite />
      </Window>

      <Window id="missile" title="DEFCON-1" icon="🚀" width={750} height={480}>
        <MissileControl />
      </Window>

      <Window id="calc" title="CALCULADORA" icon="🔢" width={260} height={380}>
        <Calculator />
      </Window>

      <Window id="note" title="NOTAS" icon="📝" width={380} height={320}>
        <Notepad />
      </Window>

      <Window id="leaderboard" title="RANKING" icon="🏆" width={360} height={400}>
        <Leaderboard />
      </Window>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}

// ── Particles Background ──
function ParticlesBackground() {
  return (
    <svg className="particles-canvas" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      {[...Array(30)].map((_, i) => {
        const x = Math.random() * 1920;
        const y = Math.random() * 1080;
        const size = 1 + Math.random() * 2;
        const dur = 3 + Math.random() * 5;
        const delay = Math.random() * 5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={size}
            fill="rgba(0, 212, 255, 0.15)"
          >
            <animate
              attributeName="opacity"
              values="0;0.4;0"
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${y};${y - 80};${y}`}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </svg>
  );
}
