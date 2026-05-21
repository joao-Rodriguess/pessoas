import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import MobileAppContainer from '../components/MobileAppContainer';

// Import dos minijogos originais
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
import ControlPanel from '../components/games/ControlPanel';
import Leaderboard from '../components/Leaderboard';
import AriaSystem from '../components/games/AriaSystem';

export default function MobilePhone() {
  const { state, dispatch } = useGame();
  const [locked, setLocked] = useState(true);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [activeApp, setActiveApp] = useState(null); // null = Home Screen

  // Efeito de biometria simulada
  const handleBiometrics = () => {
    if (biometricScanning || biometricSuccess) return;
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      setTimeout(() => {
        setLocked(false);
      }, 400);
    }, 1200);
  };

  // Se o trace chegar a 100%, o jogo é gameover. Mas se estivermos jogando, o celular pode tremer!
  const isHighTrace = state.trace >= 70;

  const APPS = [
    { id: 'termux', name: 'Termux', icon: '💻', color: '#00ff66', component: <Terminal /> },
    { id: 'breaker', name: 'NetBreaker', icon: '👾', color: '#ff0055', component: <HackTools /> },
    { id: 'mail', name: 'GhostMail', icon: '📧', color: '#0099ff', component: <Email /> },
    { id: 'nexusdb', name: 'NexusDB', icon: '🗄️', color: '#ffaa00', component: <Database /> },
    { id: 'bank', name: 'BacenHack', icon: '🏦', color: '#00ffd5', component: <Bank /> },
    { id: 'grid', name: 'Grid Hack', icon: '⚡', color: '#d500f9', component: <PowerGrid /> },
    { id: 'spycam', name: 'SpyCCTV', icon: '📹', color: '#ff3d00', component: <CCTV /> },
    { id: 'sat', name: 'NexusSat', icon: '🛰️', color: '#00e5ff', component: <Satellite /> },
    { id: 'explorer', name: 'Explorer', icon: '📁', color: '#eceff1', component: <FileSystem /> },
    { id: 'aria', name: 'ARIA Core', icon: '🧠', color: '#ff8a80', component: <AriaSystem /> },
    { id: 'ranks', name: 'Ranks', icon: '🏆', color: '#ffd700', component: <Leaderboard /> },
    { id: 'settings', name: 'Ajustes', icon: '⚙️', color: '#90a4ae', component: <ControlPanel /> },
  ];

  // O app Detonator (Controle de Mísseis original) só libera após 3 hacks completos
  const showDetonator = state.hackCount >= 3;

  return (
    <div className={`mobile-phone-page ${state.ariaGlitchActive ? 'aria-glitch-active' : ''} ${isHighTrace ? 'phone-alert-mode' : ''}`}>
      {/* Moldura física do smartphone (apenas visível em telas desktop) */}
      <div className="phone-frame-wrapper">
        <div className="phone-hardware-bezel">
          <div className="phone-earpiece" />
          <div className="phone-camera-lens" />
          
          {/* Tela do Smartphone */}
          <div className="phone-screen-content">
            <div className="scanlines-overlay" />
            
            {locked ? (
              /* TELA DE BLOQUEIO (LOCK SCREEN) */
              <div className="phone-lock-screen">
                <div className="lock-top-info">
                  <div className="lock-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="lock-date">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()}
                  </div>
                </div>

                <div className="lock-notifications">
                  <div className="lock-notification">
                    <span className="notif-icon">💀</span>
                    <div className="notif-content">
                      <div className="notif-title">ZERO-DAY — URGENTE</div>
                      <div className="notif-body">Infiltração iniciada. Detonador C4 no local pronto.</div>
                    </div>
                  </div>
                  <div className="lock-notification">
                    <span className="notif-icon">🧠</span>
                    <div className="notif-content">
                      <div className="notif-title">ARIA SYSTEM</div>
                      <div className="notif-body">Sinal de satélite estável. Aguardando comandos, Ghost.</div>
                    </div>
                  </div>
                </div>

                <div className="lock-biometric-area" onClick={handleBiometrics}>
                  <div className={`biometric-fingerprint ${biometricScanning ? 'scanning' : ''} ${biometricSuccess ? 'success' : ''}`}>
                    🧬
                  </div>
                  <div className="biometric-label">
                    {biometricScanning ? 'ESCANEANDO IDENTIDADE...' : biometricSuccess ? 'ACESSO CONCEDIDO' : 'TOQUE PARA ACESSO BIOMÉTRICO'}
                  </div>
                </div>
              </div>
            ) : (
              /* SISTEMA OPERACIONAL HACKER PHONE */
              <div className="phone-os-interface">
                {/* Status Bar */}
                <div className="phone-status-bar">
                  <div className="status-left">
                    <span className="status-signal">📡 SYSNET 5G</span>
                    <span className="status-vpn">🔒 SECURE VPN</span>
                  </div>
                  <div className="status-right">
                    <span className="status-battery">♾️% 🔋</span>
                    <span className="status-clock">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Medidor FBI TRACING super destacado de alta tecnologia */}
                  <div className={`status-fbi-tracker ${isHighTrace ? 'alert' : ''}`}>
                    <div className="fbi-tracker-header">
                      <span className="fbi-tracker-title">⚠️ RASTREAMENTO DO FBI</span>
                      <span className="fbi-tracker-pct">{Math.round(state.trace)}%</span>
                    </div>
                    <div className="fbi-tracker-bar-bg">
                      <div 
                        className="fbi-tracker-fill" 
                        style={{ 
                          width: `${state.trace}%`,
                          background: isHighTrace 
                            ? 'linear-gradient(90deg, #ff9900, #ff0055)' 
                            : 'linear-gradient(90deg, #00d4ff, #00ff66)' 
                        }} 
                      />
                    </div>
                  </div>
                </div>

                {activeApp === null ? (
                  /* TELA INICIAL (HOME LAUNCHER) */
                  <div className="phone-home-screen">
                    <div className="app-grid-container">
                      <div className="mobile-apps-grid">
                        {APPS.map((app) => (
                          <div 
                            key={app.id} 
                            className="mobile-app-icon-wrapper"
                            onClick={() => setActiveApp(app.id)}
                          >
                            <div 
                              className="mobile-app-icon" 
                              style={{ 
                                borderColor: app.color,
                                boxShadow: `0 0 10px ${app.color}33`,
                                textShadow: `0 0 5px ${app.color}`
                              }}
                            >
                              <span className="app-emoji">{app.icon}</span>
                            </div>
                            <span className="mobile-app-name">{app.name}</span>
                          </div>
                        ))}

                        {/* App DETONATOR Especial (Controle de Mísseis) */}
                        <div 
                          className={`mobile-app-icon-wrapper detonator-app ${!showDetonator ? 'locked' : 'unlocked'}`}
                          onClick={() => showDetonator && setActiveApp('detonator')}
                        >
                          <div 
                            className="mobile-app-icon"
                            style={{
                              borderColor: showDetonator ? '#ff003c' : 'rgba(255, 255, 255, 0.1)',
                              boxShadow: showDetonator ? '0 0 15px rgba(255, 0, 60, 0.6)' : 'none',
                              background: showDetonator ? 'rgba(255, 0, 60, 0.1)' : 'rgba(0, 0, 0, 0.4)'
                            }}
                          >
                            <span className="app-emoji">{showDetonator ? '🚨' : '🔒'}</span>
                          </div>
                          <span className="mobile-app-name" style={{ color: showDetonator ? '#ff3366' : 'var(--text-muted)' }}>
                            {showDetonator ? 'DETONADOR' : 'BLOQUEADO'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* HUD rápido no rodapé da Home */}
                    <div className="phone-hud-footer">
                      <div className="hud-metric">
                        <span className="hud-metric-label">HACKS</span>
                        <span className="hud-metric-value">{state.hackCount}/5</span>
                      </div>
                      <div className="hud-metric">
                        <span className="hud-metric-label">SCORE</span>
                        <span className="hud-metric-value" style={{ color: 'var(--green-400)' }}>
                          {state.score.toLocaleString()}
                        </span>
                      </div>
                      <div className="hud-metric">
                        <span className="hud-metric-label">IA ARIA</span>
                        <span className="hud-metric-value" style={{ color: state.ariaHealth > 50 ? 'var(--cyan-400)' : 'var(--red-400)' }}>
                          {state.ariaHealth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* APLICATIVO EM EXECUÇÃO (TELA CHEIA) */
                  <div className="phone-active-app-container">
                    <MobileAppContainer 
                      appId={activeApp} 
                      onClose={() => setActiveApp(null)}
                      title={activeApp === 'detonator' ? '🚨 DETONADOR REMOTO' : APPS.find(a => a.id === activeApp)?.name}
                    >
                      {activeApp === 'detonator' ? <MissileControl /> : APPS.find(a => a.id === activeApp)?.component}
                    </MobileAppContainer>
                  </div>
                )}

                {/* Home Indicator - Barra de gesto inferior (iOS/Android Style) para voltar à Home */}
                <div 
                  className="phone-home-indicator" 
                  onClick={() => setActiveApp(null)}
                  title="Voltar para a tela inicial"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão de bloqueio de hardware lateral virtual (para desligar/bloquear o celular) */}
      <button 
        className="phone-hardware-power-btn" 
        onClick={() => {
          setLocked(true);
          setBiometricSuccess(false);
          setActiveApp(null);
        }}
        title="Bloquear Aparelho"
      />
    </div>
  );
}
