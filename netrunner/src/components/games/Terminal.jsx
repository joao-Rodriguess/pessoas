import { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

export default function Terminal() {
  const { state, dispatch } = useGame();
  const [lines, setLines] = useState([
    { text: '╔═══════════ NEXUS SECURE SHELL ═══════════╗', cls: 'cyan' },
    { text: '║  Acesso remoto via GHOST Protocol v2.1   ║', cls: 'cyan' },
    { text: '╚══════════════════════════════════════════╝', cls: 'cyan' },
    { text: '', cls: '' },
    { text: "Digite 'help' para ver comandos disponíveis", cls: 'info' },
  ]);
  const [input, setInput] = useState('');
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleQuickCommand = (e) => {
      const cmd = e.detail;
      handleCommand(cmd);
    };
    window.addEventListener('terminalQuickCommand', handleQuickCommand);
    return () => window.removeEventListener('terminalQuickCommand', handleQuickCommand);
  }, [state, lines]);

  const addLine = (text, cls = '') => {
    setLines((prev) => [...prev, { text, cls }]);
  };

  const handleCommand = (cmd) => {
    const c = cmd.trim().toLowerCase();
    addLine(`${state.isAdmin ? 'root#' : 'guest$'} ${cmd}`, 'cyan');

    if (c === 'help') {
      addLine('╔═══ COMANDOS DISPONÍVEIS ═══╗', 'cyan');
      addLine('  help      — mostra esta ajuda', 'info');
      addLine('  scan      — escanear alvos', 'info');
      addLine('  status    — status dos hacks', 'info');
      addLine('  whoami    — identidade atual', 'info');
      addLine('  ifconfig  — configuração de rede', 'info');
      addLine('  ps        — processos ativos', 'info');
      addLine('  cat       — ler arquivo', 'info');
      addLine('  nmap      — mapa de rede', 'info');
      addLine('  history   — histórico de comandos', 'info');
      addLine('  clear     — limpar terminal', 'info');
      addLine('  score     — pontuação atual', 'info');
      addLine('  powerups  — itens especiais', 'info');
      addLine('╚════════════════════════════╝', 'cyan');
    } else if (c === 'scan') {
      addLine('Iniciando scan de vulnerabilidades...', 'warn');
      dispatch({ type: 'START_TRACING' });
      dispatch({ type: 'ADD_SCORE', points: 25 });
      setTimeout(() => {
        addLine('', '');
        addLine('══════ ALVOS DETECTADOS ══════', 'warn');
        addLine('  🛡️  Firewall     — Porta 443', 'info');
        addLine('  🔐  Criptografia — AES-256', 'info');
        addLine('  🔑  Auth 2FA     — TOTP', 'info');
        addLine('  🗄️  Database     — PostgreSQL', 'info');
        addLine('  📡  Rede         — VLAN-7', 'info');
        addLine('', '');
        addLine('⚠️  AVISO: Trace protocol ativado!', 'error');
        addLine('Use HackTools para explorar os alvos.', 'system');
        dispatch({ type: 'ADD_ACHIEVEMENT', id: 'first_scan' });
      }, 1500);
    } else if (c === 'status') {
      addLine('═══ STATUS DOS HACKS ═══', 'warn');
      addLine(`  Firewall:     ${state.firewall ? '✅ HACKEADO' : '❌ BLOQUEADO'}`, state.firewall ? 'info' : 'error');
      addLine(`  Criptografia: ${state.encryption ? '✅ HACKEADO' : '❌ BLOQUEADO'}`, state.encryption ? 'info' : 'error');
      addLine(`  Auth 2FA:     ${state.auth ? '✅ HACKEADO' : '❌ BLOQUEADO'}`, state.auth ? 'info' : 'error');
      addLine(`  Database:     ${state.database ? '✅ HACKEADO' : '❌ BLOQUEADO'}`, state.database ? 'info' : 'error');
      addLine(`  Rede:         ${state.network ? '✅ HACKEADO' : '❌ BLOQUEADO'}`, state.network ? 'info' : 'error');
      addLine(`  Progresso:    ${state.hackCount}/5 (${state.hackCount * 20}%)`, 'cyan');
    } else if (c === 'whoami') {
      addLine(state.isAdmin ? 'root (Administrador NEXUS)' : 'guest (Acesso limitado)', state.isAdmin ? 'info' : 'warn');
    } else if (c === 'ifconfig') {
      addLine('eth0: 10.0.13.37/24  UP  RUNNING', 'info');
      addLine('  inet 10.0.13.37  netmask 255.255.255.0', 'info');
      addLine('  HWaddr 00:DE:AD:BE:EF:42', 'info');
      addLine('tun0: 192.168.1.1/24  UP  ENCRYPTED', 'info');
      addLine('  tunnel: GHOST Protocol v2.1', 'system');
    } else if (c === 'ps') {
      addLine('PID    NAME                  CPU   MEM', 'warn');
      addLine('001    systemd               0.1%  2MB', 'info');
      addLine('042    ghost_protocol        15.3% 128MB', 'info');
      addLine('077    trace_detector        8.7%  64MB', 'error');
      addLine('099    firewall_daemon       22.1% 256MB', 'warn');
      addLine('133    nexus_ai_watchdog     12.4% 512MB', 'error');
    } else if (c === 'nmap') {
      addLine('Scanning NEXUS network 10.0.0.0/16...', 'warn');
      setTimeout(() => {
        addLine('10.0.0.1   — Gateway (FIREWALLED)', 'error');
        addLine('10.0.1.10  — Database Server', 'info');
        addLine('10.0.2.50  — Email Server', 'info');
        addLine('10.0.3.1   — DEFCON Control (LOCKED)', 'error');
        addLine('10.0.4.100 — Bank Systems', 'warn');
        addLine('10.0.5.25  — Power Grid Control', 'warn');
        addLine('10.0.6.1   — Satellite Uplink', 'info');
        addLine(`${8} hosts discovered`, 'info');
      }, 1000);
      dispatch({ type: 'ADD_SCORE', points: 15 });
    } else if (c.startsWith('cat ')) {
      const file = c.replace('cat ', '').trim();
      const files = {
        '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000:NEXUS Admin:/home/admin',
        '/var/log/auth.log': 'FAILED login from 10.0.13.37 — 3 attempts\nWARNING: Brute force detected',
        'readme.txt': 'ZERO-DAY MEMO: Alpha=742839, Beta está nos emails do Dr. Chen',
        'secrets.txt': state.isAdmin ? 'COFRE: Sequência n(n+1): 2,6,12,20,30,42' : 'ACESSO NEGADO — precisa de root',
      };
      if (files[file]) {
        files[file].split('\n').forEach((l) => addLine(l, 'info'));
        dispatch({ type: 'ADD_SCORE', points: 20 });
      } else {
        addLine(`cat: ${file}: Arquivo não encontrado`, 'error');
        addLine('Arquivos disponíveis: /etc/passwd, /var/log/auth.log, readme.txt, secrets.txt', 'system');
      }
    } else if (c === 'history') {
      addLine('1  scan', 'info');
      addLine('2  nmap', 'info');
      addLine('3  status', 'info');
      addLine('... histórico truncado por segurança', 'warn');
    } else if (c === 'clear') {
      setLines([]);
    } else if (c === 'score') {
      addLine(`Pontuação: ${state.score}`, 'info');
      addLine(`Conquistas: ${state.achievements.length}`, 'info');
    } else if (c === 'powerups') {
      addLine('═══ POWER-UPS ═══', 'warn');
      addLine(`  🛡️ VPN     — ${state.powerups.vpn ? 'USADO' : 'Reduz trace 50%  (use: activate vpn)'}`, state.powerups.vpn ? 'error' : 'info');
      addLine(`  🔄 Proxy   — ${state.powerups.proxy ? 'USADO' : 'Pausa trace 30s  (use: activate proxy)'}`, state.powerups.proxy ? 'error' : 'info');
      addLine(`  💉 Exploit — ${state.powerups.exploit ? 'USADO' : 'Pula 1 puzzle    (use: activate exploit)'}`, state.powerups.exploit ? 'error' : 'info');
    } else if (c === 'activate vpn' && !state.powerups.vpn) {
      dispatch({ type: 'USE_POWERUP', id: 'vpn' });
      addLine('🛡️ VPN ativada! Trace reduzido em 50%.', 'info');
      dispatch({ type: 'ADD_SCORE', points: 50 });
    } else if (c === 'activate proxy' && !state.powerups.proxy) {
      dispatch({ type: 'USE_POWERUP', id: 'proxy' });
      addLine('🔄 Proxy ativado! Trace pausado por 30 segundos.', 'info');
      dispatch({ type: 'ADD_SCORE', points: 50 });
      setTimeout(() => {
        dispatch({ type: 'DEACTIVATE_PROXY' });
      }, 30000);
    } else if (c === 'activate exploit' && !state.powerups.exploit) {
      dispatch({ type: 'USE_POWERUP', id: 'exploit' });
      addLine('💉 Exploit Kit carregado! Próximo puzzle será pulado automaticamente.', 'info');
    } else if (c === '') {
      // empty
    } else {
      addLine(`bash: ${c}: comando não encontrado`, 'error');
      addLine("Use 'help' para ver comandos disponíveis", 'system');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-output" ref={outputRef}>
        {lines.map((line, i) => (
          <div key={i} className={`terminal-line ${line.cls}`}>
            {line.text}
          </div>
        ))}
      </div>
      <div className="terminal-input-area">
        <span className="terminal-prompt">
          {state.isAdmin ? 'root#' : 'guest$'}
        </span>
        <input
          ref={inputRef}
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
        />
      </div>
    </div>
  );
}
