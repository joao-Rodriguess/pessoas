import { useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function Database() {
  const { dispatch } = useGame();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const TABLES = {
    users: {
      columns: ['ID', 'USERNAME', 'PASSWORD', 'ROLE'],
      rows: [
        ['1', 'admin', 'ALPHA1983', 'ADMIN'],
        ['2', 'root', 'missile24', 'SUPERADMIN'],
        ['3', 'webb', 'general!42', 'COMMANDER'],
        ['4', 'chen', 'li_chen_99', 'ENGINEER'],
        ['5', 'ghost', '???', 'INTRUDER'],
      ],
    },
    missiles: {
      columns: ['SILO', 'LOCATION', 'STATUS', 'CODE'],
      rows: [
        ['SILO-01', 'Montana', 'ARMED', 'ALPHA-742839'],
        ['SILO-02', 'Wyoming', 'ARMED', 'BETA-470511'],
        ['SILO-03', 'Colorado', 'ARMED', 'GAMMA-AUTO'],
      ],
    },
    logs: {
      columns: ['TIMESTAMP', 'EVENT', 'USER', 'IP'],
      rows: [
        ['2047-03-15 14:22', 'LOGIN', 'admin', '10.0.0.1'],
        ['2047-03-15 14:35', 'DEFCON ACCESS', 'webb', '10.0.3.1'],
        ['2047-03-15 15:01', 'TRACE DETECTED', 'ghost', '10.0.13.37'],
        ['2047-03-15 15:15', 'FIREWALL ALERT', 'system', '10.0.0.1'],
      ],
    },
  };

  const runQuery = () => {
    const q = query.toLowerCase().trim();
    dispatch({ type: 'ADD_SCORE', points: 30 });

    if (q.includes('select') && q.includes('users')) {
      setResult(TABLES.users);
    } else if (q.includes('select') && q.includes('missile')) {
      setResult(TABLES.missiles);
    } else if (q.includes('select') && q.includes('log')) {
      setResult(TABLES.logs);
    } else if (q.includes('show tables') || q.includes('show databases')) {
      setResult({
        columns: ['TABLE_NAME', 'ROWS', 'ENGINE'],
        rows: [
          ['users', '5', 'InnoDB'],
          ['missiles', '3', 'InnoDB'],
          ['logs', '4', 'InnoDB'],
        ],
      });
    } else if (q.includes('drop') || q.includes('delete') || q.includes('truncate')) {
      setResult({
        columns: ['ERROR'],
        rows: [['⚠️ ACESSO NEGADO — Operação destrutiva bloqueada pelo firewall']],
      });
    } else if (q.includes('select')) {
      setResult(TABLES.users);
    } else {
      setResult({
        columns: ['ERROR'],
        rows: [['Comando inválido. Use: SELECT * FROM users / missiles / logs']],
      });
    }
  };

  return (
    <div style={{ padding: 14 }}>
      <div style={{ color: 'var(--amber-400)', marginBottom: 8, fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
        SQL QUERY:
      </div>
      <input
        className="db-query-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && runQuery()}
        placeholder="SELECT * FROM users"
        spellCheck={false}
      />
      <button className="db-execute-btn" onClick={runQuery}>
        ▶ EXECUTAR
      </button>

      <div style={{ marginBottom: 8, color: 'var(--text-muted)', fontSize: 10 }}>
        Tabelas: users, missiles, logs | Comandos: SELECT, SHOW TABLES
      </div>

      <div className="db-result">
        {result ? (
          <table className="db-table">
            <thead>
              <tr>
                {result.columns.map((col, i) => (
                  <th key={i}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Aguardando query...</span>
        )}
      </div>
    </div>
  );
}
