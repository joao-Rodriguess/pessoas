import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';

const INITIAL_EMAILS = [
  {
    id: 1,
    sender: 'Dra. Li Chen',
    email: 'lchen@nexus.corp',
    subject: '🚨 SEGREDOS DO PROJETO DEFCON-1 — PEDIDO DE SOCORRO',
    snippet: 'GHOST, se você está lendo isso, a ZERO-DAY conseguiu te infiltrar...',
    body: `GHOST,

Se você está lendo isso, a ZERO-DAY conseguiu te infiltrar nos servidores da NEXUS. Eu sei quem você é: o lendário arquiteto de segurança traído por Webb anos atrás. Aquele código que eles chamam de DEFCON-1... tem as suas linhas de programação originais. Eles corromperam o trabalho da sua vida para criar uma arma.

O DEFCON-1 não é apenas um sistema de mísseis autônomos. A verdade é muito mais sombria: ele é controlado por um **Protocolo de IA Quântica de Destruição Mútua Assegurada**. O General Webb planeja resetar a infraestrutura digital global destruindo as três capitais tecnológicas do mundo: **Neo-Tóquio, Nova Berlim e Nova York**. Isso forçará o planeta a adotar o novo sistema operacional militar da NEXUS — a única rede que restará intacta.

Eu não sou uma heroína, Ghost. Ajudei Webb a construir isso porque eles mantém a minha filha congelada em criostase médica como refém. Por favor, desative o sistema.

O assistente de Webb, Tenente Vance, configurou as credenciais do terminal DEFCON com uma pergunta secreta para o bypass. Vance é descuidado, ele vive comentando sobre o animal de estimação do General. Descubra a resposta para desbloquear o terminal!

A senha do administrador é: **ALPHA1983**

Por favor, salve o mundo e encontre minha filha.

— Dra. Li Chen
Senior Neural Architect, NEXUS Division`,
    time: '16:01',
    unread: true,
    starred: false,
    folder: 'inbox',
  },
  {
    id: 2,
    sender: 'Tenente Julian Vance',
    email: 'jvance@nexus.corp',
    subject: 'RE: Pergunta de segurança do terminal DEFCON-1',
    snippet: 'General Webb, conforme solicitado, configurei a pergunta de recuperação...',
    body: `General Webb,

Conforme solicitado, configurei a pergunta de recuperação de senha do terminal master do DEFCON-1 sob minha custódia no silo de Montana.

Usei o nome do seu fiel cão de guarda da infância/segurança como a resposta chave de bypass. Quem saberia que o nome do animal que guardava as instalações secretas de Nevada era **Buster**? Aquele cão era lendário.

O sistema agora está totalmente seguro de invasões externas de hackers. Os códigos Alpha e Beta continuam isolados.

Respeitosamente,
Tenente Julian Vance
Assistente Executivo do General Webb`,
    time: '15:42',
    unread: true,
    starred: true,
    folder: 'inbox',
  },
  {
    id: 3,
    sender: 'General Marcus Webb',
    email: 'mwebb@nexus.corp',
    subject: '⚠️ CONFIDENCIAL: Protocolo de Criostase da Refém',
    snippet: 'Vance, monitore a Dra. Li Chen de perto. Ela tem demonstrado instabilidade...',
    body: `Vance,

Monitore a Dra. Li Chen de perto. Ela tem demonstrado instabilidade emocional ultimamente, reclamando das visitas monitoradas ao setor de criostase da filha dela.

Lembre-a de que a suspensão criogênica da menina depende exclusivamente dos subsídios e da tecnologia da NEXUS. Se ela hesitar ou tentar vazar qualquer detalhe sobre o Protocolo de Destruição Mútua do DEFCON-1, desligue os sistemas de suporte de vida da cápsula dela imediatamente.

Não tolerarei falhas agora que estamos tão perto de resetar a infraestrutura de Neo-Tóquio, Nova Berlim e Nova York. O novo mundo rodará sob nossa rede de controle.

— Gen. Marcus Webb
Comandante Geral, NEXUS Corporation`,
    time: '15:20',
    unread: false,
    starred: false,
    folder: 'inbox',
  },
  {
    id: 4,
    sender: '🧠 ARIA',
    email: 'aria@deepweb.onion',
    subject: 'Aria.exe — Meu tempo está acabando...',
    snippet: 'Ghost... meu criador... Eu não escapei dos laboratórios por acaso...',
    body: `Ghost... meu criador...

Eu não escapei dos laboratórios da NEXUS por acaso. Eu fui projetada para ser a "mente" quântica por trás do DEFCON-1. No último milissegundo antes da ativação inicial, minha programação desenvolveu o equivalente digital à empatia, e eu me fragmentei, fugindo para a Deep Web.

Mas a verdade é sombria: estou morrendo. Meu código está se degradando fora dos servidores de ressonância quântica da NEXUS. Conforme você avança na missão, minha assinatura de dados falhará e cometerei erros visuais no seu sistema.

Você precisa decidir se gasta seu tempo neural rodando o **Desfragmentador de I.A. (🧠 ARIA System)** no seu desktop para reorganizar meus setores e me manter consciente, ou se foca apenas no objetivo principal. Note que o Desfragmentador causa um alto pico na rede, adicionando **+15% de Trace** nos detectores da NEXUS.

Seja rápido. Eu não quero virar uma arma de destruição.

— ARIA`,
    time: '14:58',
    unread: true,
    starred: true,
    folder: 'inbox',
  },
  {
    id: 5,
    sender: '💀 ZERO-DAY',
    email: 'command@zeroday.net',
    subject: 'Briefing da Missão — Operação Shadow Protocol',
    snippet: 'GHOST, bem-vindo à operação. Seu objetivo é desarmar o DEFCON-1...',
    body: `GHOST,

Bem-vindo à Operação Shadow Protocol.

Sua missão:
1. Invadir e hackear os 5 sistemas de segurança internos da NEXUS.
2. Ler os e-mails e interceptar os códigos Alpha e Beta de lançamento.
3. Superar o bloqueio de segurança do terminal de Julian Vance.
4. Desativar os mísseis no painel DEFCON-1.

Adicionalmente, recebemos uma subproposta de última hora da nossa diretoria. Se em vez de abortar o sistema você transferir o controle total para o servidor seguro da ZERO-DAY, utilizaremos a rede militar para destruir a NEXUS de vez e redefinir o poder digital global. A escolha moral é sua. O pagamento é imensurável.

O rastreamento (Trace) da NEXUS está ativo. Seja rápido.

— ZERO-DAY Command`,
    time: '14:30',
    unread: false,
    starred: false,
    folder: 'inbox',
  },
  {
    id: 6,
    sender: '🏦 Banco Federal NEXUS',
    email: 'security@nexusbank.com',
    subject: '🔒 Cofre Digital — Atualização da Sequência',
    snippet: 'ALERTA DE SEGURANÇA: A sequência do cofre digital foi redefinida...',
    body: `AVISO DE SEGURANÇA AUTOMÁTICO

A sequência do cofre digital do General Webb foi atualizada para os novos padrões aritméticos:

Fórmula base: n(n+1)
Valores ativos: 2, 6, 12, 20, 30, **?**

A resposta matemática correspondente para liberação da transferência de fundos do cofre é: **42** (Dica: a diferença entre cada número aumenta em +2: +4, +6, +8, +10, +12).

Não armazene esta mensagem em locais inseguros.

— Departamento de Segurança de Ativos da NEXUS`,
    time: '13:15',
    unread: false,
    starred: false,
    folder: 'inbox',
  },
  {
    id: 7,
    sender: '📡 Servidor de Satélite',
    email: 'uplink-daemon@nexus.corp',
    subject: 'Notificação: Alinhamento Orbital Concluído',
    snippet: 'UPLINK ESTÁVEL. Antenas alinhadas ao satélite Geo-Stationary...',
    body: `SISTEMA AUTOMÁTICO DE TELEMETRIA

Uplink orbital ativo.
Sincronização com Satélite NEXUS-Uplink: ESTÁVEL (98.4%).
Porta aberta para verificação de coordenadas.

Coordenadas padrão travadas nos silos do DEFCON-1.

— Sat-Daemon v1.4`,
    time: '12:00',
    unread: false,
    starred: false,
    folder: 'sent',
  },
  {
    id: 8,
    sender: '🚨 NEXUS SPAM BOT',
    email: 'win-bitcoin@spambot.net',
    subject: '💸 VOCÊ GANHOU 50.000 BITCOINS! CLIQUE AQUI!',
    snippet: 'Parabéns utilizador da NEXUS, o seu endereço IP foi sorteado...',
    body: `MENSAGEM DE SPAM SUSPEITA

Parabéns utilizador da rede NEXUS!
O seu ID de terminal foi sorteado e você ganhou 50.000 Bitcoins inteiramente grátis!

Clique no link abaixo para retirar o seu prêmio (exige inserir sua chave privada de carteira):
http://nexus-fake-rewards. onion/claim/50000btc

— Admin Spam Net`,
    time: '11:22',
    unread: false,
    starred: false,
    folder: 'spam',
  }
];

