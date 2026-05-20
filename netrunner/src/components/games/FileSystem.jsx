import { useState } from 'react';
import { useGame } from '../../context/GameContext';

const FILES = [
  { id: 'zeus', icon: '📄', name: 'projeto_zeus.txt', content: 'PROJETO ZEUS — CLASSIFICADO\n\nO Projeto DEFCON-1 utiliza 3 silos:\n- SILO-01: Montana\n- SILO-02: Wyoming  \n- SILO-03: Colorado\n\nCódigo Beta de lançamento: 470511\n\nUso: Segunda autenticação no painel de mísseis.' },
  { id: 'codes', icon: '🔐', name: 'codigos.enc', content: 'ARQUIVO CRIPTOGRAFADO\n\nCifra utilizada: César +3\nExemplo: VHQKD → SENHA\n\nDica para descriptografia:\nV-3=S, H-3=E, Q-3=N, K-3=H, D-3=A\n\nResultado: SENHA' },
  { id: 'logs', icon: '📋', name: 'access_logs.dat', content: 'LOG DE ACESSO — ÚLTIMAS 24H\n\n[14:22] admin login — Senha: ALPHA1983\n[14:35] admin acessou /defcon/launch\n[15:01] TRACE detectou IP: 10.0.13.37\n[15:15] Firewall bloqueou 3 tentativas\n\n⚠️ Senha exposta no log!' },
  { id: 'bank', icon: '💰', name: 'bank_notes.csv', content: 'NOTAS DO COFRE DIGITAL\n\nSequência do cofre: n × (n+1)\nn=1: 1×2 = 2\nn=2: 2×3 = 6\nn=3: 3×4 = 12\nn=4: 4×5 = 20\nn=5: 5×6 = 30\nn=6: 6×7 = 42 ← RESPOSTA' },
  { id: 'power', icon: '⚡', name: 'grid_config.sys', content: 'CONFIGURAÇÃO DA GRADE DE ENERGIA\n\nIP do controle: 192.168.1.x\nSubnet: 255.255.255.0\nGateway: 192.168.1.1\n\nSetores: Leste, Oeste, Norte, Sul\nCapacidade total: 66.5 GW' },
  { id: 'cctv', icon: '📹', name: 'cameras.cfg', content: 'SISTEMA CCTV\n\nRange: 10.0.0.1 — 10.0.0.254\nCAM-01: Lobby (ONLINE)\nCAM-02: Server Room (ONLINE)\nCAM-03: Vault (OFFLINE — manutenção)\nCAM-04: Control Room (ONLINE)\n\nDesativar: Botão vermelho no painel CCTV' },
];

export default function FileSystem() {
  const { dispatch } = useGame();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpen = (file) => {
    setSelectedFile(file);
    dispatch({ type: 'ADD_SCORE', points: 15 });
  };

  return (
    <div style={{ padding: 14 }}>
      <div className="file-grid">
        {FILES.map((file) => (
          <div
            key={file.id}
            className="file-item"
            onClick={() => handleOpen(file)}
          >
            <span className="file-item-icon">{file.icon}</span>
            <span className="file-item-name">{file.name}</span>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div className="file-viewer">
          <div style={{ color: 'var(--amber-400)', marginBottom: 8, fontWeight: 'bold' }}>
            📄 {selectedFile.name}
          </div>
          {selectedFile.content}
        </div>
      )}
    </div>
  );
}
