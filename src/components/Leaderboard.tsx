import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Star, Flame } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { students } = useApp();

  // Sort students by karma descending
  const sortedStudents = [...students].sort((a, b) => b.karma - a.karma);

  const getRankBadgeColor = (index: number) => {
    switch (index) {
      case 0: return { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', text: '#fff', label: '1st' };
      case 1: return { bg: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)', text: '#fff', label: '2nd' };
      case 2: return { bg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)', text: '#fff', label: '3rd' };
      default: return { bg: 'rgba(255, 255, 255, 0.05)', text: 'var(--text-secondary)', label: `${index + 1}` };
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.15)',
          color: 'var(--warning)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
        }}>
          <Trophy size={28} />
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>
          Community Leaderboard
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Celebrate our most active mentors! Gain Karma by completing exchanges, reviews, and helping in Q&A.
        </p>
      </div>

      {/* Leaderboard Table Panel */}
      <div className="glass-panel" style={{ padding: '8px', overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1.5fr 1fr 1fr',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-glass)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <span>Rank</span>
          <span>Student</span>
          <span style={{ textAlign: 'center' }}>Rating</span>
          <span style={{ textAlign: 'right' }}>Karma Score</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sortedStudents.map((student, index) => {
            const rankStyle = getRankBadgeColor(index);
            const isPodium = index < 3;

            return (
              <div 
                key={student.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1.5fr 1fr 1fr',
                  padding: '16px 20px',
                  alignItems: 'center',
                  borderBottom: index < sortedStudents.length - 1 ? '1px solid rgba(255, 255, 255, 0.03)' : 'none',
                  background: isPodium ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                  transition: 'var(--transition)'
                }}
              >
                {/* Rank Number */}
                <div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: rankStyle.bg,
                    color: rankStyle.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    boxShadow: isPodium ? '0 4px 10px rgba(0, 0, 0, 0.2)' : 'none'
                  }}>
                    {rankStyle.label}
                  </div>
                </div>

                {/* Profile Detail */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isPodium ? '2px solid var(--primary)' : '1px solid var(--border-glass)'
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{student.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.major}</span>
                  </div>
                </div>

                {/* Rating */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '4px',
                  color: 'var(--warning)', 
                  fontWeight: 700,
                  fontSize: '0.9rem' 
                }}>
                  <Star size={14} fill="currentColor" /> {student.rating}
                </div>

                {/* Karma count */}
                <div style={{ 
                  textAlign: 'right', 
                  fontWeight: 700, 
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '6px'
                }}>
                  <Flame size={16} color="var(--warning)" fill="var(--warning)" />
                  {student.karma}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