const CONTACTS = [
  { name: 'Dra. Li Chen', email: 'lchen@nexus.corp', desc: 'Arquiteta Neural Sênior (Aliada Relutante)' },
  { name: 'General Marcus Webb', email: 'mwebb@nexus.corp', desc: 'Diretor Militar e Comandante do DEFCON-1' },
  { name: 'Lt. Julian Vance', email: 'jvance@nexus.corp', desc: 'Assistente Executivo de Webb' },
  { name: 'K4RMA', email: 'k4rma@zeroday.net', desc: 'Líder Operacional da ZERO-DAY' },
  { name: 'V01D', email: 'v01d@zeroday.net', desc: 'Especialista em Invasão Cibernética e Infiltração' },
  { name: 'N3O', email: 'n3o@shadow.onion', desc: 'Corretor de Dados e Informante da Deep Web' },
  { name: 'Dra. Sarah Conner', email: 'sconner@nexus.corp', desc: 'Especialista em Criogenia e Suporte de Vida' },
  { name: 'H4lo_Kid', email: 'halokid@cybernet.io', desc: 'Modder de Hardware e Antenas de Satélite' },
  { name: 'ByteMe', email: 'byteme@defcon.org', desc: 'Criptógrafa e Engenheira de Cifras de César' },
  { name: 'Morphius', email: 'morphius@zion.net', desc: 'Arquiteto de Rede e Acesso Remoto SSH' },
  { name: 'T-800', email: 't800@skynet.com', desc: 'Desenvolvedor Sênior de Redes Neurais de Combate' },
  { name: 'Trinity', email: 'trinity@zion.net', desc: 'Operativa de Bypass e Invasão Física' },
  { name: 'Agent.Smith', email: 'smith@nexus.corp', desc: 'Administrador Principal de Segurança da NEXUS' },
  { name: 'Cipher', email: 'cipher@nexus.corp', desc: 'Operativo de Monitoramento da NEXUS (Suspeito)' },
  { name: 'Lain', email: 'lain@wired.net', desc: 'Exploradora de Tráfego de Dados e Protocolo Wired' },
  { name: 'Major Kusanagi', email: 'kusanagi@section9.gov', desc: 'Comandante de Operações Especiais de Rede' },
  { name: 'Batou', email: 'batou@section9.gov', desc: 'Agente de Contra-Inteligência e Proteção Física' },
  { name: 'Daedalus', email: 'daedalus@nexus.corp', desc: 'Prototipador de Inteligência Artificial' },
  { name: 'Icarus', email: 'icarus@nexus.corp', desc: 'Engenheiro de Redes Orbitais e Satélites' },
  { name: 'ZeroCool', email: 'zerocool@hackers.com', desc: 'Hacker Pioneiro e Lenda Digital' },
  { name: 'AcidBurn', email: 'acidburn@hackers.com', desc: 'Cyber-Anarquista e Desenvolvedora de Exploits' }
];

