import { useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function MissileControl() {
  const { state, dispatch } = useGame();
  const [alphaCode, setAlphaCode] = useState('');
  const [betaCode, setBetaCode] = useState('');
  const [feedback, setFeedback] = useState(null);

  const verifyAlpha = () => {
    if (alphaCode === '742839') {
      dispatch({ type: 'CODE_ALPHA' });
      dispatch({ type: 'ADD_SCORE', points: 400 });
      dispatch({ type: 'ADD_ACHIEVEMENT', id: 'code_alpha' });
      setFeedback({ type: 'success', text: '✅ Código Alpha verificado!' });
    } else {
      dispatch({ type: 'ADD_TRACE', amount: 15 });
      setFeedback({ type: 'error', text: '❌ Código inválido — Trace +15%' });
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const verifyBeta = () => {
    if (betaCode === '470511') {
      dispatch({ type: 'CODE_BETA' });
      dispatch({ type: 'ADD_SCORE', points: 400 });
      dispatch({ type: 'ADD_ACHIEVEMENT', id: 'code_beta' });
      setFeedback({ type: 'success', text: '✅ Código Beta verificado! COUNTDOWN INICIADO!' });

      dispatch({
        type: 'PUSH_NARRATIVE',
        narrative: {
          speaker: 'ARIA — I.A. PARCEIRA',
          text: '⚠️ ATENÇÃO GHOST!\n\nAmbos os códigos foram inseridos. O sistema de autodestruição foi ativado — você tem 30 SEGUNDOS para apertar o botão ABORT!\n\nRÁPIDO!',
        },
      });
      dispatch({ type: 'SHOW_NEXT_NARRATIVE' });
    } else {
      dispatch({ type: 'ADD_TRACE', amount: 15 });
      setFeedback({ type: 'error', text: '❌ Código inválido — Trace +15%' });
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const abortMissile = () => {
    dispatch({ type: 'ABORT_MISSILE' });
    dispatch({ type: 'ADD_SCORE', points: 1000 });
    dispatch({ type: 'ADD_ACHIEVEMENT', id: 'mission_complete' });
  };

  return (
    <div className="missile-panel">
      <div className="missile-header">
        <h2>⚠️ MISSILE COMMAND ⚠️</h2>
      </div>

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
            {state.codeAlpha ? '✅ VERIFICADO' : 'VERIFICAR'}
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
            {state.codeBeta ? '✅ VERIFICADO' : 'VERIFICAR'}
          </button>
        </div>

        {/* Silos */}
        <div className="missile-block">
          <h3>📡 SILOS</h3>
          <p style={{ margin: '6px 0', fontSize: 12 }}>
            <span className={`led ${state.codeAlpha ? 'led-green' : 'led-red'}`} />
            Montana
          </p>
          <p style={{ margin: '6px 0', fontSize: 12 }}>
            <span className={`led ${state.codeAlpha ? (state.codeBeta ? 'led-green' : 'led-amber') : 'led-red'}`} />
            Wyoming
          </p>
          <p style={{ margin: '6px 0', fontSize: 12 }}>
            <span className={`led ${state.codeBeta ? 'led-green' : 'led-red'}`} />
            Colorado
          </p>
        </div>

        {/* Countdown */}
        <div className="missile-block">
          <h3>⏱️ COUNTDOWN</h3>
          <div className="missile-countdown">
            {state.countdown !== null
              ? `00:${state.countdown.toString().padStart(2, '0')}`
              : '--:--'}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`puzzle-feedback ${feedback.type}`} style={{ marginTop: 12 }}>
          {feedback.text}
        </div>
      )}

      {/* Abort Button */}
      <button
        className="missile-abort-btn"
        onClick={abortMissile}
        disabled={!state.codeBeta || state.missileAborted}
      >
        {state.missileAborted ? '✅ MISSÃO COMPLETA' : '🛑 ABORT LAUNCH'}
      </button>
    </div>
  );
}
