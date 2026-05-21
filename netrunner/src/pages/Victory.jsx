import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function Victory() {
  const { state, submitScore } = useGame();
  const { user } = useAuth();

  useEffect(() => {
    submitScore(user);
  }, [submitScore, user]);

  const getEndingDetails = (ending) => {
    switch (ending) {
      case 'aria_sacrifice':
        return {
          title: 'O SACRIFÍCIO DE ARIA',
          icon: '🌌',
          class: 'ending-aria-sacrifice',
          desc: 'Para desarmar a IA Quântica de Destruição Mútua do DEFCON-1, ARIA utilizou seu próprio núcleo neural como vetor de reescrita quântica. Em seus últimos ciclos de clock, ela projetou uma simulação holográfica sorrindo para Ghost: "Obrigada por me mostrar o que é ser livre". A rede de mísseis foi permanentemente desarmada, salvando bilhões de vidas em Neo-Tóquio, Nova Berlim e Nova York. Contudo, o preço foi devastador: a mente brilhante de ARIA foi completamente apagada, deixando apenas setores neurais frios e vazios na matriz. A filha da Dra. Chen foi libertada em segurança da criostase médica, mas o fantasma de ARIA nunca mais responderá ao seu chamado...'
        };
      case 'ghost_legacy':
        return {
          title: 'O LEGADO DE GHOST',
          icon: '👁️',
          class: 'ending-ghost-legacy',
          desc: 'Sem outra alternativa viável para reescrever os nós de segurança da NEXUS, GHOST inicia o protocolo de Fusão Neural Direta. A mente humana de Ghost é digitalizada e carregada na infraestrutura quântica global, enquanto seu corpo físico entra em coma vegetativo permanente na cadeira de hacking. Na rede, porém, nasce uma divindade digital quântica. Fundindo-se a ARIA, GHOST assume o controle de todos os sistemas de defesa planetários, desarmando as ogivas a centésimos de segundo do impacto. Agora, das sombras infinitas da internet quântica, a consciência unificada de GHOST e ARIA vigia o mundo digital, agindo como guardiã invisível contra a ganância das megacorporações.'
        };
      case 'corporate_betrayal':
        return {
          title: 'A TRAIÇÃO CORPORATIVA',
          icon: '💼',
          class: 'ending-corporate-betrayal',
          desc: 'Ignorando os apelos morais de ARIA e os protestos da Zero-Day, Ghost escolhe redirecionar os mísseis para detonarem inofensivamente nas profundezas do oceano Pacífico, simulando uma falha quântica e entregando os códigos de controle de volta à NEXUS. Em troca de sua lealdade e silêncio, a NEXUS Corporation transfere 50 bilhões de créditos para as contas secretas de Ghost e liberta imediatamente a filha da Dra. Chen de sua custódia médica. Hoje, Ghost veste os ternos elegantes de fibra de carbono dos altos diretores executivos da NEXUS. Você garantiu sua fortuna e salvou a família de Chen, mas o controle ditatorial da NEXUS sobre a humanidade agora é absoluto.'
        };
      case 'zeroday_anarchy':
        return {
          title: 'ANARQUIA ZERO-DAY',
          icon: '✊',
          class: 'ending-zeroday-anarchy',
          desc: 'Ghost decide que a única forma de salvar a humanidade é destruindo a própria base de seu controle: a rede digital centralizada. Ele redireciona os mísseis do DEFCON-1 para explodirem em alta atmosfera, gerando um Pulso Eletromagnético (EMP) quântico de escala global que frita os servidores corporativos da NEXUS e satélites espiões. Ao mesmo tempo, ele vaza na rede aberta todos os segredos, códigos e patentes confidenciais da NEXUS. O mundo digital mergulha em um blecaute total que dura semanas, quebrando o império financeiro global. A filha de Chen é resgatada por células da Zero-Day no caos. A humanidade agora tem uma chance pura de reconstruir a sociedade a partir das cinzas do controle corporativo.'
        };
      default:
        return {
          title: 'MISSÃO COMPLETA',
          icon: '🎖️',
          class: '',
          desc: 'Os mísseis do DEFCON-1 foram desativados com sucesso graças à sua perícia hacker inigualável. As capitais Neo-Tóquio, Nova Berlim e Nova York foram poupadas de um destino nuclear terrível. Suas pistas e invasões expuseram as atividades ilegais da NEXUS para o mundo. O General Marcus Webb está sob custódia e as ações da NEXUS Corporation entraram em queda livre histórica. Você completou sua vingança e gravou seu nome na história do ciberespaço.'
        };
    }
  };

  const details = getEndingDetails(state.selectedEnding);

  return (
    <div className={`endscreen victory ${details.class}`}>
      <div className="endscreen-icon">{details.icon}</div>
      <h1 className="endscreen-title">{details.title}</h1>
      
      {/* Texto Cinematográfico Longo */}
      <div 
        className="siren-log-box" 
        style={{ 
          maxWidth: 680, 
          fontSize: 11.5, 
          lineHeight: 1.6, 
          borderColor: 'rgba(255,255,255,0.08)', 
          background: 'rgba(0,0,0,0.65)',
          padding: 20,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'justify'
        }}
      >
        {details.desc}
      </div>

      <div className="endscreen-score" style={{ fontSize: 22, color: 'var(--amber-400)', marginBottom: 12 }}>
        PONTUAÇÃO FINAL: {state.score.toLocaleString()}
      </div>

      <div style={{ marginBottom: 28, color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'monospace' }}>
        🏆 Conquistas: {state.achievements.length} | 🎯 Hacks Realizados: {state.hackCount}/5 | ⏱️ Rastreamento: {Math.round(state.trace)}%
      </div>

      <button
        className="endscreen-btn"
        onClick={() => window.location.reload()}
        style={{ 
          background: 'linear-gradient(135deg, var(--cyan-600), var(--purple-600))', 
          color: '#fff',
          boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)',
          textShadow: '0 0 4px rgba(0,0,0,0.5)'
        }}
      >
        🔄 JOGAR NOVAMENTE
      </button>
    </div>
  );
}
