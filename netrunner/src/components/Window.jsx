import { useRef, useCallback, useEffect } from 'react';
import { useGame } from '../context/GameContext';

export default function Window({ id, title, icon, children, width = 550, height = 400 }) {
  const { state, dispatch } = useGame();
  const windowRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0 });

  const isOpen = state.openWindows.includes(id);
  const isFocused = state.focusedWindow === id;

  // Random initial position
  const posRef = useRef({
    x: 100 + Math.random() * 200,
    y: 40 + Math.random() * 100,
  });

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-btn')) return;
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
  }, [dispatch, id]);

  const handleFocus = useCallback(() => {
    dispatch({ type: 'FOCUS_WINDOW', id });
  }, [dispatch, id]);

  const handleClose = useCallback(() => {
    dispatch({ type: 'CLOSE_WINDOW', id });
  }, [dispatch, id]);

  if (!isOpen) return null;

  const zIndex = isFocused ? 100 : state.openWindows.indexOf(id) + 10;

  return (
    <div
      ref={windowRef}
      className={`window ${isFocused ? 'focused' : ''}`}
      style={{
        width,
        height,
        left: posRef.current.x,
        top: posRef.current.y,
        zIndex,
        animation: 'winOpen 0.25s var(--ease-out-expo)',
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
          <button className="window-btn window-btn-minimize" onClick={() => {}} />
          <button className="window-btn window-btn-maximize" onClick={() => {}} />
          <button className="window-btn window-btn-close" onClick={handleClose} />
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
    </div>
  );
}
