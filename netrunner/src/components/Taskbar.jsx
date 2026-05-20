import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

export default function Taskbar() {
  const { state, dispatch } = useGame();
  const [clock, setClock] = useState('');
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const WINDOW_NAMES = {
    terminal: '💻 Terminal',
    hack: '👾 HackTools',
    email: '📧 Email',
    files: '📁 Arquivos',
    db: '🗄️ Database',
    missile: '🚀 DEFCON-1',
    bank: '🏦 Banco',
    power: '⚡ PowerGrid',
    sat: '🛰️ Satélite',
    cctv: '📹 CCTV',
    calc: '🔢 Calc',
    note: '📝 Notas',
    leaderboard: '🏆 Ranking',
  };

  const START_ITEMS = [
    { id: 'terminal', icon: '💻', label: 'Terminal' },
    { id: 'hack', icon: '👾', label: 'HackTools' },
    { id: 'email', icon: '📧', label: 'Email' },
    { id: 'files', icon: '📁', label: 'Arquivos' },
    { id: 'db', icon: '🗄️', label: 'Database' },
    { id: 'calc', icon: '🔢', label: 'Calculadora' },
    { id: 'note', icon: '📝', label: 'Notas' },
    { id: 'leaderboard', icon: '🏆', label: 'Ranking' },
  ];

  const openWindow = (id) => {
    dispatch({ type: 'OPEN_WINDOW', id });
    setStartOpen(false);
  };

  return (
    <>
      <div className="taskbar">
        <button className="taskbar-start" onClick={() => setStartOpen(!startOpen)}>
          ⊞
        </button>

        <div className="taskbar-apps">
          {state.openWindows.map((id) => (
            <div
              key={id}
              className={`taskbar-app ${state.focusedWindow === id ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'FOCUS_WINDOW', id })}
            >
              {(WINDOW_NAMES[id] || id).substring(0, 16)}
            </div>
          ))}
        </div>

        <div className="taskbar-tray">
          <span style={{ cursor: 'pointer' }}>🔊</span>
          <span style={{ cursor: 'pointer' }}>📶</span>
          <span style={{
            fontSize: 10,
            color: state.alertMode ? 'var(--red-400)' : 'var(--green-400)',
          }}>
            {state.alertMode ? '⚠️' : '🛡️'}
          </span>
          <div className="taskbar-clock">{clock}</div>
        </div>
      </div>

      {startOpen && (
        <div className="start-menu">
          {START_ITEMS.map((item) => (
            <div
              key={item.id}
              className="start-menu-item"
              onClick={() => openWindow(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
          <div className="start-menu-divider" />
          <div
            className="start-menu-item danger"
            onClick={() => window.location.reload()}
          >
            ⏻ Reiniciar Sistema
          </div>
        </div>
      )}
    </>
  );
}
