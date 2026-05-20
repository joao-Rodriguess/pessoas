import { useState } from 'react';

export default function Notepad() {
  const [text, setText] = useState(
    'ANOTAÇÕES DE MISSÃO — GHOST\n' +
    '═══════════════════════════\n\n' +
    'Use este bloco para anotar códigos e pistas:\n\n' +
    '• Código Alpha: ______\n' +
    '• Código Beta: ______\n' +
    '• Senha admin: ______\n' +
    '• Sequência cofre: ______\n' +
    '• IP da rede: ______\n' +
    '• Cifra César: ______\n\n' +
    'DICAS:\n' +
    '- Leia os emails com atenção\n' +
    '- Explore os arquivos\n' +
    '- Use o terminal para mais informações\n'
  );

  return (
    <textarea
      className="notepad-textarea"
      value={text}
      onChange={(e) => setText(e.target.value)}
      spellCheck={false}
      placeholder="Anote aqui..."
    />
  );
}
