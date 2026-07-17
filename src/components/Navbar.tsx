import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  MessageCircle,
  Trophy, 
  User, 
  Flame,
  Layers
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { currentView, setCurrentView, currentUser } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Matches', icon: Search },
    { id: 'chat', label: 'Inbox Chat', icon: MessageCircle },
    { id: 'forum', label: 'Q&A Forum', icon: MessageSquare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      top: '16px',
      left: '16px',
      right: '16px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 100,
      borderRadius: '16px'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => setCurrentView('dashboard')}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          cursor: 'pointer' 
        }}
      >
        <div style={{
          background: 'var(--primary-gradient)',
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}>
          <Layers size={18} color="white" />
        </div>
        <span style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: '1.25rem',
          background: 'linear-gradient(to right, #ffffff, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em'
        }}>
          SkillSwap Hub
        </span>
      </div>

      {/* Nav Actions */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="btn"
              style={{
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                borderColor: isActive ? 'var(--border-glass)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '8px 16px',
                fontSize: '0.875rem'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--primary)' : 'currentColor'} />
              <span className="nav-label" style={{ display: 'inline-block' }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Karma counter */}
        <div className="glass-panel" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '12px',
          background: 'rgba(245, 158, 11, 0.08)',
          borderColor: 'rgba(245, 158, 11, 0.2)'
        }}>
          <Flame size={16} color="var(--warning)" fill="var(--warning)" />
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--warning)',
            fontFamily: "'Outfit', sans-serif"
          }}>
            {currentUser.karma} Karma
          </span>
        </div>

        {/* User Avatar */}
        <div 
          onClick={() => setCurrentView('profile')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer' 
          }}
        >
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--primary)'
            }}
          />
          <div className="nav-user-details" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{currentUser.major}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
