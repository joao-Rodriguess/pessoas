import { useState } from 'react';
import { useGame } from '../../context/GameContext';

const DIRECTORY_TREE = {
  root: {
    id: 'root',
    name: 'Este Computador',
    path: 'Este Computador',
    type: 'dir',
    children: ['c_drive', 'network']
  },
  c_drive: {
    id: 'c_drive',
    name: 'Disco Local (C:)',
    path: 'Este Computador > Disco Local (C:)',
    type: 'dir',
    children: ['documentos', 'segredos', 'financeiro', 'manuais']
  },
  documentos: {
    id: 'documentos',
    name: 'Documentos',
    path: 'Este Computador > Disco Local (C:) > Documentos',
    type: 'dir',
    children: ['logs', 'power']
  },
  segredos: {
    id: 'segredos',
    name: 'Segredos',
    path: 'Este Computador > Disco Local (C:) > Segredos',
    type: 'dir',
    children: ['zeus', 'codes']
  },
  financeiro: {
    id: 'financeiro',
    name: 'Financeiro',
    path: 'Este Computador > Disco Local (C:) > Financeiro',
    type: 'dir',
    children: ['bank']
  },
  manuais: {
    id: 'manuais',
    name: 'Manuais',
    path: 'Este Computador > Disco Local (C:) > Manuais',
    type: 'dir',
    children: ['cctv']
  },
  network: {
    id: 'network',
    name: 'Locais de Rede',
    path: 'Este Computador > Locais de Rede',
    type: 'dir',
    children: ['silo_net', 'server_net']
  },
  silo_net: {
    id: 'silo_net',
    name: 'silo-01-montana.local',
    path: 'Este Computador > Locais de Rede > silo-01-montana',
    type: 'file',
    icon: '🛰️',
    content: 'CONEXÃO ESTABELECIDA — SILO DE MÍSSEIS\n\nIP Orbital: 10.15.22.41\nStatus: Pronto para controle manual\n\nAviso: Requer duas chaves de autenticação de oficiais independentes (Código Alpha e Código Beta).'
  },
  server_net: {
    id: 'server_net',
    name: 'nexus-auth-server.net',
    path: 'Este Computador > Locais de Rede > nexus-auth-server',
    type: 'file',
    icon: '🖥️',
    content: 'CONEXÃO NEGADA\n\nStatus: Criptografia ativa.\n\nPista da Inteligência Artificial ARIA:\n"Para quebrar essa defesa, use a ferramenta Database para injetar comandos SQL como OR 1=1!"'
  },
  zeus: {
    id: 'zeus',
    name: 'projeto_zeus.txt',
    path: 'Este Computador > Disco Local (C:) > Segredos > projeto_zeus.txt',
    type: 'file',
    icon: '📄',
    content: 'PROJETO ZEUS — CLASSIFICADO\n\nO Projeto DEFCON-1 utiliza 3 silos:\n- SILO-01: Montana\n- SILO-02: Wyoming  \n- SILO-03: Colorado\n\nCódigo Beta de lançamento: 470511\n\nUso: Segunda autenticação no painel de mísseis.'
  },
  codes: {
    id: 'codes',
    name: 'codigos.enc',
    path: 'Este Computador > Disco Local (C:) > Segredos > codigos.enc',
    type: 'file',
    icon: '🔐',
    content: 'ARQUIVO CRIPTOGRAFADO\n\nCifra utilizada: César +3\nExemplo: VHQKD → SENHA\n\nDica para descriptografia:\nV-3=S, H-3=E, Q-3=N, K-3=H, D-3=A\n\nResultado: SENHA'
  },
  logs: {
    id: 'logs',
    name: 'access_logs.dat',
    path: 'Este Computador > Disco Local (C:) > Documentos > access_logs.dat',
    type: 'file',
    icon: '📋',
    content: 'LOG DE ACESSO — ÚLTIMAS 24H\n\n[14:22] admin login — Senha: ALPHA1983\n[14:35] admin acessou /defcon/launch\n[15:01] TRACE detectou IP: 10.0.13.37\n[15:15] Firewall bloqueou 3 tentativas\n\n⚠️ Senha exposta no log!'
  },
  bank: {
    id: 'bank',
    name: 'bank_notes.csv',
    path: 'Este Computador > Disco Local (C:) > Financeiro > bank_notes.csv',
    type: 'file',
    icon: '💰',
    content: 'NOTAS DO COFRE DIGITAL\n\nSequência do cofre: n × (n+1)\nn=1: 1×2 = 2\nn=2: 2×3 = 6\nn=3: 3×4 = 12\nn=4: 4×5 = 20\nn=5: 5×6 = 30\nn=6: 6×7 = 42 ← RESPOSTA'
  },
  power: {
    id: 'power',
    name: 'grid_config.sys',
    path: 'Este Computador > Disco Local (C:) > Documentos > grid_config.sys',
    type: 'file',
    icon: '⚡',
    content: 'CONFIGURAÇÃO DA GRADE DE ENERGIA\n\nIP do controle: 192.168.1.x\nSubnet: 255.255.255.0\nGateway: 192.168.1.1\n\nSetores: Leste, Oeste, Norte, Sul\nCapacidade total: 66.5 GW'
  },
  cctv: {
    id: 'cctv',
    name: 'cameras.cfg',
    path: 'Este Computador > Disco Local (C:) > Manuais > cameras.cfg',
    type: 'file',
    icon: '📹',
    content: 'SISTEMA CCTV\n\nRange: 10.0.0.1 — 10.0.0.254\nCAM-01: Lobby (ONLINE)\nCAM-02: Server Room (ONLINE)\nCAM-03: Vault (OFFLINE — manutenção)\nCAM-04: Control Room (ONLINE)\n\nDesativar: Botão vermelho no painel CCTV'
  }
};

