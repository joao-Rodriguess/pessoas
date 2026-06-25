import { useRef, useCallback, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

export default function Window({ id, title, icon, children, width = 550, height = 400 }) {
  const { state, dispatch } = useGame();
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0 });

  const isOpen = state.openWindows.includes(id);
  const isFocused = state.focusedWindow === id;
  const isMinimized = state.minimizedWindows?.includes(id) || false;

  // Random initial position
  const posRef = useRef({
    x: 100 + Math.random() * 200,
    y: 40 + Math.random() * 100,
  });

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-btn')) return;
    if (isMaximized) return; // Não permite arrastar se maximizada
    dispatch({ type: 'FOCUS_WINDOW', id });
    dragRef.current = {
      dragging: true,
      startX: e.clientX - posRef.current.x,
      startY: e.clientY - posRef.current.y,
    };

    const handleMouseMove = (e) => {
      if (!dragRef.current.dragging) return;
      posRef.current.x = e.clientX - dragRef.current.startX;
      posRef.current.y = Math.max(0, e.clientY - dragRef.current.startY);
      if (windowRef.current) {
        windowRef.current.style.left = posRef.current.x + 'px';
        windowRef.current.style.top = posRef.current.y + 'px';
      }
    };

    const handleMouseUp = () => {
      dragRef.current.dragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dispatch, id, isMaximized]);

  const handleFocus = useCallback(() => {
    dispatch({ type: 'FOCUS_WINDOW', id });
  }, [dispatch, id]);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_WINDOW', id });
  }, [dispatch, id]);

  const handleMinimize = useCallback(() => {
    dispatch({ type: 'MINIMIZE_WINDOW', id });
  }, [dispatch, id]);

  const handleToggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
  }, []);

  if (!isOpen) return null;

  const zIndex = isFocused ? 100 : state.openWindows.indexOf(id) + 10;

  return (
    <div
      ref={windowRef}
      className={`window ${isFocused ? 'focused' : ''} ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}
      style={{
        width: isMaximized ? '100vw' : width,
        height: isMaximized ? 'calc(100vh - 48px)' : height,
        left: isMaximized ? 0 : posRef.current.x,
        top: isMaximized ? 0 : posRef.current.y,
        zIndex,
        animation: isMinimized ? 'none' : 'winOpen 0.25s var(--ease-out-expo)',
        display: isMinimized ? 'none' : 'flex',
      }}
      onMouseDown={handleFocus}
    >
      <style>{`
        @keyframes winOpen {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span className="window-title">
          <span className="window-title-icon">{icon}</span>
          {title}
        </span>
        <div className="window-controls">
          <button className="window-btn window-btn-minimize" title="Minimizar" onClick={handleMinimize}>
            —
          </button>
          <button className="window-btn window-btn-maximize" title={isMaximized ? 'Restaurar' : 'Maximizar'} onClick={handleToggleMaximize}>
            {isMaximized ? '🗗' : '🗖'}
          </button>
          <button className="window-btn window-btn-close" title="Fechar" onClick={handleClose}>
            ✕
          </button>
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
    </div>
  );
}
