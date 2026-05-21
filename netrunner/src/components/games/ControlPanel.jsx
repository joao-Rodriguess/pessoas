import { useState, useEffect, useRef } from 'react';

const WALLPAPERS = [
  { id: 'matrix', name: 'Código Verde Matrix', desc: 'Chuva de códigos digitais caindo na tela' },
  { id: 'cyberpunk', name: 'Grelha de Neon Cyberpunk', desc: 'Grade futurista clássica do Netrunner' },
  { id: 'tokyo', name: 'Beco Escuro Shinjuku', desc: 'Minimalismo escuro com nuances azuis e roxas' },
  { id: 'emergency', name: 'Alerta Vermelho DEFCON', desc: 'Fundo avermelhado pulsante de emergência' },
];

const THEMES = [
  { id: 'cyan', name: 'Azul Neon (Padrão)', color: '#00d4ff' },
  { id: 'matrix', name: 'Verde Matrix', color: '#00ff66' },
  { id: 'amber', name: 'Âmbar Retro', color: '#ffb000' },
  { id: 'red', name: 'Alerta Vermelho', color: '#ff0055' },
];

export default function ControlPanel() {
  const [selectedWallpaper, setSelectedWallpaper] = useState(
    localStorage.getItem('desktop-wallpaper') || 'cyberpunk'
  );
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem('system-theme') || 'cyan'
  );
  
  // Telemetria do Sistema
  const [cpuUsage, setCpuUsage] = useState(42);
  const [ramUsage, setRamUsage] = useState(5.7);
  const [networkSpeed, setNetworkSpeed] = useState(13.37);

  // Player de Música Synthwave
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Protocolo Shadow-Net');
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const analyzerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const synthIntervalRef = useRef(null);

  // Efeito para simular telemetria do sistema
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => {
        const change = (Math.random() - 0.5) * 12;
        return Math.max(15, Math.min(95, Math.round(prev + change)));
      });
      setRamUsage((prev) => {
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(4.2, Math.min(7.9, parseFloat((prev + change).toFixed(2))));
      });
      setNetworkSpeed((prev) => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(1.5, Math.min(50, parseFloat((prev + change).toFixed(2))));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Efeito para gerenciar o wallpaper
  const changeWallpaper = (wallId) => {
    setSelectedWallpaper(wallId);
    localStorage.setItem('desktop-wallpaper', wallId);
    
    // Disparar evento customizado para notificar o Desktop.jsx
    const event = new CustomEvent('wallpaperChanged', { detail: wallId });
    window.dispatchEvent(event);
  };

  // Efeito para alterar o tema de cores global
  const changeTheme = (themeId) => {
    setSelectedTheme(themeId);
    localStorage.setItem('system-theme', themeId);

    const root = document.documentElement;
    if (themeId === 'cyan') {
      root.style.setProperty('--cyan-500', '#00d4ff');
      root.style.setProperty('--cyan-400', '#33ddff');
      root.style.setProperty('--cyan-glow', '0 0 10px rgba(0, 212, 255, 0.5)');
    } else if (themeId === 'matrix') {
      root.style.setProperty('--cyan-500', '#00ff66');
      root.style.setProperty('--cyan-400', '#33ff88');
      root.style.setProperty('--cyan-glow', '0 0 10px rgba(0, 255, 102, 0.5)');
    } else if (themeId === 'amber') {
      root.style.setProperty('--cyan-500', '#ffb000');
      root.style.setProperty('--cyan-400', '#ffc133');
      root.style.setProperty('--cyan-glow', '0 0 10px rgba(255, 176, 0, 0.5)');
    } else if (themeId === 'red') {
      root.style.setProperty('--cyan-500', '#ff0055');
      root.style.setProperty('--cyan-400', '#ff3377');
      root.style.setProperty('--cyan-glow', '0 0 10px rgba(255, 0, 85, 0.5)');
    }

    // Notificar outros componentes se necessário
    const event = new CustomEvent('themeChanged', { detail: themeId });
    window.dispatchEvent(event);
  };

  // Carregar tema salvo ao iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('system-theme');
    if (savedTheme) {
      changeTheme(savedTheme);
    }
  }, []);

  // Lógica do Sintetizador Web Audio API e Canvas Equalizer
  const startSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Analisador para o Canvas
      const analyzer = ctx.createAnalyser();
      analyzer.fftSize = 64;
      analyzerRef.current = analyzer;

      // Ganho (Volume)
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime); // Volume confortável
      gainNodeRef.current = gainNode;

      gainNode.connect(analyzer);
      analyzer.connect(ctx.destination);

      // Sequenciador de notas de Synthwave Cyberpunk (loop de melodia)
      // Escala menor natural: A2, C3, D3, E3, G3, A3
      const melody = [110, 130, 146, 164, 196, 220, 196, 164];
      let step = 0;

      synthIntervalRef.current = setInterval(() => {
        if (!ctx || ctx.state === 'suspended') return;
        
        // Criar oscilador para cada nota da melodia (baixo synth encorpado)
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        // Tipo de onda dente de serra para som sintetizado anos 80
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(melody[step % melody.length], ctx.currentTime);
        
        // Pequena variação para dar sensação harmônica
        if (step % 4 === 0) {
          const highOsc = ctx.createOscillator();
          highOsc.type = 'triangle';
          highOsc.frequency.setValueAtTime(melody[step % melody.length] * 2, ctx.currentTime);
          highOsc.connect(oscGain);
          highOsc.start();
          highOsc.stop(ctx.currentTime + 0.4);
        }

        oscGain.gain.setValueAtTime(0.12, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

        osc.connect(oscGain);
        oscGain.connect(gainNode);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        step++;
      }, 250);

      setIsPlaying(true);
      drawEqualizer();
    } catch (err) {
      console.warn('Erro ao inicializar o sintetizador de áudio:', err);
    }
  };

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    setIsPlaying(false);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopSynth();
    } else {
      startSynth();
    }
  };

  const drawEqualizer = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const bufferLength = analyzerRef.current ? analyzerRef.current.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameId.current = requestAnimationFrame(draw);

      if (analyzerRef.current) {
        analyzerRef.current.getByteFrequencyData(dataArray);
      } else {
        // Simular frequências se o áudio não estiver tocando
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = isPlaying ? Math.random() * 200 : 0;
        }
      }

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 1.6;
      let barHeight;
      let x = 0;

      // Pegar cor do tema ativo para pintar as barras de neon
      const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--cyan-500').trim() || '#00d4ff';

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;

        ctx.fillStyle = activeColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = activeColor;

        // Desenhar a barra com cantos sutilmente arredondados
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    draw();
  };

  // Garante a parada do áudio caso o componente desmonte
  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className="control-panel-container">
      {/* Grade de Configurações */}
      <div className="panel-sections-grid">
        
        {/* Seção 1: Personalização de Tela */}
        <div className="panel-card">
          <div className="card-title">🖥️ PAPEL DE PAREDE DO DESKTOP</div>
          <div className="wallpaper-options">
            {WALLPAPERS.map((wall) => (
              <div 
                key={wall.id}
                className={`wallpaper-option ${selectedWallpaper === wall.id ? 'active' : ''}`}
                onClick={() => changeWallpaper(wall.id)}
              >
                <div className={`wall-thumb-preview ${wall.id}`} />
                <div className="wall-info">
                  <div className="wall-name">{wall.name}</div>
                  <div className="wall-desc">{wall.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção 2: Temas de Cores do SO */}
        <div className="panel-card">
          <div className="card-title">🎨 TEMA DE CORES DE NEON</div>
          <div className="theme-options-grid">
            {THEMES.map((theme) => (
              <div
                key={theme.id}
                className={`theme-option-item ${selectedTheme === theme.id ? 'active' : ''}`}
                onClick={() => changeTheme(theme.id)}
                style={{ '--theme-accent': theme.color }}
              >
                <div className="theme-dot" />
                <div className="theme-label-text">{theme.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção 3: Synthwave Player */}
        <div className="panel-card">
          <div className="card-title">🎵 PLAYER SYNTHWAVE MULTIMÍDIA</div>
          <div className="music-player-panel">
            <div className="player-track-info">
              <span className="disc-spin">💿</span>
              <div className="track-details">
                <span className="track-name">{currentTrack}</span>
                <span className="track-artist">Sintetizador Integrado</span>
              </div>
            </div>

            {/* Equalizador Canvas */}
            <canvas ref={canvasRef} className="equalizer-canvas" width={280} height={60} />

            <div className="player-controls-row">
              <button 
                className={`player-btn-play ${isPlaying ? 'playing' : ''}`} 
                onClick={toggleMusic}
              >
                {isPlaying ? '⏸️ PAUSAR SYNTH' : '▶️ INICIAR SYNTH'}
              </button>
            </div>
            <div className="player-audio-notice">
              Gera áudio analógico e frequências em tempo real via Web Audio API.
            </div>
          </div>
        </div>

        {/* Seção 4: Telemetria e Hardware */}
        <div className="panel-card">
          <div className="card-title">💾 TELEMETRIA DO HARDWARE (CPU/RAM)</div>
          <div className="telemetry-panel">
            <div className="telemetry-bar-item">
              <div className="telemetry-labels">
                <span>Processador (CPU)</span>
                <span>{cpuUsage}%</span>
              </div>
              <div className="bar-bg">
                <div className="bar-fill animate-width" style={{ width: `${cpuUsage}%` }} />
              </div>
            </div>

            <div className="telemetry-bar-item">
              <div className="telemetry-labels">
                <span>Memória Reservada (RAM)</span>
                <span>{ramUsage} GB / 8.0 GB</span>
              </div>
              <div className="bar-bg">
                <div className="bar-fill memory animate-width" style={{ width: `${(ramUsage / 8) * 100}%` }} />
              </div>
            </div>

            <div className="telemetry-row-data">
              <div className="data-box">
                <div className="data-value">{networkSpeed} Mb/s</div>
                <div className="data-label">Taxa Shadow-Net</div>
              </div>
              <div className="data-box">
                <div className="data-value">CONECTADO</div>
                <div className="data-label">Status Gateway</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
