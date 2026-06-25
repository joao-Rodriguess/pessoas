import { useGame } from '../context/GameContext';

export default function MobileAppContainer({ appId, title, onClose, children }) {
  const { state, dispatch } = useGame();

  // Comandos de atalho para o terminal (Termux)
  const QUICK_COMMANDS = [
    { label: '📡 SCAN', cmd: 'scan' },
    { label: '📊 STATUS', cmd: 'status' },
    { label: '🗺️ NETMAP', cmd: 'nmap' },
    { label: '📁 FILES', cmd: 'cat readme.txt' },
    { label: '🔒 SECRETS', cmd: 'cat secrets.txt' },
    { label: '🛡️ VPN', cmd: 'activate vpn' },
    { label: '🔄 PROXY', cmd: 'activate proxy' },
    { label: '🧹 CLEAR', cmd: 'clear' },
  ];

  const handleQuickCommand = (cmd) => {
    window.dispatchEvent(new CustomEvent('terminalQuickCommand', { detail: cmd }));
  };

  return (
    <div className="mobile-app-container">
      {/* Cabeçalho do App de estilo Mobile */}
      <div className="mobile-app-header">
        <button className="mobile-app-close-btn" onClick={onClose} title="Fechar App">
          🏠
        </button>
        <span className="mobile-app-title">{title?.toUpperCase()}</span>
        <div style={{ width: 32 }} /> {/* Espaçador para balanceamento do flexbox */}
      </div>

      {/* Conteúdo do App */}
      <div className={`mobile-app-body-content app-${appId}`}>
        {children}
      </div>

      {/* Área de atalhos rápidos (renderizada somente no Termux) */}
      {appId === 'termux' && (
        <div className="mobile-terminal-shortcuts">
          <div className="shortcuts-title">⚙️ COMANDOS RÁPIDOS (TOQUE PARA EXECUTAR)</div>
          <div className="shortcuts-grid">
            {QUICK_COMMANDS.map((q, idx) => {
              // Desabilitar botão de VPN ou Proxy se já foram consumidos (opcional, mas apenas rodar o comando já gera resposta na tela)
              return (
                <button
                  key={idx}
                  className="shortcut-btn"
                  onClick={() => handleQuickCommand(q.cmd)}
                >
                  {q.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
