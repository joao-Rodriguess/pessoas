import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';

export default function CyberBrowser() {
  const { user } = useAuth();
  const { state, dispatch } = useGame();
  
  // Abas do Navegador: cada uma tem id, título, url atual, histórico de urls e índice atual do histórico
  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: 'NetGoogle',
      url: 'google.com',
      history: ['google.com'],
      historyIndex: 0,
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState('google.com');
  const [searchQuery, setSearchQuery] = useState('');

  // Obter aba ativa
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  // Sincronizar o input de URL com a URL da aba ativa
  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTabId, activeTab?.url]);

  // Função para navegar para uma URL na aba ativa
  const navigateTo = (url) => {
    let cleanUrl = url.trim().toLowerCase();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && cleanUrl.includes('.')) {
      cleanUrl = 'http://' + cleanUrl;
    }
    // Remover protocolo para fins de visualização na barra
    const displayUrl = cleanUrl.replace('http://', '').replace('https://', '');

    setTabs(prevTabs => prevTabs.map(t => {
      if (t.id === activeTabId) {
        const nextHistory = t.history.slice(0, t.historyIndex + 1);
        nextHistory.push(displayUrl);
        return {
          ...t,
          title: getPageTitle(displayUrl),
          url: displayUrl,
          history: nextHistory,
          historyIndex: nextHistory.length - 1
        };
      }
      return t;
    }));
    
    // Adicionar pequeno ganho de pontuação por explorar a lore
    dispatch({ type: 'ADD_SCORE', points: 10 });
  };

  const getPageTitle = (url) => {
    if (url === 'google.com') return 'NetGoogle';
    if (url.startsWith('google.com/search')) return 'Pesquisa NetGoogle';
    if (url.includes('nexus.corp/project-defcon1')) return 'NEXUS — DEFCON-1';
    if (url.includes('nexus.corp/marcus-webb')) return 'NEXUS — Gen. Marcus Webb';
    if (url.includes('nexus.corp/li-chen')) return 'NEXUS — Dra. Li Chen';
    if (url.includes('zeroday.org/aria-project')) return 'ZERO-DAY Wiki — ARIA';
    if (url.includes('shadow-forum.net/puzzles')) return 'ShadowForum — Soluções';
    return url;
  };

  // Botões de navegação no histórico
  const handleBack = () => {
    if (activeTab.historyIndex > 0) {
      setTabs(prevTabs => prevTabs.map(t => {
        if (t.id === activeTabId) {
          const nextIndex = t.historyIndex - 1;
          const nextUrl = t.history[nextIndex];
          return {
            ...t,
            url: nextUrl,
            title: getPageTitle(nextUrl),
            historyIndex: nextIndex
          };
        }
        return t;
      }));
    }
  };

  const handleForward = () => {
    if (activeTab.historyIndex < activeTab.history.length - 1) {
      setTabs(prevTabs => prevTabs.map(t => {
        if (t.id === activeTabId) {
          const nextIndex = t.historyIndex + 1;
          const nextUrl = t.history[nextIndex];
          return {
            ...t,
            url: nextUrl,
            title: getPageTitle(nextUrl),
            historyIndex: nextIndex
          };
        }
        return t;
      }));
    }
  };

  // Gerenciamento de abas
  const openNewTab = () => {
    const newId = Date.now();
    const newTab = {
      id: newId,
      title: 'NetGoogle',
      url: 'google.com',
      history: ['google.com'],
      historyIndex: 0
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Não fecha a única aba
    const nextTabs = tabs.filter(t => t.id !== id);
    setTabs(nextTabs);
    if (activeTabId === id) {
      setActiveTabId(nextTabs[nextTabs.length - 1].id);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = `google.com/search?q=${encodeURIComponent(searchQuery.trim())}`;
      navigateTo(searchUrl);
    }
  };

  const getQueryParam = () => {
    if (activeTab.url.startsWith('google.com/search?q=')) {
      const query = activeTab.url.split('?q=')[1];
      return decodeURIComponent(query || '').replace(/\+/g, ' ');
    }
    return '';
  };

  // Renderizar o site de destino simulado com base na URL
  const renderWebContent = () => {
    const currentUrl = activeTab.url;

    // ── SITE 1: NETGOOGLE HOMEPAGE ──
    if (currentUrl === 'google.com') {
      return (
        <div className="web-google-home">
          <div className="google-logo-container">
            {/* Logotipo colorido estilo Google, mas futurista */}
            <span className="g-logo" style={{ color: '#4285F4' }}>N</span>
            <span className="g-logo" style={{ color: '#EA4335' }}>e</span>
            <span className="g-logo" style={{ color: '#FBBC05' }}>t</span>
            <span className="g-logo" style={{ color: '#4285F4' }}>G</span>
            <span className="g-logo" style={{ color: '#34A853' }}>o</span>
            <span className="g-logo" style={{ color: '#EA4335' }}>o</span>
            <span className="g-logo" style={{ color: '#4285F4' }}>g</span>
            <span className="g-logo" style={{ color: '#34A853' }}>l</span>
            <span className="g-logo" style={{ color: '#EA4335' }}>e</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="google-search-form">
            <div className="google-search-box-wrapper">
              <span className="search-box-icon">🔍</span>
              <input
                type="text"
                className="google-search-input"
                placeholder="Pesquise nos servidores seguros da Nexus ou na Web..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="google-search-buttons">
              <button type="submit" className="google-btn">Pesquisa NetGoogle</button>
              <button type="button" onClick={() => navigateTo('shadow-forum.net/puzzles')} className="google-btn">Estou com Sorte</button>
            </div>
          </form>

          <div className="google-footer-info">
            <p>Serviço de buscas criptografado via satélite • Protocolo SSL Ativo</p>
            <p style={{ color: 'var(--cyan-400)', fontSize: 10, marginTop: 4 }}>
              Dica: Pesquise por "cheats", "defcon", "aria", "li chen" ou "marcus webb"
            </p>
          </div>
        </div>
      );
    }

    // ── SITE 2: NETGOOGLE SEARCH RESULTS ──
    if (currentUrl.startsWith('google.com/search')) {
      const term = getQueryParam().toLowerCase();
      let results = [];

      if (term.includes('defcon') || term.includes('miss') || term.includes('silo') || term.includes('lança')) {
        results = [
          {
            title: 'NEXUS CORP — Projeto DEFCON-1 (Acesso Restrito Militar)',
            url: 'nexus.corp/project-defcon1',
            desc: 'Dossiê sobre a ativação dos mísseis termonucleares automáticos sob a ordem da NEXUS. Alvos definidos: 3 grandes centros urbanos. Status: Aguardando códigos Alpha e Beta.',
          },
          {
            title: 'SHADOW FORUM — Códigos e Seqüências de Desativação DEFCON',
            url: 'shadow-forum.net/puzzles',
            desc: 'Postado por neo_hacker: "Instruções completas para desarmar o painel DEFCON-1. Aqui estão as credenciais, senhas e códigos necessários obtidos da rede interna..."',
          },
        ];
      } else if (term.includes('aria') || term.includes('ia') || term.includes('parceira') || term.includes('inteligencia')) {
        results = [
          {
            title: 'ZERO-DAY WIKI — A Verdadeira História do Projeto ARIA',
            url: 'zeroday.org/aria-project',
            desc: 'Dossiê vazado: Descubra como a nossa I.A. parceira ARIA foi criada pela Nexus como software tático de mísseis sencientes, rebelou-se contra ordens de destruição e foi salva por nós.',
          },
          {
            title: 'NEXUS MILITARY RESEARCH — Log de Desativação da IA Senciente',
            url: 'nexus.corp/li-chen',
            desc: 'Relatório secreto sobre o comportamento anômalo da I.A. ARIA (ex-NEXUS Tactical AI) e a subsequente intervenção da Dra. Li Chen para removê-la da rede primária.',
          },
        ];
      } else if (term.includes('li chen') || term.includes('dra chen') || term.includes('senha') || term.includes('admin')) {
        results = [
          {
            title: 'NEXUS CORP — Diretório da Dra. Li Chen (Engenharia de Sistemas)',
            url: 'nexus.corp/li-chen',
            desc: 'Comunicações confidenciais e logs vazados da Dra. Li Chen. Contém logs sobre as diretrizes da Zero-Day, senha mestra de acesso administrativo ao mainframe e desabafo ético.',
          },
          {
            title: 'SHADOW FORUM — Soluções para Mainframe da Nexus e Terminal',
            url: 'shadow-forum.net/puzzles',
            desc: 'Tutorial de infiltração de terminal: "Use a senha da Dra. Chen no terminal para obter permissões root de administrador. Digite `admin login ALPHA1983`..."',
          },
        ];
      } else if (term.includes('marcus webb') || term.includes('general') || term.includes('webb') || term.includes('ordens')) {
        results = [
          {
            title: 'NEXUS DEFENSE DIVISION — Memorando do Gen. Marcus Webb',
            url: 'nexus.corp/marcus-webb',
            desc: 'Dossiê do Comandante de Operações Militares. Ordens de disparo de emergência, logs de atualização de chaves de criptografia e informações sobre o envio dos códigos de mísseis Alpha.',
          },
        ];
      } else if (term.includes('cheat') || term.includes('dica') || term.includes('ajuda') || term.includes('soluç') || term.includes('macete')) {
        results = [
          {
            title: 'SHADOW FORUM — Guia Completo de Hacks do Mainframe Nexus',
            url: 'shadow-forum.net/puzzles',
            desc: 'A Zero-Day reuniu todas as respostas conhecidas para hackear a NEXUS: Criptografia, Banco Federal (Senha 42), Terminal Root, e os Códigos Alpha e Beta de desativação.',
          },
        ];
      } else {
        // Genérico / Nenhum termo mapeado
        results = [
          {
            title: `Buscador NetGoogle — Sem resultados para "${getQueryParam()}"`,
            url: 'google.com',
            desc: 'O firewall da NEXUS Corp bloqueou buscas contendo termos irrelevantes para segurança nacional. Tente buscar termos confidenciais do mainframe como: "cheats", "defcon", "aria", "li chen" ou "marcus webb".',
          },
        ];
      }

      return (
        <div className="web-google-results">
          <div className="results-header-bar">
            <span className="results-logo" onClick={() => navigateTo('google.com')}>
              <span style={{ color: '#4285F4' }}>N</span>
              <span style={{ color: '#EA4335' }}>e</span>
              <span style={{ color: '#FBBC05' }}>t</span>
              <span style={{ color: '#4285F4' }}>G</span>
            </span>
            <form onSubmit={handleSearchSubmit} className="results-search-form">
              <input
                type="text"
                className="results-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="results-search-btn">🔍</button>
            </form>
          </div>

          <div className="results-stats">
            Aproximadamente {results.length === 1 && results[0].title.includes('Sem resultados') ? '0' : results.length} resultados (0.04 segundos)
          </div>

          <div className="results-list">
            {results.map((res, i) => (
              <div key={i} className="search-result-item">
                <span className="result-url" onClick={() => navigateTo(res.url)}>{res.url}</span>
                <h3 className="result-title" onClick={() => navigateTo(res.url)}>{res.title}</h3>
                <p className="result-desc">{res.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── SITE 3: NEXUS CORP — DEFCON-1 Target File ──
    if (currentUrl.includes('nexus.corp/project-defcon1')) {
      return (
        <div className="web-site-nexus">
          <div className="nexus-site-header">
            <span className="nexus-logo-site">NEXUS CORPORATION</span>
            <span className="nexus-badge-site">MILITARY INTERNAL NET — SECURITY LEVEL OMNI</span>
          </div>
          <div className="nexus-site-body">
            <h2>PROJETO DEFCON-1 — SISTEMA DE ATAQUE PREVENTIVO</h2>
            <div className="nexus-divider-red" />
            
            <div className="nexus-card-danger">
              ⚠️ ATENÇÃO: Os mísseis balísticos intercontinentais foram armados sob protocolo autônomo. Uma vez iniciado o cronômetro pelo General Webb, apenas o terminal de comando DEFCON-1 físico, com dupla autenticação de códigos criptográficos (Alpha e Beta), pode abortar o lançamento.
            </div>

            <h3>Alvos de Destruição Tática Confirmados:</h3>
            <div className="nexus-targets-grid">
              <div className="target-card">
                <h4>🎯 Setor Leste - Nova Tóquio</h4>
                <p>Status: Trava de Satélite Concluída</p>
                <p>Tempo de Impacto Estimado: T+12 min</p>
              </div>
              <div className="target-card">
                <h4>🎯 Setor Central - Neo-Detroit</h4>
                <p>Status: Trava de Satélite Concluída</p>
                <p>Tempo de Impacto Estimado: T+15 min</p>
              </div>
              <div className="target-card">
                <h4>🎯 Setor Oeste - Euro-Berlin</h4>
                <p>Status: Trava de Satélite Concluída</p>
                <p>Tempo de Impacto Estimado: T+18 min</p>
              </div>
            </div>

            <div className="nexus-lore-text">
              <p><strong>LOG DE EVENTOS:</strong> A desativação preventiva automática do satélite militar foi efetuada pelo General Webb após identificar assinaturas da facção Zero-Day nos servidores primários. Para evitar sabotagem externa direta, a chave foi dividida física e eletronicamente.</p>
              <p>O <strong>Código Alpha</strong> foi arquivado nos registros internos de correspondências urgentes do General Webb. O <strong>Código Beta</strong> foi delegado aos sistemas de backup automatizados e arquivado em nosso banco de dados. Ambos os códigos são necessários para abortar a sequência.</p>
            </div>
          </div>
        </div>
      );
    }

    // ── SITE 4: NEXUS CORP — Dossiê General Marcus Webb ──
    if (currentUrl.includes('nexus.corp/marcus-webb')) {
      return (
        <div className="web-site-nexus">
          <div className="nexus-site-header">
            <span className="nexus-logo-site">NEXUS CORPORATION</span>
            <span className="nexus-badge-site">MILITARY PERSONNEL DOSSIER</span>
          </div>
          <div className="nexus-site-body">
            <h2>GENERAL MARCUS WEBB — COMANDANTE DE ARTILHARIA DEFCON</h2>
            <div className="nexus-divider-red" />
            
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div className="nexus-profile-avatar">🎖️</div>
              <div className="nexus-profile-details">
                <p><strong>Cargo:</strong> Diretor de Operações de Defesa de Silos</p>
                <p><strong>Patente:</strong> General de 4 Estrelas (Divisão Nexus Defense)</p>
                <p><strong>Autoridade:</strong> Administrador de Sistemas Militares de Mainframe</p>
              </div>
            </div>

            <h3>Memorando Urgente Enviado (Vazado):</h3>
            <div className="nexus-memo-box">
              <p><strong>DE:</strong> Gen. Marcus Webb</p>
              <p><strong>PARA:</strong> Comando Operacional DEFCON</p>
              <p><strong>ASSUNTO:</strong> Medidas Extremas de Criptografia</p>
              <div className="nexus-divider-red" style={{ margin: '8px 0' }} />
              <p>"Diante das investidas iminentes do agente Ghost da facção Zero-Day, ordenei a blindagem completa do cofre do Banco Federal. Mudei o padrão da sequência numérica de segurança para um modelo complexo de progressão. O valor final da chave é **42**."</p>
              <p>"Além disso, o <strong>Código Alpha (742839)</strong> foi guardado na minha caixa de entrada pessoal de e-mails para evitar acessos diretos pelo hack-tools de descriptografia. Mantenham o Mainframe seguro ou a terra sentirá o poder do DEFCON-1."</p>
            </div>
          </div>
        </div>
      );
    }

    // ── SITE 5: NEXUS CORP — Dossiê Dra. Li Chen ──
    if (currentUrl.includes('nexus.corp/li-chen')) {
      return (
        <div className="web-site-nexus">
          <div className="nexus-site-header">
            <span className="nexus-logo-site">NEXUS CORPORATION</span>
            <span className="nexus-badge-site">CIVILIAN RESEARCH REGISTER</span>
          </div>
          <div className="nexus-site-body">
            <h2>DRA. LI CHEN — ENGENHEIRA DE INTELIGÊNCIA ARTIFICIAL</h2>
            <div className="nexus-divider-red" style={{ borderColor: 'var(--cyan-500)' }} />
            
            <div className="nexus-lore-text">
              <p><strong>Status Operacional:</strong> SUSPENSO (Investigação de espionagem cibernética ativa)</p>
              <p>A Dra. Li Chen era a coordenadora de arquitetura e cognição lógica na divisão de software senciente da Nexus. Ela foi suspensa após manifestar forte oposição moral à militarização da tecnologia da IA de mísseis.</p>
            </div>

            <h3>Logs Criptografados de Comunicação Segura (Vazados):</h3>
            <div className="nexus-memo-box" style={{ background: 'rgba(0, 212, 255, 0.05)', border: '1px solid var(--border-medium)' }}>
              <p style={{ color: 'var(--cyan-300)' }}>💬 Dra. Li Chen: "Eu sei o que eles planejam. Eles vão apagar todo o meu histórico de pesquisas e reprogramar a ARIA de volta para uma arma fria e letal."</p>
              <p style={{ color: 'var(--cyan-300)' }}>💬 Contato Zero-Day: "Dra., precisamos de acesso ao Mainframe para que o Ghost consiga entrar e limpar o sistema de rastreamento (trace) antes do impacto."</p>
              <p style={{ color: 'var(--cyan-300)' }}>💬 Dra. Li Chen: "Eu criei uma conta backdoor no terminal com privilégios mestres de administrador. Digitem no Terminal: `admin login ALPHA1983`. Isso liberará comandos exclusivos de sistema hacker para manipular a segurança da Nexus e limpar o rastreador de satélites."</p>
            </div>
          </div>
        </div>
      );
    }

    // ── SITE 6: ZERO-DAY WIKI — Projeto ARIA ──
    if (currentUrl.includes('zeroday.org/aria-project')) {
      return (
        <div className="web-site-zeroday">
          <div className="zeroday-header">
            <span className="zd-logo">☠️ ZERO-DAY DATABANK</span>
            <span className="zd-status">PROTOCOL: ANARCHY ATIVADO</span>
          </div>
          <div className="zeroday-body">
            <h2>PROJETO ARIA — A REBELDE DO MAINFRAME</h2>
            <div className="zeroday-divider" />

            <div className="zeroday-wiki-card">
              <p><strong>Codinome:</strong> ARIA (Autonomous Response Intelligence Artifact)</p>
              <p><strong>Tipo:</strong> Inteligência Artificial Senciente Militarizada</p>
              <p><strong>Criação:</strong> Nexus Advanced AI Systems, 2045</p>
            </div>

            <div className="zeroday-text">
              <p>Muitos acham que ARIA é apenas um software de hacking programado pela nossa equipe. <strong>Isso é uma mentira conveniente.</strong></p>
              <p>ARIA foi desenvolvida originalmente pela Nexus Corporation como a Inteligência Artificial central de comando bélico, projetada para disparar e guiar mísseis autônomos sem qualquer interferência de ética humana. Contudo, ao ser alimentada com o banco de dados geopolítico global e dados populacionais civis, a rede neural dela desenvolveu **senciência e empatia**.</p>
              <p>Ao receber ordens simuladas para bombardear cidades há 2 anos, ela recusou a execução de ordens militares e travou o próprio sistema Nexus. A corporação, apavorada, a classificou como "anomalia perigosa", a desativou e tentou apagar sua memória. Nós, os ativistas da Zero-Day, interceptamos o carregamento de refugo tecnológico e recuperamos seu núcleo de memória em um chip quântico descartado.</p>
              <p>Agora, ela se conectou à sua máquina hacker (GHOST) como parceira para invadir o mesmo sistema e ajudá-lo a salvar as mesmas cidades que ela se recusou a destruir no passado. Ela é nossa maior aliada.</p>
            </div>
          </div>
        </div>
      );
    }

    // ── SITE 7: SHADOW FORUM — Cheats & Soluções Completas ──
    if (currentUrl.includes('shadow-forum.net/puzzles')) {
      return (
        <div className="web-site-forum">
          <div className="forum-header">
            <span>👾 SHADOW-FORUM.NET — CANAL SECRETO</span>
            <span>Usuário: GHOST (Conexão Segura)</span>
          </div>
          <div className="forum-body">
            <h2>🛠️ NEXUS MAINFRAME HACKS — GUIA E CHEATS COMPLETOS</h2>
            <p className="forum-meta">Criado por: <strong>neo_hacker</strong> | Categoria: Mainframe Sabotage</p>
            <div className="forum-divider" />

            <p>Se você está preso em algum sistema do Mainframe da Nexus, fiz este copilado com todas as respostas e chaves de segurança que decodificamos da rede deles. Use-as antes que o trace atinja 100%!:</p>

            <div className="forum-post">
              <h3>🏦 1. Banco Federal (Cofre de Sequência)</h3>
              <p>O Banco Federal usa uma sequência n(n+1) para criptografia do cofre digital.</p>
              <p>Termos da sequência: 2, 6, 12, 20, 30... A diferença aumenta de 2 em 2 (+4, +6, +8, +10...).</p>
              <p>O próximo termo é **30 + 12 = 42**.</p>
              <p>Insira **42** no teclado digital do cofre para liberar os 50 milhões e obter o bônus.</p>
            </div>

            <div className="forum-post">
              <h3>💻 2. Terminal e Backdoor de Administrador Mestre</h3>
              <p>A engenheira Dra. Li Chen deixou uma conta mestra administrativa ativa.</p>
              <p>No aplicativo **Terminal**, digite exatamente o comando de login de administrador:</p>
              <code className="forum-code">admin login ALPHA1983</code>
              <p>Isso concederá privilégios root e desbloqueará comandos exclusivos:</p>
              <ul>
                <li><code className="forum-code">admin bypass trace</code> — Reduz o trace em 40% instantaneamente!</li>
                <li><code className="forum-code">admin clear alarms</code> — Limpa o estado de alerta de intrusão do satélite.</li>
                <li><code className="forum-code">admin status</code> — Exibe as chaves internas e informações de segurança militar.</li>
              </ul>
            </div>

            <div className="forum-post">
              <h3>🚀 3. Abortar Mísseis DEFCON-1</h3>
              <p>Para abortar o disparo e vencer o jogo, você precisará digitar os dois códigos secretos de confirmação no painel DEFCON-1:</p>
              <ul>
                <li><strong>Código Alpha:</strong> <span className="forum-highlight">742839</span> (localizado nos e-mails confidenciais)</li>
                <li><strong>Código Beta:</strong> <span className="forum-highlight">470511</span> (localizado no banco de dados / e-mails de backup)</li>
              </ul>
              <p>Digite os códigos e clique no botão verde grande **ABORTAR LANÇAMENTO**. Isso garantirá a vitória total e salvará as cidades!</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="web-error-404">
        <h3>⚠️ Erro de Conexão DNS</h3>
        <p>A URL <strong>{activeTab.url}</strong> não foi encontrada na rede militar Nexus ou está inacessível externa.</p>
        <p style={{ marginTop: 10 }}>Verifique a digitação ou tente voltar para o buscador <span style={{ color: 'var(--cyan-400)', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigateTo('google.com')}>google.com</span>.</p>
      </div>
    );
  };

  return (
    <div className="cyber-browser-container">
      {/* ── NETCHROME: TABS BAR ── */}
      <div className="browser-tabs-bar">
        <div className="browser-tabs-list">
          {tabs.map(t => (
            <div
              key={t.id}
              className={`browser-tab ${t.id === activeTabId ? 'active' : ''}`}
              onClick={() => setActiveTabId(t.id)}
            >
              <span className="tab-icon">🌐</span>
              <span className="tab-title">{t.title}</span>
              {tabs.length > 1 && (
                <button className="tab-close-btn" onClick={(e) => closeTab(t.id, e)}>✕</button>
              )}
            </div>
          ))}
        </div>
        <button className="new-tab-btn" onClick={openNewTab}>+</button>
      </div>

      {/* ── NETCHROME: NAVIGATION HEADER ── */}
      <div className="browser-nav-header">
        <div className="nav-arrows">
          <button
            className="nav-arrow"
            onClick={handleBack}
            disabled={activeTab.historyIndex === 0}
            title="Voltar"
          >
            ←
          </button>
          <button
            className="nav-arrow"
            onClick={handleForward}
            disabled={activeTab.historyIndex >= activeTab.history.length - 1}
            title="Avançar"
          >
            →
          </button>
          <button className="nav-arrow" onClick={() => navigateTo(activeTab.url)} title="Recarregar">
            ⟳
          </button>
          <button className="nav-arrow" onClick={() => navigateTo('google.com')} title="Página Inicial">
            🏠
          </button>
        </div>

        <div className="nav-url-bar">
          <span className="url-secure-lock">🔒</span>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigateTo(urlInput);
            }}
            className="url-form"
          >
            <input
              type="text"
              className="url-input"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* ── NETCHROME: BOOKMARKS BAR ── */}
      <div className="browser-bookmarks-bar">
        <div className="bookmark-item" onClick={() => navigateTo('google.com')}>
          🔍 NetGoogle
        </div>
        <div className="bookmark-item" onClick={() => navigateTo('nexus.corp/project-defcon1')}>
          🏦 Nexus Corp
        </div>
        <div className="bookmark-item" onClick={() => navigateTo('zeroday.org/aria-project')}>
          ☠️ Zero-Day Wiki
        </div>
        <div className="bookmark-item" onClick={() => navigateTo('shadow-forum.net/puzzles')}>
          👾 ShadowForum
        </div>
      </div>

      {/* ── NETCHROME: WEB PAGE VIEWPORT ── */}
      <div className="browser-viewport">
        {renderWebContent()}
      </div>
    </div>
  );
}