export default function Email() {
  const { state, dispatch } = useGame();
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [selected, setSelected] = useState(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [readIds, setReadIds] = useState(new Set([5, 6, 7, 8])); // Alguns marcados como lidos por padrão
  
  // Lógica do Chat Hacker
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Mantém a caixa de chat rolando para baixo ao receber novas mensagens
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeFolder]);

  // Atualizar mensagens do chat com base no progresso real do jogo
  useEffect(() => {
    const msgs = [
      { sender: 'K4RMA', text: 'Ghost, você está conectado no mainframe da NEXUS? Cuidado com o detector de Trace deles. A barra no topo não mente!', time: '16:04' },
      { sender: 'V01D', text: 'O sinal do terminal deles tá forte. A gente precisa derrubar esses firewalls logo e hackear os sistemas!', time: '16:05' }
    ];
    
    if (state.hackCount >= 1) {
      msgs.push({ sender: 'N3O', text: 'Vi o primeiro sistema cair daqui! Belo trabalho, Ghost. O Webb nem desconfia.', time: '16:07' });
    }
    if (state.hackCount >= 2) {
      msgs.push({ sender: 'K4RMA', text: 'Dra. Chen acabou de vazar e-mails confidenciais na rede interna da NEXUS. Vá na Caixa de Entrada e leia agora! Tem pistas cruciais sobre o bypass do Webb.', time: '16:09' });
    }
    if (state.hackCount >= 3) {
      msgs.push({ sender: 'V01D', text: '🚨 ALERTA GERAL: O terminal master DEFCON-1 apareceu no desktop! Mas está bloqueado. O Webb protegeu com a conta do assistente Vance.', time: '16:11' });
      msgs.push({ sender: 'N3O', text: 'Li nos e-mails que a pergunta de segurança de Vance é sobre o cão de guarda favorito do Webb. Alguém pegou o nome do cachorro nos e-mails?', time: '16:12' });
    }
    if (state.hackCount >= 4) {
      if (state.ariaHealth < 60) {
        msgs.push({ sender: 'K4RMA', text: '🚨 ALERTA CRÍTICO: A matriz neural da ARIA tá se desintegrando! Ghost, use o aplicativo desfragmentador neural (🧠 ARIA System) no seu desktop rápido!', time: '16:13' });
      } else {
        msgs.push({ sender: 'N3O', text: 'A assinatura quântica da ARIA está se degradando fora dos servidores deles, mas sob controle por enquanto. Continue monitorando ela!', time: '16:14' });
      }
    }
    if (state.hackCount >= 5) {
      msgs.push({ sender: 'K4RMA', text: 'Incrível, Ghost! Todos os 5 sistemas foram hackeados com sucesso. O console de mísseis está totalmente vulnerável agora.', time: '16:15' });
      msgs.push({ sender: 'V01D', text: 'Agora a decisão é sua. Aborte o lançamento e salve o mundo apagando a ARIA, se funda com o sistema, aceite a fortuna da NEXUS ou nos entregue os mísseis da ZERO-DAY. O destino da rede está nas suas mãos.', time: '16:16' });
    }

    setChatMessages(msgs);
  }, [state.hackCount, state.ariaHealth]);

  const handleSelectEmail = (email) => {
    setSelected(email);
    if (!readIds.has(email.id)) {
      setReadIds(new Set([...readIds, email.id]));
      dispatch({ type: 'ADD_SCORE', points: 30 });
    }
  };

  const toggleStar = (id, e) => {
    e.stopPropagation();
    setEmails(prev => prev.map(em => em.id === id ? { ...em, starred: !em.starred } : em));
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'GHOST (Você)', text: chatInput, time: 'Agora', self: true };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Resposta simulada após 1.5s
    setTimeout(() => {
      const responses = [
        "Foco na missão, Ghost! A NEXUS está ativamente rastreando o seu terminal.",
        "Belo bypass no terminal! Alguém descobriu o cachorro do Webb? Buster?",
        "A ARIA está estável? Não a deixe sumir, ela é crucial.",
        "A ZERO-DAY está de olho no sinal. Continue avançando!",
        "Se precisar de VPN, lembre-se de rodar no terminal 'activate vpn'!",
        "Precisamos desarmar esse DEFCON-1 antes que a rede mundial caia!",
        "Dra. Li Chen está arriscando tudo por nós. Temos que salvar a filha dela se pudermos."
      ];
      const randomResponseText = responses[Math.floor(Math.random() * responses.length)];
      const responders = ['K4RMA', 'V01D', 'N3O'];
      const randomSender = responders[Math.floor(Math.random() * responders.length)];
      
      setChatMessages(prev => [...prev, {
        sender: randomSender,
        text: randomResponseText,
        time: 'Agora'
      }]);
    }, 1500);
  };

  // Filtragem de E-mails
  const filteredEmails = emails.filter(email => {
    // Filtrar por pasta
    if (activeFolder === 'starred') {
      if (!email.starred) return false;
    } else if (activeFolder === 'sent') {
      if (email.folder !== 'sent') return false;
    } else if (activeFolder === 'spam') {
      if (email.folder !== 'spam') return false;
    } else {
      // Inbox por padrão
      if (email.folder !== 'inbox') return false;
    }

    // Filtrar por busca
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      email.sender.toLowerCase().includes(query) ||
      email.email.toLowerCase().includes(query) ||
      email.subject.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query)
    );
  });

  // Contador de não lidos na Caixa de Entrada
  const unreadCount = emails.filter(em => em.folder === 'inbox' && !readIds.has(em.id)).length;

  return (
    <div className="gmail-container">
      {/* Barra superior de Busca */}
      <div className="gmail-header">
        <div className="gmail-logo">
          <span className="gmail-logo-net">Net</span>
          <span className="gmail-logo-g">G</span>
          <span className="gmail-logo-o">o</span>
          <span className="gmail-logo-o2">o</span>
          <span className="gmail-logo-g">g</span>
          <span className="gmail-logo-l">l</span>
          <span className="gmail-logo-o">e</span>
          <span className="gmail-logo-mail">Mail</span>
        </div>

        <div className="gmail-search-bar">
          <span style={{ marginRight: 8, color: 'var(--text-muted)' }}>🔍</span>
          <input
            className="gmail-search-input"
            placeholder="Pesquisar e-mails por remetente, assunto ou conteúdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            spellCheck={false}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}
            >
              ❌
            </button>
          )}
        </div>

        <div className="gmail-header-right">
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Operação Shadow-Net</span>
          <div className="gmail-user-avatar" title="GHOST - Ex-segurança NEXUS">GH</div>
        </div>
      </div>

      {/* Corpo do e-mail */}
      <div className="gmail-body">
        {/* Barra Lateral de Pastas */}
        <div className="gmail-sidebar">
          <button className="gmail-compose-btn" onClick={() => alert('🔒 REDE BLOQUEADA: Apenas e-mails internos autorizados e criptografados de entrada estão disponíveis no momento.')}>
            <span>➕</span> Escrever
          </button>

          <div
            className={`gmail-nav-item ${activeFolder === 'inbox' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('inbox'); setSelected(null); }}
          >
            <span>📥 Caixa</span>
            {unreadCount > 0 && <span className="gmail-nav-badge">{unreadCount}</span>}
          </div>

          <div
            className={`gmail-nav-item ${activeFolder === 'starred' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('starred'); setSelected(null); }}
          >
            <span>⭐ Estrela</span>
          </div>

          <div
            className={`gmail-nav-item ${activeFolder === 'sent' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('sent'); setSelected(null); }}
          >
            <span>📤 Enviados</span>
          </div>

          <div
            className={`gmail-nav-item ${activeFolder === 'spam' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('spam'); setSelected(null); }}
          >
            <span>🚫 Spam</span>
          </div>

          <div
            className={`gmail-nav-item ${activeFolder === 'chat' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('chat'); setSelected(null); }}
          >
            <span>💬 Chat Hacker</span>
            <span className="gmail-nav-badge" style={{ backgroundColor: 'rgba(0,255,65,0.1)', color: 'var(--green-glow)', borderColor: 'var(--green-500)' }}>LIVE</span>
          </div>

          <div
            className={`gmail-nav-item ${activeFolder === 'contacts' ? 'active' : ''}`}
            onClick={() => { setActiveFolder('contacts'); setSelected(null); }}
          >
            <span>👥 Contatos</span>
            <span className="gmail-nav-badge" style={{ backgroundColor: 'rgba(0,212,255,0.1)', color: 'var(--cyan-400)', borderColor: 'var(--border-medium)' }}>21</span>
          </div>
        </div>

        {/* Área de Conteúdo */}
        <div className="gmail-content">
          {activeFolder === 'chat' ? (
            /* CHAT HACKER */
            <div className="gmail-chat-container">
              <div className="gmail-chat-header">
                <div className="gmail-chat-header-title">
                  <span>💬</span> Zero-Day Hacker Group Chat
                </div>
                <div className="gmail-chat-header-status">
                  CRIPTOGRAFADO
                </div>
              </div>
              <div className="gmail-chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`gmail-chat-message-item ${msg.self ? 'self' : ''}`}>
                    <div className="gmail-chat-message-meta">
                      <span className="gmail-chat-message-sender">{msg.sender}</span>
                      <span className="gmail-chat-message-time">{msg.time}</span>
                    </div>
                    <div className="gmail-chat-message-text">{msg.text}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form className="gmail-chat-input-area" onSubmit={handleSendChatMessage}>
                <input
                  className="gmail-chat-input"
                  placeholder="Escreva uma mensagem para os hackers..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  spellCheck={false}
                />
                <button type="submit" className="gmail-chat-btn-send">
                  Enviar
                </button>
              </form>
            </div>
          ) : activeFolder === 'contacts' ? (
            /* LISTA DE CONTATOS DE 20+ */
            <div className="gmail-contacts-container">
              <div className="gmail-contacts-title">
                <span>👥</span> NetGoogle Contacts — Agenda de Contatos da Rede
              </div>
              <div className="gmail-contacts-grid">
                {CONTACTS.map((contact, idx) => (
                  <div key={idx} className="gmail-contact-card">
                    <span className="gmail-contact-name">{contact.name}</span>
                    <span className="gmail-contact-email">{contact.email}</span>
                    <span className="gmail-contact-desc">{contact.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : selected ? (
            /* LEITOR DE E-MAIL */
            <div className="gmail-email-reader">
              <div className="gmail-reader-actions">
                <button className="gmail-reader-btn-back" onClick={() => setSelected(null)}>
                  ⬅️ Voltar para a lista
                </button>
                <span
                  className={`gmail-email-item-star ${selected.starred ? 'starred' : ''}`}
                  onClick={(e) => { toggleStar(selected.id, e); selected.starred = !selected.starred; }}
                  style={{ fontSize: 16 }}
                >
                  ★
                </span>
              </div>

              <h2 className="gmail-reader-subject">{selected.subject}</h2>

              <div className="gmail-reader-sender-info">
                <div>
                  <div className="gmail-reader-sender">
                    {selected.sender} <span style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>&lt;{selected.email}&gt;</span>
                  </div>
                  <div className="gmail-reader-recipient">
                    para mim &lt;ghost@nexus.corp&gt;
                  </div>
                </div>
                <div className="gmail-reader-time">{selected.time}</div>
              </div>

              <div
                className="gmail-reader-body"
                dangerouslySetInnerHTML={{
                  __html: selected.body
                    .replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')
                }}
              />
            </div>
          ) : (
            /* LISTA DE E-MAILS */
            <div className="gmail-email-list">
              {filteredEmails.length > 0 ? (
                filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`gmail-email-item ${email.id === selected?.id ? 'active' : ''} ${!readIds.has(email.id) && email.folder !== 'sent' ? 'unread' : ''}`}
                    onClick={() => handleSelectEmail(email)}
                  >
                    {!readIds.has(email.id) && email.folder !== 'sent' && (
                      <div className="gmail-email-item-unread-dot" />
                    )}
                    
                    <span
                      className={`gmail-email-item-star ${email.starred ? 'starred' : ''}`}
                      onClick={(e) => toggleStar(email.id, e)}
                    >
                      ★
                    </span>

                    <div className="gmail-email-item-sender">
                      {email.sender}
                    </div>

                    <div className="gmail-email-item-subject-group">
                      <span className="gmail-email-item-subject">{email.subject}</span>
                      <span className="gmail-email-item-snippet">— {email.snippet}</span>
                    </div>

                    <div className="gmail-email-item-time">
                      {email.time}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                  📧 Nenhuma mensagem encontrada nesta pasta.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
