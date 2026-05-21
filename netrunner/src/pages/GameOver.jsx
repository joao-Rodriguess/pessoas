import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

export default function GameOver() {
  const { state, submitScore } = useGame();
  const { user } = useAuth();
  const [logStep, setLogStep] = useState(0);

  useEffect(() => {
    if (state.score > 0) submitScore(user);
  }, [submitScore, user, state.score]);

  const isTraceFailure = state.trace >= 100;
  const isCountdownFailure = state.countdown !== null && state.countdown <= 0;

  // Temporizador para revelação dos logs da invasão
  useEffect(() => {
    const maxSteps = isTraceFailure ? 5 : isCountdownFailure ? 5 : 2;
    const interval = setInterval(() => {
      setLogStep((prev) => {
        if (prev < maxSteps) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isTraceFailure, isCountdownFailure]);

  // Web Audio API para tocar Sirene Policial ou Alarme Nuclear de Mísseis
  useEffect(() => {
    let audioCtx;
    let osc1, osc2;
    let modNode;
    let gainNode;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      if (isTraceFailure) {
        // --- SIRENE DE POLÍCIA ---
        osc1 = audioCtx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(550, audioCtx.currentTime);

        osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2.2, audioCtx.currentTime); // 2.2 Hz de modulação

        modNode = audioCtx.createGain();
        modNode.gain.setValueAtTime(150, audioCtx.currentTime); // Varie a freq em +/- 150Hz

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // Volume confortável

        osc2.connect(modNode);
        modNode.connect(osc1.frequency);
        osc1.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
      } else if (isCountdownFailure) {
        // --- ALARME NUCLEAR MILITAR (Som pulsante grave) ---
        osc1 = audioCtx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(110, audioCtx.currentTime); // Freq base grave

        // LFO para pulsar o volume
        osc2 = audioCtx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1.0, audioCtx.currentTime); // 1Hz

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);

        // Fazer modulação do ganho pelo LFO
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        osc2.connect(lfoGain);
        lfoGain.connect(gainNode.gain);

        osc1.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc1.start();
        osc2.start();
      }
    } catch (err) {
      console.warn('Web Audio API não pôde ser iniciada.', err);
    }

    return () => {
      try {
        if (osc1) osc1.stop();
        if (osc2) osc2.stop();
        if (audioCtx) audioCtx.close();
      } catch (e) {}
    };
  }, [isTraceFailure, isCountdownFailure]);

  // Logs para renderizar baseado no step
  const getTraceLogs = () => [
    { text: '🚨 [ALERTA DE SEGURANÇA] SINAL RASTREADO EM 100%', type: 'danger' },
    { text: '⚠️ [FIREWALL] Conexão proxy/VPN rompida. Endereço físico decodificado.', type: 'warning' },
    { text: '🔊 [FÍSICO] PORTA DA FRENTE ARROMBADA — BAM! BAM! BAM!', type: 'danger' },
    { text: '👮 [TÁTICO] EQUIPE DE ASSALTO DA NEXUS DETECTADA NO PERÍMETRO', type: 'danger' },
    { text: '❌ [SISTEMA] MÃOS NA CABEÇA! NÃO SE MOVA! CONEXÃO TERMINADA À FORÇA.', type: 'danger' },
    { text: '💀 FIM DE LINHA, GHOST. Você foi arrastado para as salas de contenção quântica da NEXUS.', type: 'normal' }
  ];

  const getCountdownLogs = () => [
    { text: '🚀 [DEFCON-1] ALERTA CRÍTICO: TEMPO DE ABORTO ESGOTADO', type: 'danger' },
    { text: '💥 [ALERTA] Protocolo de IA Quântica ativado. Mísseis nucleares autônomos lançados.', type: 'danger' },
    { text: '🏙️ Neo-Tóquio: Impacto balístico confirmado. Conexão local perdida.', type: 'warning' },
    { text: '🏙️ Nova Berlim: Impacto balístico confirmado. Conexão local perdida.', type: 'warning' },
    { text: '🏙️ Nova York: Impacto balístico confirmado. Conexão global extinta.', type: 'warning' },
    { text: '💀 Apocalipse digital completo. A rede quântica da NEXUS agora controla a cinza das megacidades.', type: 'normal' }
  ];

  const getGenericLogs = () => [
    { text: '❌ [ERRO] Conexão com o nó central falhou.', type: 'danger' },
    { text: '⚠️ Acesso ao DEFCON-1 foi negado e a sessão hacker foi purgada.', type: 'warning' },
    { text: '💀 A missão falhou catastroficamente. Limpe seus rastros se puder.', type: 'normal' }
  ];

  const activeLogs = isTraceFailure
    ? getTraceLogs()
    : isCountdownFailure
    ? getCountdownLogs()
    : getGenericLogs();

  return (
    <div className={`endscreen gameover ${isTraceFailure ? 'siren-active' : ''}`}>
      <div className="endscreen-icon">{isTraceFailure ? '🚨' : isCountdownFailure ? '💥' : '☠️'}</div>
      
      <h1 className="endscreen-title" style={{ animation: 'blink 0.8s step-end infinite' }}>
        {isTraceFailure ? '⚠️ CONEXÃO INTERCEPTADA ⚠️' : isCountdownFailure ? '☢️ MÍSSEIS LANÇADOS ☢️' : '⚠️ FALHA CRÍTICA ⚠️'}
      </h1>
      
      {/* Box de logs cinemáticos */}
      <div className="siren-log-box">
        {activeLogs.slice(0, logStep + 1).map((log, index) => (
          <div 
            key={index} 
            className={`siren-log-line ${log.type}`}
            style={{ 
              animation: index === logStep ? 'fadeIn 0.3s ease-out' : 'none' 
            }}
          >
            {log.text}
          </div>
        ))}
      </div>

      <div className="endscreen-score" style={{ fontSize: 20, marginBottom: 12 }}>
        PONTUAÇÃO OBTIDA: {state.score.toLocaleString()}
      </div>

      <div style={{ marginBottom: 24, color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'monospace' }}>
        🏆 Conquistas: {state.achievements.length} | 🎯 Hacks: {state.hackCount}/5 | ⏱️ Trace Final: {Math.round(state.trace)}%
      </div>

      <button
        className="endscreen-btn"
        onClick={() => window.location.reload()}
        style={{ 
          background: 'linear-gradient(135deg, #ff1744, #b71c1c)', 
          boxShadow: '0 0 15px rgba(255, 23, 68, 0.4)',
          textShadow: '0 0 4px rgba(0,0,0,0.5)'
        }}
      >
        🔄 TENTAR NOVAMENTE
      </button>
    </div>
  );
}
