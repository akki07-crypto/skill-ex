import React from 'react';
import { AppContextProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Explore from './components/Explore';
import Forum from './components/Forum';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import SessionSpace from './components/SessionSpace';
import Chat from './components/Chat';

const AppContent: React.FC = () => {
  const { currentView, activeSessionId } = useApp();

  // If a session is active and view is 'session', render the SessionSpace in full screen (no Navbar)
  if (activeSessionId && currentView === 'session') {
    return <SessionSpace />;
  }

  // Standard Shell
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 80px)' }}>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'explore' && <Explore />}
        {currentView === 'chat' && <Chat />}
        {currentView === 'forum' && <Forum />}
        {currentView === 'leaderboard' && <Leaderboard />}
        {currentView === 'profile' && <Profile />}
      </main>
    </>
  );
};

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
