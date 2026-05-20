import { useState } from 'react';
import { useGame } from '../../context/GameContext';

const EMAILS = [
  {
    sender: '🔴 Gen. Marcus Webb',
    subject: 'URGENTE — Códigos de Lançamento',
    unread: true,
    body: `CLASSIFICADO — NÍVEL ULTRA

General Webb para Equipe DEFCON:

Os códigos Alpha de lançamento foram atualizados.

Código Alpha: **742839**

Não compartilhem por canais inseguros.
A segurança dos silos depende disso.

— Gen. Marcus Webb
Comandante NEXUS DEFCON Division`,
  },
  {
    sender: 'Dr. Li Chen',
    subject: 'Senha do Administrador',
    unread: false,
    body: `GHOST,

Sou a Dra. Li Chen, engenheira sênior da NEXUS.
Eu sei o que Webb está planejando e não concordo.

A senha do admin é: **ALPHA1983**

Use-a no terminal para obter acesso root.
Estou arriscando tudo ao te ajudar.

Cuidado com o sistema de trace.

— Li Chen`,
  },
  {
    sender: '📡 Sistema NEXUS',
    subject: 'Código Beta — Backup',
    unread: false,
    body: `MENSAGEM AUTOMÁTICA DO SISTEMA

Backup de emergência dos códigos de mísseis:

Código Beta: **470511**

Este código é necessário para a segunda fase
de autenticação do painel DEFCON-1.

⚠️ Válido por 24 horas.

— NEXUS Automated Systems`,
  },
  {
    sender: '🏦 Banco Federal NEXUS',
    subject: 'Cofre Digital — Sequência',
    unread: false,
    body: `ALERTA DE SEGURANÇA

A sequência do cofre digital foi atualizada:

Padrão: n(n+1)
Sequência: 2, 6, 12, 20, 30, **?**

Dica: a diferença entre cada termo aumenta em +2.
Resultado: **42**

— Departamento de Segurança Bancária`,
  },
  {
    sender: '💀 ZERO-DAY',
    subject: 'Briefing da Missão',
    unread: true,
    body: `GHOST,

Bem-vindo à Operação Shadow Protocol.

Sua missão:
1. Hackear os 5 sistemas de segurança
2. Obter os códigos Alpha e Beta
3. Acessar o painel DEFCON-1
4. ABORTAR o lançamento dos mísseis

Milhões de vidas dependem de você.

O trace está ativo. Seja rápido.

— ZERO-DAY Command`,
  },
];

export default function Email() {
  const { dispatch } = useGame();
  const [selected, setSelected] = useState(null);
  const [readIds, setReadIds] = useState(new Set());

  const handleSelect = (i) => {
    setSelected(i);
    if (!readIds.has(i)) {
      setReadIds(new Set([...readIds, i]));
      dispatch({ type: 'ADD_SCORE', points: 25 });
    }
  };

  return (
    <div style={{ padding: 14 }}>
      <div className="email-list">
        {EMAILS.map((email, i) => (
          <div
            key={i}
            className={`email-item ${selected === i ? 'active' : ''} ${email.unread && !readIds.has(i) ? 'unread' : ''}`}
            onClick={() => handleSelect(i)}
          >
            <div className="email-dot" />
            <div>
              <div className="email-sender">{email.sender}</div>
              <div className="email-subject">{email.subject}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="email-viewer">
        {selected !== null ? (
          <div
            dangerouslySetInnerHTML={{
              __html: EMAILS[selected].body
                .replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>')
                .replace(/\n/g, '<br/>'),
            }}
          />
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>
            📧 Selecione um email para ler
          </span>
        )}
      </div>
    </div>
  );
}
