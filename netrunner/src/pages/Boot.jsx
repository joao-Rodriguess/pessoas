import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const BOOT_LINES = [
  { text: '╔══════════════════════════════════════════════╗', cls: 'cyan', delay: 0 },
  { text: '║     NEXUS CORP — CLASSIFIED MAINFRAME        ║', cls: 'header', delay: 100 },
  { text: '╚══════════════════════════════════════════════╝', cls: 'cyan', delay: 200 },
  { text: '', delay: 300 },
  { text: 'BIOS v4.7.2 — NEXUS SYSTEMS INC.', cls: '', delay: 400 },
  { text: 'CPU: Quantum-X 2047 @ 847.3 THz ............ OK', cls: 'success', delay: 600 },
  { text: 'RAM: 2.048 PB DDR9 ECC ..................... OK', cls: 'success', delay: 800 },
  { text: 'GPU: NeuralCore RTX-Z ...................... OK', cls: 'success', delay: 1000 },
  { text: 'NET: Quantum-Encrypted Link ................ OK', cls: 'success', delay: 1200 },
  { text: 'STORAGE: 500 EB NVMe Array ................. OK', cls: 'success', delay: 1400 },
  { text: '', delay: 1500 },
  { text: '[ SECURITY ] Firewall Level 7 .............. ACTIVE', cls: 'warn', delay: 1700 },
  { text: '[ SECURITY ] Intrusion Detection ........... ACTIVE', cls: 'warn', delay: 1900 },
  { text: '[ SECURITY ] Trace Protocol v9.1 ........... ARMED', cls: 'error', delay: 2100 },
  { text: '', delay: 2200 },
  { text: '> Establishing backdoor connection...', cls: 'cyan', delay: 2400 },
  { text: '> Injecting GHOST protocol...', cls: 'cyan', delay: 2800 },
  { text: '> Bypassing perimeter defenses...', cls: 'cyan', delay: 3200 },
  { text: '', delay: 3400 },
  { text: '████████████████████████████████ 100%', cls: 'success', delay: 3600 },
  { text: '', delay: 3700 },
  { text: '> ACCESS GRANTED — WELCOME, GHOST', cls: 'success', delay: 3900 },
  { text: '', delay: 4000 },
  { text: '[ SHADOW PROTOCOL INITIALIZED ]', cls: 'header', delay: 4200 },
];

export default function Boot() {
  const { dispatch } = useGame();
  const [visibleLines, setVisibleLines] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        setProgress(((i + 1) / BOOT_LINES.length) * 100);
      }, line.delay)
    );

    const endTimer = setTimeout(() => {
      dispatch({ type: 'SET_PHASE', phase: 'login' });
    }, 5200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(endTimer);
    };
  }, [dispatch]);

  return (
    <div className="boot-screen">
      <div className="boot-terminal">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className={`boot-line ${line.cls || ''}`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {line.text}
          </div>
        ))}
      </div>
      <div className="boot-progress">
        <div className="boot-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