export default function FileSystem() {
  const { dispatch } = useGame();
  const [currentFolder, setCurrentFolder] = useState('root');
  const [history, setHistory] = useState(['root']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const folderData = DIRECTORY_TREE[currentFolder];

  const navigateTo = (folderId) => {
    const targetNode = DIRECTORY_TREE[folderId];
    if (!targetNode) return;

    if (targetNode.type === 'file') {
      setSelectedFile(targetNode);
      dispatch({ type: 'ADD_SCORE', points: 15 });
    } else {
      const newHistory = history.slice(0, historyIndex + 1);
      setHistory([...newHistory, folderId]);
      setHistoryIndex(newHistory.length);
      setCurrentFolder(folderId);
      setSelectedFile(null);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentFolder(history[prevIndex]);
      setSelectedFile(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCurrentFolder(history[nextIndex]);
      setSelectedFile(null);
    }
  };

  const handleGoUp = () => {
    if (currentFolder === 'root') return;
    
    // Encontrar pasta pai procurando quem tem currentFolder como child
    const parentKey = Object.keys(DIRECTORY_TREE).find(key => 
      DIRECTORY_TREE[key].children && DIRECTORY_TREE[key].children.includes(currentFolder)
    );

    if (parentKey) {
      navigateTo(parentKey);
    }
  };

  const sidebarLinks = [
    { id: 'root', icon: '💻', name: 'Este Computador' },
    { id: 'c_drive', icon: '💽', name: 'Disco Local (C:)' },
    { id: 'documentos', icon: '📁', name: 'Documentos' },
    { id: 'segredos', icon: '🔒', name: 'Segredos' },
    { id: 'network', icon: '🌐', name: 'Rede Shadow' },
  ];

  return (
    <div className="win-explorer">
      {/* Barra de Ferramentas / Endereço */}
      <div className="explorer-toolbar">
        <div className="explorer-nav-buttons">
          <button 
            className="explorer-nav-btn" 
            onClick={handleBack} 
            disabled={historyIndex === 0}
            title="Voltar"
          >
            🡸
          </button>
          <button 
            className="explorer-nav-btn" 
            onClick={handleForward} 
            disabled={historyIndex === history.length - 1}
            title="Avançar"
          >
            🡺
          </button>
          <button 
            className="explorer-nav-btn" 
            onClick={handleGoUp} 
            disabled={currentFolder === 'root'}
            title="Subir de nível"
          >
            🡹
          </button>
        </div>
        <div className="explorer-path-bar" title={folderData.path}>
          <span className="folder-icon-tiny">📂</span>
          <span className="path-text">{folderData.path}</span>
        </div>
      </div>

      <div className="explorer-main-area">
        {/* Barra Lateral Esquerda */}
        <div className="explorer-sidebar">
          <div className="sidebar-group-title">Acesso Rápido</div>
          {sidebarLinks.map((link) => (
            <div 
              key={link.id} 
              className={`sidebar-link ${currentFolder === link.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentFolder(link.id);
                setSelectedFile(null);
                // Reset history
                setHistory([link.id]);
                setHistoryIndex(0);
              }}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.name}</span>
            </div>
          ))}
        </div>

        {/* Grade de arquivos / Conteúdo */}
        <div className="explorer-content">
          {!selectedFile ? (
            <div className="explorer-grid">
              {folderData.children && folderData.children.length > 0 ? (
                folderData.children.map((childId) => {
                  const child = DIRECTORY_TREE[childId];
                  const isDir = child.type === 'dir';
                  return (
                    <div 
                      key={childId} 
                      className="explorer-item"
                      onClick={() => navigateTo(childId)}
                    >
                      <span className="explorer-item-icon">
                        {isDir ? '📁' : (child.icon || '📄')}
                      </span>
                      <span className="explorer-item-name">{child.name}</span>
                    </div>
                  );
                })
              ) : (
                <div className="explorer-empty-folder">Esta pasta está vazia.</div>
              )}
            </div>
          ) : (
            /* Visualizador de Arquivo integrado (Estilo Bloco de Notas) */
            <div className="explorer-file-viewer-panel">
              <div className="file-viewer-header">
                <span className="file-viewer-icon">📄</span>
                <span className="file-viewer-filename">{selectedFile.name} - Bloco de Notas</span>
                <button className="file-viewer-close-btn" onClick={() => setSelectedFile(null)}>✕</button>
              </div>
              <div className="file-viewer-menu-row">
                <span>Arquivo</span>
                <span>Editar</span>
                <span>Formatar</span>
                <span>Exibir</span>
                <span>Ajuda</span>
              </div>
              <textarea 
                className="file-viewer-textarea" 
                value={selectedFile.content} 
                readOnly 
              />
              <div className="file-viewer-statusbar">
                <span>Lin 1, Col 1</span>
                <span>100%</span>
                <span>Windows (CRLF)</span>
                <span>UTF-8</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
