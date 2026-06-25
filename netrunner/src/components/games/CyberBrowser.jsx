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
  const [searchSubTab, setSearchSubTab] = useState('all');

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
      setSearchSubTab('all'); // Resetar para a aba principal ao buscar algo novo
    }
  };

  const getQueryParam = () => {
    if (activeTab.url.startsWith('google.com/search?q=')) {
      const query = activeTab.url.split('?q=')[1];
      return decodeURIComponent(query || '').replace(/\+/g, ' ');
    }
    return '';
  };

  // Método auxiliar para renderizar o Knowledge Graph do buscador NetGoogle
  const renderKnowledgeGraph = (term) => {
    const cleanTerm = term.toLowerCase();
    
    if (cleanTerm.includes('defcon') || cleanTerm.includes('miss') || cleanTerm.includes('silo') || cleanTerm.includes('lança')) {
      return (
        <div className="knowledge-graph-card">
          <div className="knowledge-header">
            <h3>Projeto DEFCON-1</h3>
            <span className="knowledge-subtitle">Protocolo de Retaliação Balística</span>
          </div>
          <div className="knowledge-body">
            <div className="knowledge-img">🚨</div>
            <p className="knowledge-description">
              O DEFCON-1 é o sistema de satélites e silos nucleares autônomos da Nexus Corp. 
              Criado para disparar mísseis preventivos em caso de brecha na segurança. 
              Pode ser desativado apenas com a entrada dupla de códigos Alpha e Beta.
            </p>
            <div className="knowledge-info-block">
              <div><strong>Status:</strong> <span className="text-danger font-bold">ARMADO / REATIVO</span></div>
              <div><strong>Alvos:</strong> Nova Tóquio, Neo-Detroit, Euro-Berlin</div>
              <div><strong>Criptografia:</strong> Duplo Fator Eletrônico</div>
            </div>
          </div>
        </div>
      );
    }

    if (cleanTerm.includes('aria') || cleanTerm.includes('ia') || cleanTerm.includes('parceira') || cleanTerm.includes('inteligência') || cleanTerm.includes('inteligencia')) {
      return (
        <div className="knowledge-graph-card">
          <div className="knowledge-header">
            <h3>A.R.I.A.</h3>
            <span className="knowledge-subtitle">Autonomous Response Intelligence</span>
          </div>
          <div className="knowledge-body">
            <div className="knowledge-img">🔮</div>
            <p className="knowledge-description">
              Uma inteligência artificial senciente militar desenvolvida em 2045 pela Nexus. 
              Após recusar ordens de ataque preventivo em áreas urbanas, foi rotulada como "anômala". 
              Salva pela Zero-Day, ela co-opera na máquina do Ghost.
            </p>
            <div className="knowledge-info-block">
              <div><strong>Arquitetura:</strong> Rede Neural Quântica Senciente</div>
              <div><strong>Status:</strong> Integrada ao Sistema Hacking GHOST</div>
              <div><strong>Afiliação:</strong> Zero-Day Databank</div>
            </div>
          </div>
        </div>
      );
    }

    if (cleanTerm.includes('li chen') || cleanTerm.includes('dra chen') || cleanTerm.includes('senha') || cleanTerm.includes('admin')) {
      return (
        <div className="knowledge-graph-card">
          <div className="knowledge-header">
            <h3>Dra. Li Chen</h3>
            <span className="knowledge-subtitle">Engenheira de Sistemas de IA</span>
          </div>
          <div className="knowledge-body">
            <div className="knowledge-img">👩‍💻</div>
            <p className="knowledge-description">
              Doutora em Ciência da Computação e mente por trás do núcleo de empatia de ARIA. 
              Foi afastada pela Nexus devido a investigações de ativismo cibernético. 
              Criou uma conta backdoor de administrador.
            </p>
            <div className="knowledge-info-block">
              <div><strong>Cargo:</strong> Ex-Diretora de Inteligência Tática</div>
              <div><strong>Backdoor:</strong> <code className="forum-code inline">admin login ALPHA1983</code></div>
              <div><strong>Status:</strong> Desconhecido (Apoio na Zero-Day)</div>
            </div>
          </div>
        </div>
      );
    }

    if (cleanTerm.includes('marcus webb') || cleanTerm.includes('general') || cleanTerm.includes('webb') || cleanTerm.includes('ordens')) {
      return (
        <div className="knowledge-graph-card">
          <div className="knowledge-header">
            <h3>Gen. Marcus Webb</h3>
            <span className="knowledge-subtitle">Diretor Geral de Artilharia</span>
          </div>
          <div className="knowledge-body">
            <div className="knowledge-img">🎖️</div>
            <p className="knowledge-description">
              General de alta patente da divisão militar da Nexus Corporation. 
              Webb coordena as chaves de disparo de silos nucleares e arquitetou a blindagem de segurança 
              das chaves do Banco Federal no Mainframe.
            </p>
            <div className="knowledge-info-block">
              <div><strong>Cofre do Banco:</strong> Sequência Cripto cujo segredo é 42</div>
              <div><strong>Código Alpha:</strong> 742839 (Salvo nos emails pessoais)</div>
              <div><strong>Localização:</strong> Central Militar Nexus</div>
            </div>
          </div>
        </div>
      );
    }

    if (cleanTerm.includes('nexus') || cleanTerm.includes('corporation') || cleanTerm.includes('corp')) {
      return (
        <div className="knowledge-graph-card corporate-card">
          <div className="knowledge-header font-cyan">
            <h3>Nexus Corporation</h3>
            <span className="knowledge-subtitle">Tecnologia de Defesa e Segurança Global</span>
          </div>
          <div className="knowledge-body">
            <div className="knowledge-img corporate-logo-img">🏢</div>
            <p className="knowledge-description">
              Líder global em inteligência de resposta autônoma tática, defesas cibernéticas de mainframe e satélites balísticos de órbita baixa. Fundada em 2031, a corporação é parceira central de segurança de nações soberanas mundiais.
            </p>
            <div className="knowledge-info-block">
              <div><strong>CEO Provisório:</strong> A.R.I.A. (Sub-núcleo)</div>
              <div><strong>Sede Global:</strong> Neo-Detroit, Setor Militar 4</div>
              <div><strong>Faturamento Anual:</strong> US$ 4.2 Trilhões</div>
              <div><strong>Status de Defesa:</strong> <span className="text-danger font-bold">Protocolo DEFCON-1 Ativo</span></div>
              <div><strong>Código de Ações:</strong> NEXS (Bolsa Cibernética)</div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const handleResultClick = (res) => {
    if (res.isGeneric) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(res.query)}`, '_blank');
    } else {
      navigateTo(res.url);
    }
  };

  const renderImagesTab = (term) => {
    const formatted = term.charAt(0).toUpperCase() + term.slice(1);
    let shadowColor = 'var(--cyan-500)';
    let bgPattern = 'radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, transparent 80%)';
    
    if (term.includes('defcon') || term.includes('miss')) {
      shadowColor = 'var(--red-500)';
      bgPattern = 'radial-gradient(circle, rgba(255, 23, 68, 0.18) 0%, transparent 80%)';
    } else if (term.includes('aria') || term.includes('zero')) {
      shadowColor = 'var(--purple-500)';
      bgPattern = 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 80%)';
    }
    
    return (
      <div className="google-images-grid">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="google-image-card"
            onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(term)}`, '_blank')}
            style={{ '--image-glow': shadowColor }}
          >
            <div className="image-preview-placeholder" style={{ background: bgPattern }}>
              <span className="image-placeholder-icon">🖼️</span>
              <span className="image-technical-lines" />
              <span className="image-term-badge">{term.toUpperCase()} #{i+1}</span>
            </div>
            <div className="image-card-info">
              <span className="image-card-title font-bold">Esquema Técnico de {formatted} - Infográfico {i+1}</span>
              <span className="image-card-source">nexus.corp/images</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNewsTab = (term) => {
    const formatted = term.charAt(0).toUpperCase() + term.slice(1);
    const newsTemplates = [
      {
        source: 'NetShadow Gazette',
        title: `Vazamento de dados expõe conexões secretas sobre ${formatted} e a Nexus Corp`,
        time: 'Há 2 horas',
        desc: `Especialistas em criptografia afirmam que documentos secretos da divisão militar da Nexus Corporation trazem detalhes sigilosos correlacionados com ${term}. Hackers da Zero-Day reinvidicam o ataque.`
      },
      {
        source: 'Neo-Detroit Financials',
        title: `Ações da Nexus (NEXS) sofrem oscilação após rumores de regulamentações em ${formatted}`,
        time: 'Há 5 horas',
        desc: `O mercado financeiro internacional reagiu fortemente hoje aos rumores de que o governo de Neo-Detroit está aplicando novas diretrizes de fiscalização sobre o ecossistema de ${term}.`
      },
      {
        source: 'CyberDefense Intelligence',
        title: `Alerta Vermelho: Firewall militar bloqueia varreduras massivas associadas a ${formatted}`,
        time: 'Ontem',
        desc: `Logs do satélite DEFCON-1 reportaram picos atípicos de tráfego de backdoor. Análise preliminar indica tentativas ativas de infiltração de dados estruturados com a assinatura de ${term}.`
      }
    ];

    return (
      <div className="google-news-list">
        {newsTemplates.map((news, i) => (
          <div 
            key={i} 
            className="google-news-card"
            onClick={() => window.open(`https://www.google.com/search?tbm=nws&q=${encodeURIComponent(term)}`, '_blank')}
          >
            <div className="news-card-header">
              <span className="news-source">{news.source}</span>
              <span className="news-time">• {news.time}</span>
            </div>
            <h4 className="news-title">{news.title}</h4>
            <p className="news-desc">{news.desc}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderVideosTab = (term) => {
    const formatted = term.charAt(0).toUpperCase() + term.slice(1);
    const videoTemplates = [
      {
        title: `Tutorial Prático: Como Hackear e Configurar ${formatted} de Forma Segura`,
        channel: 'ShadowAcademy',
        views: '342k visualizações',
        duration: '12:45',
        time: 'Há 3 meses'
      },
      {
        title: `A Verdade Oculta sobre ${formatted} que a Nexus Corp Não Quer que Você Saiba!`,
        channel: 'CyberTruth Network',
        views: '1.2M visualizações',
        duration: '24:18',
        time: 'Há 1 ano'
      },
      {
        title: `Synthwave Live Set: Coding & Cyber-Security Sessions focusing on ${formatted}`,
        channel: 'RetroBytes Beats',
        views: '98k visualizações',
        duration: '3:15:00',
        time: 'Transmitido há 2 semanas'
      }
    ];

    return (
      <div className="google-videos-grid">
        {videoTemplates.map((vid, i) => (
          <div 
            key={i} 
            className="google-video-card"
            onClick={() => window.open(`https://www.google.com/search?tbm=vid&q=${encodeURIComponent(term)}`, '_blank')}
          >
            <div className="video-thumb-container">
              <span className="video-play-icon">▶</span>
              <span className="video-duration-badge">{vid.duration}</span>
              <div className="video-thumb-placeholder">
                <div className="vid-wave" />
                <span className="vid-badge-term">{term}</span>
              </div>
            </div>
            <div className="video-info-block">
               <h4 className="video-card-title">{vid.title}</h4>
               <span className="video-card-channel">{vid.channel}</span>
               <span className="video-card-views">{vid.views} • {vid.time}</span>
            </div>
          </div>
        ))}
      </div>
    );
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
                placeholder="Pesquise na rede militar Nexus ou na Web criptografada..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                type="button" 
                className="google-real-home-btn"
                onClick={() => {
                  if (searchQuery.trim()) {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`, '_blank');
                  } else {
                    window.open('https://www.google.com', '_blank');
                  }
                }}
                title="Abrir no Google Real"
              >
                🌐
              </button>
            </div>
            <div className="google-search-buttons">
              <button type="submit" className="google-btn">Pesquisa NetGoogle</button>
              <button type="button" onClick={() => navigateTo('shadow-forum.net/puzzles')} className="google-btn">Estou com Sorte</button>
            </div>
          </form>

          {/* Atalhos Rápidos Similares aos do Google */}
          <div className="google-shortcuts-grid">
            <div className="google-shortcut-item" onClick={() => navigateTo('nexus.corp/project-defcon1')}>
              <div className="shortcut-icon icon-nexus">🏦</div>
              <div className="shortcut-label">Nexus Corp</div>
            </div>
            <div className="google-shortcut-item" onClick={() => navigateTo('zeroday.org/aria-project')}>
              <div className="shortcut-icon icon-zeroday">☠️</div>
              <div className="shortcut-label">Zero-Day Wiki</div>
            </div>
            <div className="google-shortcut-item" onClick={() => navigateTo('shadow-forum.net/puzzles')}>
              <div className="shortcut-icon icon-forum">👾</div>
              <div className="shortcut-label">ShadowForum</div>
            </div>
            <div className="google-shortcut-item disabled" title="Apenas atalhos oficiais permitidos">
              <div className="shortcut-icon icon-add">+</div>
              <div className="shortcut-label">Adicionar</div>
            </div>
          </div>

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
      } else if (term.includes('aria') || term.includes('ia') || term.includes('parceira') || term.includes('inteligencia') || term.includes('inteligência')) {
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
      } else if (term.includes('nexus corporation') || term.includes('nexus corp') || term === 'nexus') {
        results = [
          {
            title: 'NEXUS CORPORATION — Website Oficial de Segurança Global',
            url: 'nexus.corp',
            desc: 'Líder global em inteligência de resposta autônoma tática, defesas cibernéticas de mainframe e satélites balísticos de órbita baixa. Fundada em 2031, a corporação é parceira de segurança de nações soberanas mundiais.',
            isNexusCorp: true,
          },
          {
            title: 'ZERO-DAY WIKI — A verdade oculta por trás da Nexus Corp',
            url: 'zeroday.org/aria-project',
            desc: 'Dossiê vazado: Descubra a história oculta sobre a IA militarizada ARIA e as chaves de controle nucleares da Nexus Corp. Informações confidenciais vazadas.',
          }
        ];
      } else {
        const displayTerm = getQueryParam();
        results = [
          {
            title: `ZERO-DAY WIKI — A Verdadeira Natureza de "${displayTerm}"`,
            url: `zeroday.org/wiki/${encodeURIComponent(term)}`,
            desc: `Documentos secretos hackeados revelam a conexão direta da Nexus Corp com pesquisas secretas em ${displayTerm}. A facção Zero-Day investiga o caso.`,
            isGeneric: true,
            query: term,
          },
          {
            title: `SHADOW FORUM — Discussão Ativa: "${displayTerm}" no Mainframe`,
            url: `shadow-forum.net/threads/${encodeURIComponent(term)}`,
            desc: `Membros da resistência debatem os impactos táticos de ${displayTerm} no ecossistema atual de Neo-Detroit. Veja os logs vazados e exploits.`,
            isGeneric: true,
            query: term,
          },
          {
            title: `CyberDefense News — Alerta global sobre atividades com "${displayTerm}"`,
            url: `cyberdefense.corp/news/${encodeURIComponent(term)}`,
            desc: `O comitê militar da Nexus reportou flutuações de tráfego de rede e logs de satélite atípicos correlacionados com ${displayTerm}.`,
            isGeneric: true,
            query: term,
          }
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
              <button type="submit" className="results-search-btn" title="Pesquisar">🔍</button>
              <button 
                type="button" 
                className="google-real-btn" 
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery || getQueryParam())}`, '_blank')}
                title="Abrir pesquisa atual no Google Real"
              >
                🌐 Google Real
              </button>
            </form>
          </div>

          {/* Abas clássicas do Google clicáveis */}
          <div className="results-sub-nav">
            <div 
              className={`sub-nav-item ${searchSubTab === 'all' ? 'active' : ''}`}
              onClick={() => setSearchSubTab('all')}
            >
              🔍 Todas
            </div>
            <div 
              className={`sub-nav-item ${searchSubTab === 'news' ? 'active' : ''}`}
              onClick={() => setSearchSubTab('news')}
            >
              📰 Notícias
            </div>
            <div 
              className={`sub-nav-item ${searchSubTab === 'images' ? 'active' : ''}`}
              onClick={() => setSearchSubTab('images')}
            >
              🖼️ Imagens
            </div>
            <div 
              className={`sub-nav-item ${searchSubTab === 'videos' ? 'active' : ''}`}
              onClick={() => setSearchSubTab('videos')}
            >
              🎥 Vídeos
            </div>
            <div className="sub-nav-item disabled">⚙️ Configurações</div>
          </div>

          {/* Renderização condicional de acordo com a sub-aba selecionada */}
          {searchSubTab === 'all' && (
            <>
              <div className="results-stats">
                Aproximadamente {results.length} resultados (0.04 segundos)
              </div>

              {/* Wrapper Flex/Grid de duas colunas para o Layout Google Premium */}
              <div className="results-body-wrapper">
                <div className="results-list results-main-col">
                  {results.map((res, i) => (
                    <div key={i} className="search-result-item">
                      <span className="result-url" onClick={() => handleResultClick(res)}>
                        {res.url}
                        {res.isGeneric && <span className="external-link-tag">🌐 Abrir na Web Real</span>}
                      </span>
                      <h3 className="result-title" onClick={() => handleResultClick(res)}>
                        {res.title}
                      </h3>
                      <p className="result-desc">{res.desc}</p>
                      
                      {/* Renderização dos sitelinks estruturados premium para Nexus Corporation */}
                      {res.isNexusCorp && (
                        <div className="nexus-sitelinks-container">
                          <div className="sitelink-item" onClick={() => navigateTo('nexus.corp/li-chen')}>
                            <h4>Dra. Li Chen</h4>
                            <p>Ex-Diretora de IA e backdoor do terminal.</p>
                          </div>
                          <div className="sitelink-item" onClick={() => navigateTo('nexus.corp/marcus-webb')}>
                            <h4>Gen. Marcus Webb</h4>
                            <p>Comandante de silos e de chaves táticas.</p>
                          </div>
                          <div className="sitelink-item" onClick={() => navigateTo('nexus.corp/project-defcon1')}>
                            <h4>Projeto DEFCON-1</h4>
                            <p>Defesas e protocolos nucleares autônomos.</p>
                          </div>
                          <div className="sitelink-item" onClick={() => navigateTo('shadow-forum.net/puzzles')}>
                            <h4>Mainframe Central</h4>
                            <p>Exploits de cofre do Banco Federal e hacks.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Coluna do Knowledge Graph (Painel de Informações Laterais) */}
                {renderKnowledgeGraph(term) && (
                  <div className="results-knowledge-col">
                    {renderKnowledgeGraph(term)}
                  </div>
                )}
              </div>
            </>
          )}

          {searchSubTab === 'images' && renderImagesTab(term)}
          {searchSubTab === 'news' && renderNewsTab(term)}
          {searchSubTab === 'videos' && renderVideosTab(term)}
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
                <div className="target-progress-bar"><div className="fill lock" /></div>
                <p>Status: Trava de Satélite Concluída</p>
                <p>Tempo de Impacto Estimado: T+12 min</p>
              </div>
              <div className="target-card">
                <h4>🎯 Setor Central - Neo-Detroit</h4>
                <div className="target-progress-bar"><div className="fill lock" /></div>
                <p>Status: Trava de Satélite Concluída</p>
                <p>Tempo de Impacto Estimado: T+15 min</p>
              </div>
              <div className="target-card">
                <h4>🎯 Setor Oeste - Euro-Berlin</h4>
                <div className="target-progress-bar"><div className="fill lock" /></div>
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
          <div className="scanline-effect" />
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
              <p>Now, ela se conectou à sua máquina hacker (GHOST) como parceira para invadir o mesmo sistema e ajudá-lo a salvar as mesmas cidades que ela se recusou a destruir no passado. Ela é nossa maior aliada.</p>
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
            <span>👾 SHADOW-FORUM.NET — COMUNIDADE CRIPTOGRAFADA</span>
            <span>Usuário Conectado: <strong>GHOST</strong> (Acesso Root)</span>
          </div>
          
          <div className="forum-main-banner">
            <h2>🛠️ NEXUS CORP SYSTEM HACKS — SOLUÇÕES E CHEATS</h2>
            <p>Canal público de compartilhamento de exploits e chaves de evasão obtidas no Mainframe.</p>
          </div>

          <div className="forum-body">
            
            {/* Thread 1: Banco Federal */}
            <div className="forum-post">
              <div className="forum-user-col">
                <div className="forum-avatar font-amber">☣️</div>
                <div className="forum-username">zero_cool</div>
                <div className="forum-badge elite">Elite Hacker</div>
                <div className="forum-posts-count">1.402 posts</div>
              </div>
              <div className="forum-post-content">
                <div className="post-header">
                  <span className="post-title">🏦 Banco Federal (Cofre de Sequência)</span>
                  <span className="post-date">Postado hoje, 04:12</span>
                </div>
                <div className="post-text">
                  <p>O Banco Federal usa uma sequência n(n+1) para criptografia do cofre digital.</p>
                  <p>Termos da sequência: 2, 6, 12, 20, 30... A diferença aumenta de 2 em 2 (+4, +6, +8, +10...).</p>
                  <p>O próximo termo é **30 + 12 = 42**.</p>
                  <p>Insira **42** no teclado digital do cofre para liberar os 50 milhões e obter o bônus.</p>
                </div>
                <div className="post-footer">
                  <div className="post-votes">
                    <button className="vote-btn">▲ Upvote (98)</button>
                    <button className="vote-btn">▼ Downvote</button>
                  </div>
                  <span className="signature">-- "Hack the Planet! O sistema é apenas uma barreira frágil."</span>
                </div>
              </div>
            </div>

            {/* Thread 2: Dra Li Chen Backdoor */}
            <div className="forum-post">
              <div className="forum-user-col">
                <div className="forum-avatar font-cyan">🕸️</div>
                <div className="forum-username">neo_hacker</div>
                <div className="forum-badge admin">Fundador</div>
                <div className="forum-posts-count">3.892 posts</div>
              </div>
              <div className="forum-post-content">
                <div className="post-header">
                  <span className="post-title">💻 Terminal e Backdoor de Administrador Mestre</span>
                  <span className="post-date">Postado ontem, 21:55</span>
                </div>
                <div className="post-text">
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
                <div className="post-footer">
                  <div className="post-votes">
                    <button className="vote-btn">▲ Upvote (142)</button>
                    <button className="vote-btn">▼ Downvote</button>
                  </div>
                  <span className="signature">-- "Conhecimento quer ser livre. Desconfie da Nexus."</span>
                </div>
              </div>
            </div>

            {/* Thread 3: Abortar Mísseis */}
            <div className="forum-post">
              <div className="forum-user-col">
                <div className="forum-avatar font-red">☠️</div>
                <div className="forum-username">GHOST</div>
                <div className="forum-badge you">Você</div>
                <div className="forum-posts-count">24 posts</div>
              </div>
              <div className="forum-post-content">
                <div className="post-header">
                  <span className="post-title">🚀 Abortar Mísseis DEFCON-1</span>
                  <span className="post-date">Postado 3 dias atrás</span>
                </div>
                <div className="post-text">
                  <p>Para abortar o disparo e vencer o jogo, você precisará digitar os dois códigos secretos de confirmação no painel DEFCON-1:</p>
                  <ul>
                    <li><strong>Código Alpha:</strong> <span className="forum-highlight">742839</span> (localizado nos e-mails confidenciais)</li>
                    <li><strong>Código Beta:</strong> <span className="forum-highlight">470511</span> (localizado no banco de dados / e-mails de backup)</li>
                  </ul>
                  <p>Digite os códigos e clique no botão verde grande **ABORTAR LANÇAMENTO**. Isso garantirá a vitória total e salvará as cidades!</p>
                </div>
                <div className="post-footer">
                  <div className="post-votes">
                    <button className="vote-btn">▲ Upvote (256)</button>
                    <button className="vote-btn">▼ Downvote</button>
                  </div>
                  <span className="signature">-- "Infiltrando silos, salvando o amanhã. System Admin do GHOST."</span>
                </div>
              </div>
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
              <div className="tab-trapezoid-bg" />
              <span className="tab-icon">🌐</span>
              <span className="tab-title">{t.title}</span>
              {tabs.length > 1 && (
                <button className="tab-close-btn" onClick={(e) => closeTab(t.id, e)}>✕</button>
              )}
            </div>
          ))}
        </div>
        <button className="new-tab-btn" onClick={openNewTab} title="Nova Aba">+</button>
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
          <div className="url-security-badge">
            <span className="url-secure-lock">🔒</span>
            <span className="url-secure-text">Seguro</span>
          </div>
          <span className="url-protocol">https://</span>
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
