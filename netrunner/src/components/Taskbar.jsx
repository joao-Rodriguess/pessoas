import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';

export default function Taskbar() {
  const { state, dispatch } = useGame();
  const { user } = useAuth();
  
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [startOpen, setStartOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const startMenuRef = useRef(null);
  const calendarRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Fechar popups ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (startOpen && startMenuRef.current && !startMenuRef.current.contains(e.target)) {
        setStartOpen(false);
      }
      if (calendarOpen && calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
      if (searchFocused && searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startOpen, calendarOpen, searchFocused]);

  const ALL_APPS = [
    { id: 'terminal', icon: '💻', label: 'Terminal', desc: 'Interface de linha de comando' },
    { id: 'hack', icon: '👾', label: 'HackTools', desc: 'Invasão e descriptografia' },
    { id: 'email', icon: '📧', label: 'Email Client', desc: 'Leitor de mensagens confidenciais' },
    { id: 'files', icon: '📁', label: 'NetExplorer', desc: 'Explorador de Arquivos' },
    { id: 'db', icon: '🗄️', label: 'Database', desc: 'Acesso a bancos SQL' },
    { id: 'bank', icon: '🏦', label: 'Federal Bank', desc: 'Transferência de créditos virtuais' },
    { id: 'power', icon: '⚡', label: 'PowerGrid', desc: 'Controle de eletricidade da cidade' },
    { id: 'cctv', icon: '📹', label: 'CCTV Monitor', desc: 'Câmeras de vigilância ao vivo' },
    { id: 'sat', icon: '🛰️', label: 'Satélite', desc: 'Interceptação orbital' },
    { id: 'calc', icon: '🔢', label: 'Calculadora', desc: 'Contas e fórmulas rápidas' },
    { id: 'note', icon: '📝', label: 'CyberNotepad', desc: 'Notas e anotações secretas' },
    { id: 'leaderboard', icon: '🏆', label: 'Ranking Hack', desc: 'Classificação global de pontuação' },
    { id: 'browser', icon: '🌐', label: 'NetChrome', desc: 'Navegador Web & Google Search' },
    { id: 'settings', icon: '⚙️', label: 'Painel de Controle', desc: 'Papéis de parede, temas e música' },
  ];

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
    browser: '🌐 NetChrome',
    settings: '⚙️ Configs',
  };

  const handleAppClick = (id) => {
    const isOpened = state.openWindows.includes(id);
    const isFocused = state.focusedWindow === id;
    const isMinimized = state.minimizedWindows?.includes(id);

    if (!isOpened) {
      dispatch({ type: 'OPEN_WINDOW', id });
    } else if (isMinimized) {
      dispatch({ type: 'RESTORE_WINDOW', id });
    } else if (isFocused) {
      dispatch({ type: 'MINIMIZE_WINDOW', id });
    } else {
      dispatch({ type: 'FOCUS_WINDOW', id });
    }
    setStartOpen(false);
    setSearchFocused(false);
  };

  // Filtrar busca de apps
  const filteredApps = ALL_APPS.filter(app => 
    app.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="taskbar">
        {/* Botão iniciar do Windows */}
        <button 
          className={`taskbar-start ${startOpen ? 'active' : ''}`} 
          onClick={() => { setStartOpen(!startOpen); setCalendarOpen(false); setSearchFocused(false); }}
        >
          ⊞
        </button>

        {/* Barra de busca operacional estilo Windows 10/11 */}
        <div className="taskbar-search-container" ref={searchRef}>
          <div className="taskbar-search-wrapper">
            <span className="search-icon-lens">🔎</span>
            <input 
              type="text" 
              className="taskbar-search-input"
              placeholder="Digite aqui para pesquisar..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
                setStartOpen(false);
                setCalendarOpen(false);
              }}
              onFocus={() => {
                setSearchFocused(true);
                setStartOpen(false);
                setCalendarOpen(false);
              }}
            />
          </div>

          {searchFocused && (
            <div className="search-results-popup">
              <div className="search-results-header">MELHOR CORRESPONDÊNCIA</div>
              <div className="search-results-list">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <div 
                      key={app.id} 
                      className="search-result-item"
                      onClick={() => handleAppClick(app.id)}
                    >
                      <span className="search-result-icon">{app.icon}</span>
                      <div className="search-result-info">
                        <div className="search-result-label">{app.label}</div>
                        <div className="search-result-desc">{app.desc}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">Nenhum aplicativo hacker encontrado</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Aplicativos na barra de tarefas */}
        <div className="taskbar-apps">
          {state.openWindows.map((id) => {
            const isFocused = state.focusedWindow === id;
            const isMinimized = state.minimizedWindows?.includes(id);
            return (
              <div
                key={id}
                className={`taskbar-app ${isFocused ? 'active' : ''} ${isMinimized ? 'minimized' : ''}`}
                onClick={() => handleAppClick(id)}
              >
                {(WINDOW_NAMES[id] || id).substring(0, 16)}
                <span className="app-indicator-bar" />
              </div>
            );
          })}
        </div>

        {/* Área de notificação e Relógio do Windows */}
        <div className="taskbar-tray">
          <span style={{ cursor: 'pointer' }} title="Áudio">🔊</span>
          <span style={{ cursor: 'pointer' }} title="Rede Shadow-Net">📶</span>
          <span 
            style={{
              fontSize: 10,
              color: state.alertMode ? 'var(--red-400)' : 'var(--green-400)',
              cursor: 'pointer'
            }}
            title={state.alertMode ? 'Rastreamento Crítico!' : 'Rastreamento Seguro'}
          >
            {state.alertMode ? '⚠️' : '🛡️'}
          </span>
          <div 
            className="taskbar-clock-double"
            onClick={() => { setCalendarOpen(!calendarOpen); setStartOpen(false); setSearchFocused(false); }}
            title="Clique para ver o calendário e a agenda"
          >
            <div className="clock-time">{timeStr}</div>
            <div className="clock-date">{dateStr}</div>
          </div>
        </div>
      </div>

      {/* Menu Iniciar estilo Windows 11 com Info do Hacker */}
      {startOpen && (
        <div className="start-menu-premium" ref={startMenuRef}>
          <div className="start-menu-header">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Hacker" className="start-avatar" />
            ) : (
              <div className="start-avatar-placeholder">💻</div>
            )}
            <div className="start-user-info">
              <div className="start-username">{user?.displayName || 'GHOST_HACKER'}</div>
              <div className="start-user-status">CONECTADO AO SHADOW-NET</div>
            </div>
          </div>

          <div className="start-menu-grid-title">Aplicativos Recomendados</div>
          <div className="start-menu-grid">
            {ALL_APPS.map((item) => (
              <div
                key={item.id}
                className="start-grid-item"
                onClick={() => handleAppClick(item.id)}
              >
                <span className="start-grid-icon">{item.icon}</span>
                <span className="start-grid-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="start-menu-footer">
            <button className="start-btn-restart" onClick={() => window.location.reload()}>
              ⏻ Reiniciar Netrunner
            </button>
          </div>
        </div>
      )}

      {/* Widget de Calendário do Windows com compromissos de Lore */}
      {calendarOpen && (
        <div className="calendar-widget-popup" ref={calendarRef}>
          <div className="calendar-header-title">Maio 2026</div>
          <div className="calendar-days-grid">
            <div className="day-name">D</div>
            <div className="day-name">S</div>
            <div className="day-name">T</div>
            <div className="day-name">Q</div>
            <div className="day-name">Q</div>
            <div className="day-name">S</div>
            <div className="day-name">S</div>
            
            {/* Primeira semana em branco para Maio (começa numa sexta em 2026) */}
            <div className="calendar-day-empty" />
            <div className="calendar-day-empty" />
            <div className="calendar-day-empty" />
            <div className="calendar-day-empty" />
            <div className="calendar-day-empty" />
            <div className="calendar-day">1</div>
            <div className="calendar-day">2</div>

            <div className="calendar-day">3</div>
            <div className="calendar-day">4</div>
            <div className="calendar-day">5</div>
            <div className="calendar-day">6</div>
            <div className="calendar-day">7</div>
            <div className="calendar-day">8</div>
            <div className="calendar-day">9</div>

            <div className="calendar-day">10</div>
            <div className="calendar-day">11</div>
            <div className="calendar-day">12</div>
            <div className="calendar-day">13</div>
            <div className="calendar-day">14</div>
            <div className="calendar-day">15</div>
            <div className="calendar-day">16</div>

            <div className="calendar-day">17</div>
            <div className="calendar-day">18</div>
            <div className="calendar-day">19</div>
            <div className="calendar-day">20</div>
            <div className="calendar-day active-today" title="Hoje - Você está aqui">21</div>
            <div className="calendar-day active-event" title="Reunião com Aria">22</div>
            <div className="calendar-day">23</div>

            <div className="calendar-day active-event" title="Banco Federal Invasão">24</div>
            <div className="calendar-day">25</div>
            <div className="calendar-day active-event" title="Sincronia Satélite DEFCON-1">26</div>
            <div className="calendar-day">27</div>
            <div className="calendar-day">28</div>
            <div className="calendar-day">29</div>
            <div className="calendar-day">30</div>
            
            <div className="calendar-day">31</div>
          </div>

          <div className="calendar-events-section">
            <div className="events-title">COMPROMISSOS CONFIDENCIAIS</div>
            <div className="events-list">
              <div className="event-item">
                <span className="event-bullet urgent">🔴</span>
                <div className="event-details">
                  <div className="event-time-tag">21/05 - Hoje</div>
                  <div className="event-desc-text">Invasão principal iniciada: descriptografar a rede local.</div>
                </div>
              </div>
              <div className="event-item">
                <span className="event-bullet medium">🟡</span>
                <div className="event-details">
                  <div className="event-time-tag">22/05 - Amanhã</div>
                  <div className="event-desc-text">Extrair chaves Defcon do General Webb. Contato: Aria.</div>
                </div>
              </div>
              <div className="event-item">
                <span className="event-bullet warning">🟠</span>
                <div className="event-details">
                  <div className="event-time-tag">24/05 - Domingo</div>
                  <div className="event-desc-text">Efetuar transferência final de créditos do Banco Federal.</div>
                </div>
              </div>
              <div className="event-item">
                <span className="event-bullet critical">🚨</span>
                <div className="event-details">
                  <div className="event-time-tag">26/05 - Terça</div>
                  <div className="event-desc-text">Bloqueio de satélite. Evitar disparo militar a qualquer custo.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
