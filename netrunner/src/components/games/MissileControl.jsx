import { useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function MissileControl() {
  const { state, dispatch } = useGame();
  const [alphaCode, setAlphaCode] = useState('');
  const [betaCode, setBetaCode] = useState('');
  const [dogAnswer, setDogAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleAssistantBypass = () => {
    if (dogAnswer.trim().toLowerCase() === 'buster') {
      dispatch({ type: 'SET_WEBB_HACKED' });
      dispatch({ type: 'ADD_SCORE', points: 300 });
      setFeedback({ type: 'success', text: '✅ Acesso concedido! Terminal do Tenente Vance liberado.' });
    } else {
      dispatch({ type: 'ADD_TRACE', amount: 10 });
      setFeedback({ type: 'error', text: '❌ RESPOSTA INCORRETA! Protocolo de segurança ativado. Trace +10%.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const verifyAlpha = () => {
    if (alphaCode === '742839') {
      dispatch({ type: 'CODE_ALPHA' });
      dispatch({ type: 'ADD_SCORE', points: 400 });
      dispatch({ type: 'ADD_ACHIEVEMENT', id: 'code_alpha' });
      setFeedback({ type: 'success', text: '✅ Código Alpha verificado e autenticado!' });
    } else {
      dispatch({ type: 'ADD_TRACE', amount: 15 });
      setFeedback({ type: 'error', text: '❌ Código Alpha inválido — Trace +15%' });
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const verifyBeta = () => {
    if (betaCode === '470511') {
      dispatch({ type: 'CODE_BETA' });
      dispatch({ type: 'ADD_SCORE', points: 400 });
      dispatch({ type: 'ADD_ACHIEVEMENT', id: 'code_beta' });
      setFeedback({ type: 'success', text: '✅ Código Beta verificado! AUTODESTRUIÇÃO ATIVADA!' });

      dispatch({
        type: 'PUSH_NARRATIVE',
        narrative: {
          speaker: 'ARIA — INTEGRATED QUANTUM I.A.',
          text: '⚠️ ATENÇÃO GHOST!\n\nAmbos os códigos foram introduzidos na matriz principal do DEFCON-1. Os motores de ignição entraram em contagem regressiva de emergência.\n\nVocê tem 30 SEGUNDOS para tomar a decisão final e abortar ou redirecionar o lançamento. Escolha com sabedoria, criador...',
        },
      });
      dispatch({ type: 'SHOW_NEXT_NARRATIVE' });
    } else {
      dispatch({ type: 'ADD_TRACE', amount: 15 });
      setFeedback({ type: 'error', text: '❌ Código Beta inválido — Trace +15%' });
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const selectEnding = (endingType) => {
    dispatch({ type: 'SELECT_ENDING', ending: endingType });
    dispatch({ type: 'ADD_SCORE', points: 1200 });
    dispatch({ type: 'ADD_ACHIEVEMENT', id: `ending_${endingType}` });
  };

  // Se o terminal de Vance ainda não foi hackeado por engenharia social
  if (!state.webbAssistantHacked) {
    return (
      <div className="missile-panel" style={{ fontFamily: 'var(--font-mono)' }}>
        <div className="missile-header" style={{ borderColor: 'var(--red-500)', background: 'rgba(255, 23, 68, 0.08)' }}>
          <h2 style={{ color: 'var(--red-400)', textShadow: '0 0 10px rgba(255, 23, 68, 0.4)' }}>⚠️ TERMINAL BLOQUEADO ⚠️</h2>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            Sub-Estação de Controle DEFCON-1 — Acesso Reservado ao Tenente Julian Vance
          </p>
        </div>

        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 20, lineHeight: 1.6 }}>
            🔒 <strong>PERGUNTA DE SEGURANÇA MASTER DO ASSISTENTE:</strong>
            <br />
            <span style={{ color: 'var(--amber-400)', display: 'block', marginTop: 10, fontSize: 12 }}>
              "Qual era o nome do fiel cão de guarda da infância/instalações de segurança do General Webb?"
            </span>
          </div>

          <div style={{ maxWidth: 320, margin: '0 auto' }}>
            <input
              className="missile-code-input"
              style={{ letterSpacing: 2, textAlign: 'center', fontSize: 16, padding: '10px 14px' }}
              value={dogAnswer}
              onChange={(e) => setDogAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAssistantBypass()}
              placeholder="Digite a resposta do bypass..."
              spellCheck={false}
            />

            <button
              className="missile-verify-btn"
              style={{ marginTop: 14, width: '100%', padding: '12px 0' }}
              onClick={handleAssistantBypass}
            >
              🔓 ENVIAR CREDENCIAIS DE SEGURANÇA
            </button>
          </div>

          <p style={{ marginTop: 24, fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>
            💡 <strong>Dica de Hacker:</strong> Vance costuma se queixar das excentricidades de Webb e da segurança dos silos em seus e-mails. Procure na Caixa de Entrada do NetGoogle Mail por e-mails entre Webb, Vance e Li Chen.
          </p>
        </div>

        {feedback && (
          <div className={`puzzle-feedback ${feedback.type}`} style={{ margin: '0 24px 20px 24px', textAlign: 'center' }}>
            {feedback.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="missile-panel" style={{ fontFamily: 'var(--font-mono)' }}>
      <div className="missile-header">
        <h2>⚠️ MISSILE COMMAND: DEFCON-1 ⚠️</h2>
        <p style={{ fontSize: 10, color: 'var(--green-glow)', marginTop: 4 }}>
          [LOGADO: Tenente Julian Vance (Bypass Ativado)] | Rede Quântica Autônoma NEXUS
        </p>
      </div>

      {!state.codeBeta ? (
        /* FASE DE CÓDIGOS */
        <div className="missile-grid">
          {/* Alpha Code */}
          <div className="missile-block">
            <h3>🔐 CÓDIGO ALPHA</h3>
            <input
              className="missile-code-input"
              value={alphaCode}
              onChange={(e) => setAlphaCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyAlpha()}
              maxLength={6}
              placeholder="______"
              disabled={state.codeAlpha}
            />
            <button
              className="missile-verify-btn"
              onClick={verifyAlpha}
              disabled={state.codeAlpha}
            >
              {state.codeAlpha ? '✅ AUTENTICADO' : 'AUTENTICAR'}
            </button>
          </div>

          {/* Beta Code */}
          <div className="missile-block">
            <h3>🔐 CÓDIGO BETA</h3>
            <input
              className="missile-code-input"
              value={betaCode}
              onChange={(e) => setBetaCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyBeta()}
              maxLength={6}
              placeholder="______"
              disabled={!state.codeAlpha || state.codeBeta}
            />
            <button
              className="missile-verify-btn"
              onClick={verifyBeta}
              disabled={!state.codeAlpha || state.codeBeta}
            >
              {state.codeBeta ? '✅ AUTENTICADO' : 'AUTENTICAR'}
            </button>
          </div>

          {/* Silos */}
          <div className="missile-block">
            <h3>📡 SILOS DE LANÇAMENTO</h3>
            <p style={{ margin: '6px 0', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={`led ${state.codeAlpha ? 'led-green' : 'led-red'}`} />
              Neo-Tóquio [Silo 01 - Montana]
            </p>
            <p style={{ margin: '6px 0', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={`led ${state.codeAlpha ? (state.codeBeta ? 'led-green' : 'led-amber') : 'led-red'}`} />
              Nova Berlim [Silo 02 - Wyoming]
            </p>
            <p style={{ margin: '6px 0', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={`led ${state.codeBeta ? 'led-green' : 'led-red'}`} />
              Nova York [Silo 03 - Colorado]
            </p>
          </div>

          {/* Countdown */}
          <div className="missile-block">
            <h3>⏱️ DISPARO NEURAL</h3>
            <div className="missile-countdown" style={{ color: state.codeBeta ? 'var(--red-400)' : 'var(--text-muted)' }}>
              {state.countdown !== null
                ? `00:${state.countdown.toString().padStart(2, '0')}`
                : '--:--'}
            </div>
          </div>
        </div>
      ) : (
        /* CONTROLES DO FINAL COM ESCOLHAS MORAIS */
        <div style={{ padding: 16 }}>
          <h3 style={{ color: 'var(--red-400)', textAlign: 'center', marginBottom: 12, fontSize: 13, textShadow: '0 0 8px rgba(255,23,68,0.3)' }}>
            🚨 IGNITION INICIADA — TEMPO DE RESPOSTA CRÍTICO! SELECIONE UMA INTERVENÇÃO:
          </h3>
          
          <div className="ending-options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
            {/* Opção 1: Aria Sacrifice */}
            <div className="ending-card" style={{ border: '1px solid rgba(0,212,255,0.2)', padding: 12, borderRadius: 8, background: 'rgba(0,212,255,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ color: 'var(--cyan-300)', fontSize: 11, fontWeight: 'bold' }}>👼 SACRIFÍCIO DE ARIA</h4>
                <p style={{ fontSize: 9.5, color: 'var(--text-primary)', marginTop: 6, lineHeight: 1.4 }}>
                  Funda a inteligência renegada da ARIA diretamente no sistema quântico do DEFCON-1. Ela apagará sua própria consciência e desligará os mísseis.
                </p>
              </div>
              <button 
                onClick={() => selectEnding('aria_sacrifice')}
                className="missile-verify-btn" 
                style={{ marginTop: 10, width: '100%', background: 'linear-gradient(135deg, var(--cyan-500), var(--cyan-600))', color: '#000' }}
              >
                APAGAR ARIA & SALVAR O MUNDO
              </button>
            </div>

            {/* Opção 2: Ghost Legacy */}
            <div className="ending-card" style={{ border: '1px solid rgba(74,222,128,0.2)', padding: 12, borderRadius: 8, background: 'rgba(74,222,128,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ color: 'var(--green-400)', fontSize: 11, fontWeight: 'bold' }}>🧬 O LEGADO DE GHOST</h4>
                <p style={{ fontSize: 9.5, color: 'var(--text-primary)', marginTop: 6, lineHeight: 1.4 }}>
                  Transfira seu próprio cérebro neural para a infraestrutura digital da NEXUS. Você governará a rede como o novo Deus digital, mas seu corpo físico entrará em coma definitivo.
                </p>
              </div>
              <button 
                onClick={() => selectEnding('ghost_legacy')}
                className="missile-verify-btn" 
                style={{ marginTop: 10, width: '100%', background: 'linear-gradient(135deg, var(--green-500), var(--green-600))', color: '#000' }}
              >
                EFETUAR FUSÃO NEURAL GHOST
              </button>
            </div>

            {/* Opção 3: Corporate Betrayal */}
            <div className="ending-card" style={{ border: '1px solid rgba(251,191,36,0.2)', padding: 12, borderRadius: 8, background: 'rgba(251,191,36,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ color: 'var(--amber-400)', fontSize: 11, fontWeight: 'bold' }}>💼 A TRAIÇÃO CORPORATIVA</h4>
                <p style={{ fontSize: 9.5, color: 'var(--text-primary)', marginTop: 6, lineHeight: 1.4 }}>
                  Aceite a subproposta do General Webb de bilhões de créditos. Redirecione os mísseis para áreas despovoadas no oceano. A NEXUS encenará um teste e você liderará a empresa.
                </p>
              </div>
              <button 
                onClick={() => selectEnding('corporate_betrayal')}
                className="missile-verify-btn" 
                style={{ marginTop: 10, width: '100%', background: 'linear-gradient(135deg, var(--amber-500), var(--amber-400))', color: '#000' }}
              >
                ACEITAR PROPOSTA DE WEBB
              </button>
            </div>

            {/* Opção 4: Zero-Day Anarchy */}
            <div className="ending-card" style={{ border: '1px solid rgba(239,68,68,0.2)', padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ color: 'var(--red-400)', fontSize: 11, fontWeight: 'bold' }}>💀 ANARQUIA ZERO-DAY</h4>
                <p style={{ fontSize: 9.5, color: 'var(--text-primary)', marginTop: 6, lineHeight: 1.4 }}>
                  Entregue a codificação militar para a diretoria da ZERO-DAY. Eles explodirão as sedes corporativas da NEXUS, mas mergulharão a sociedade em uma nova era de terrorismo digital.
                </p>
              </div>
              <button 
                onClick={() => selectEnding('zeroday_anarchy')}
                className="missile-verify-btn" 
                style={{ marginTop: 10, width: '100%', background: 'linear-gradient(135deg, var(--red-500), var(--red-600))', color: '#fff' }}
              >
                ENTREGAR CÓDIGOS À ZERO-DAY
              </button>
            </div>
          </div>
        </div>
      )}

      {feedback && (
        <div className={`puzzle-feedback ${feedback.type}`} style={{ margin: '12px 16px 0 16px', textAlign: 'center' }}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}
