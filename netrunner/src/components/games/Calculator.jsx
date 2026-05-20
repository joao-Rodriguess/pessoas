import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const press = (val) => {
    if (display === '0' && val !== '.') {
      setDisplay(val);
      setExpression(val);
    } else {
      setDisplay(display + val);
      setExpression(expression + val);
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const calculate = () => {
    try {
      // Safe eval replacement
      const sanitized = expression.replace(/[^0-9+\-*/.()]/g, '');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      setDisplay(String(result));
      setExpression('');
    } catch {
      setDisplay('Err');
      setExpression('');
    }
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', 'C', '=', '+',
  ];

  return (
    <div style={{ padding: 14 }}>
      <input
        className="calc-display"
        value={display}
        readOnly
      />
      <div className="calc-grid">
        {buttons.map((btn) => (
          <button
            key={btn}
            className={`calc-btn ${['+', '-', '*', '/', '='].includes(btn) ? 'operator' : ''}`}
            onClick={() => {
              if (btn === 'C') clear();
              else if (btn === '=') calculate();
              else press(btn);
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
