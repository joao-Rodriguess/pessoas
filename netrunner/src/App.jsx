import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { GameProvider, useGame } from './context/GameContext';
import { useAuth } from './context/AuthContext';
import Boot from './pages/Boot';
import Login from './pages/Login';
import Desktop from './pages/Desktop';
import MobilePhone from './pages/MobilePhone';
import Victory from './pages/Victory';
import GameOver from './pages/GameOver';
import NarrativeOverlay from './components/NarrativeOverlay';

function GameRouter() {
  const { state } = useGame();
  const { user } = useAuth();

  // Update GameProvider with current user for auto-save
  const { setUser: setGameUser } = useGame();
  useEffect(() => {
    setGameUser(user);
  }, [user, setGameUser]);

  return (
    <>
      {state.phase === 'boot' && <Boot />}
      {state.phase === 'login' && <Login />}
      {state.phase === 'desktop' && (state.isMobileMode ? <MobilePhone /> : <Desktop />)}
      {state.phase === 'victory' && <Victory />}
      {state.phase === 'gameover' && <GameOver />}
      {state.currentNarrative && <NarrativeOverlay />}
      <div className="scanlines-overlay" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <GameRouter />
      </GameProvider>
    </AuthProvider>
  );
}
