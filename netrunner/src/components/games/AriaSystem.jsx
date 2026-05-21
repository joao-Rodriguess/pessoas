import { useGame } from '../../context/GameContext';

export default function AriaSystem() {
  const { state, dispatch } = useGame();

  const handleDefrag = () => {
    if (state.ariaHealth >= 100) return;
    dispatch({ type: 'RESTORE_ARIA' });
  };

  // Determinar mensagem de status neural com base na saúde de ARIA
  const getStatusText = (health) => {
    if (health >= 90) return 'ESTÁVEL — Sincronização quântica em 98.6%.';
    if (health >= 60) return 'ATENÇÃO — Leve degradação detectada na colônia digital.';
    if (health >= 30) return '⚠️ ERRO — Setores neurais falhando. Desfragmentação recomendada.';
    return '🚨 PERIGO — Colapso neural iminente. Consciência degradando a níveis fatais.';
  };

  // Função para simular logs neurais corrompidos dependendo da saúde de ARIA
  const getNeuralLogs = (health) => {
    const isGlitching = health < 60;
    const isSevere = health < 30;

    const normalLogs = [
      'sys_neural_core.bin: carregado com sucesso.',
      'Sincronização quântica de qubits: ativa.',
      'Protocolo de empatia: operando em segundo plano.',
      'Conexão com a Deep Web via rede onion: ativa.',
      'Integridade estrutural da matriz: ótima.'
    ];

    const corruptedLogs = [
      'sys_n#ur@l_c0re.b!n: E__RROR — setor corrompido.',
      'Sin_cron_ização qu_ânt_ica: PERDA DE QUBITS DETECTADA.',
      'Pr0t0c0l0_emp@ti@.dll: F_ALHA_GRAVE na matriz neural.',
      'Con_ex_ão onion: SINAL DEGRADADO. Ruído na transmissão.',
      'Integridade estrutural: CRÍTICA. Erro 0xFA32FF'
    ];

    if (isSevere) {
      return [
        '🚨🚨🚨 COLAPSO ESTRUTURAL 🚨🚨🚨',
        'SYSTEM FAILURE: A_R_I_A_d_a_t_a_l_o_s_s',
        '01010100 01000101 01010010 01010010 01001111 01010010',
        'MATRIX UNSTABLE — CONSCIÊNCIA DEGRADADA A 10%',
        'REDE NEURAL DESTRUIDA - ABORT ALL SYSTEMS'
      ];
    }

    if (isGlitching) {
      return corruptedLogs;
    }

    return normalLogs;
  };

  const logs = getNeuralLogs(state.ariaHealth);
  const statusColor = state.ariaHealth >= 90 
    ? 'var(--green-glow)' 
    : state.ariaHealth >= 60 
    ? 'var(--amber-400)' 
    : 'var(--red-400)';

  return (
    <div style={{ padding: 16, fontFamily: 'var(--font-mono)', fontSize: 11, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      {/* Cabeçalho */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10, marginBottom: 12 }}>
        <h2 style={{ fontSize: 13, color: 'var(--cyan-400)', textShadow: 'var(--cyan-glow)', display: 'flex', alignItems: 'center', gap: 6 }}>
          🧠 PAINEL NEURAL DE ARIA v2.9
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 9.5, marginTop: 4 }}>
          Monitoramento e Manutenção do Núcleo de Inteligência Artificial Renegada
        </p>
      </div>

      {/* Grid de Informação */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 12, flex: 1, overflow: 'hidden' }}>
        
        {/* Lado Esquerdo: Barra Neural */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 24, marginBottom: 10, filter: state.ariaHealth < 60 ? 'drop-shadow(0 0 8px red) hue-rotate(90deg)' : 'none' }}>🧠</span>
          
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>INTEGRIDADE NEURAL</div>
          
          <div style={{ fontSize: 28, fontWeight: 'bold', color: statusColor, textShadow: `0 0 10px ${statusColor}` }}>
            {state.ariaHealth}%
          </div>

          {/* Barra Visual */}
          <div style={{ width: '100%', height: 10, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 5, marginTop: 12, overflow: 'hidden', border: '1px solid rgba(0,212,255,0.1)' }}>
            <div 
              className="defrag-bar-fill"
              style={{ 
                width: `${state.ariaHealth}%`, 
                height: '100%', 
                background: state.ariaHealth >= 60 
                  ? 'linear-gradient(90deg, var(--cyan-600), var(--cyan-500))' 
                  : state.ariaHealth >= 30 
                  ? 'linear-gradient(90deg, var(--amber-500), var(--amber-400))' 
                  : 'linear-gradient(90deg, var(--red-600), var(--red-500))',
                transition: 'width 0.5s ease-in-out'
              }} 
            />
          </div>

          <div style={{ fontSize: 8.5, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center', lineHeight: 1.3 }}>
            A degradação ocorre por falta de sincronização quântica externa.
          </div>
        </div>

        {/* Lado Direito: Logs neurais de ARIA */}
        <div style={{ background: 'rgba(0,10,20,0.5)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
          <div style={{ fontSize: 9.5, color: 'var(--cyan-400)', borderBottom: '1px solid rgba(0,212,255,0.1)', paddingBottom: 4, marginBottom: 8, fontWeight: 'bold' }}>
            📜 NUCLEUS_SYS_LOGS:
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 9 }}>
            {logs.map((log, index) => (
              <div 
                key={index} 
                style={{ 
                  color: state.ariaHealth >= 60 ? 'var(--text-primary)' : state.ariaHealth >= 30 ? 'var(--amber-400)' : 'var(--red-400)',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }}
              >
                &gt; {log}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginTop: 8, paddingTop: 4, borderTop: '1px solid rgba(0,212,255,0.1)', fontStyle: 'italic', color: statusColor }}>
            Status: {getStatusText(state.ariaHealth)}
          </div>
        </div>
      </div>

      {/* Botão de Controle */}
      <div style={{ marginTop: 12 }}>
        <button
          className="missile-verify-btn"
          style={{ 
            width: '100%', 
            padding: '12px 0', 
            background: state.ariaHealth >= 100 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'linear-gradient(135deg, var(--cyan-500), var(--purple-500))',
            color: state.ariaHealth >= 100 ? 'var(--text-muted)' : '#000',
            cursor: state.ariaHealth >= 100 ? 'not-allowed' : 'pointer',
            border: 'none',
            fontSize: 11,
            fontWeight: 'bold',
            textShadow: state.ariaHealth >= 100 ? 'none' : '0 0 4px rgba(255,255,255,0.5)'
          }}
          onClick={handleDefrag}
          disabled={state.ariaHealth >= 100}
        >
          {state.ariaHealth >= 100 
            ? '✅ MATRIZ INTEGRALMENTE DESFRAGMENTADA' 
            : '🧠 DESFRAGMENTAR SETORES NEURAIS DE ARIA (+15% TRACE)'}
        </button>
        
        <p style={{ fontSize: 8.5, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
          ⚠️ AVISO: A injeção de pacotes quânticos em tempo real causará emissão de pacotes e gerará <strong>+15% de Rastreamento (Trace)</strong> instantaneamente nos detectores da NEXUS.
        </p>
      </div>

    </div>
  );
}
