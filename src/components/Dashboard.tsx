import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Student } from '../context/AppContext';
import RequestModal from './RequestModal';
import { 
  Flame, 
  Calendar, 
  UserCheck, 
  ChevronRight, 
  Star,
  Award,
  Video,
  TrendingUp,
  Inbox,
  Sparkles
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    students, 
    requests, 
    sessions, 
    respondToRequest,
    setActiveSessionId,
    setCurrentView
  } = useApp();

  const [selectedPartner, setSelectedPartner] = useState<Student | null>(null);

  // Calculate statistics
  const pendingRequests = requests.filter(r => r.receiverId === currentUser.id && r.status === 'pending');
  const sentRequests = requests.filter(r => r.senderId === currentUser.id);
  const activeSessions = sessions.filter(s => s.status !== 'completed');

  // Smart Matchmaker Engine
  // Match algorithm:
  // - Partner has a skill in currentUser.skillsToLearn
  // - Partner wants a skill in currentUser.skillsToTeach
  const getMutualMatches = () => {
    const teachNames = currentUser.skillsToTeach.map(s => s.name.toLowerCase());
    const learnNames = currentUser.skillsToLearn.map(s => s.toLowerCase());

    return students.filter(student => {
      if (student.id === currentUser.id) return false;

      const partnerTeaches = student.skillsToTeach.map(s => s.name.toLowerCase());
      const partnerLearns = student.skillsToLearn.map(s => s.toLowerCase());

      const theyCanTeachMe = partnerTeaches.some(s => learnNames.includes(s));
      const iCanTeachThem = teachNames.some(s => partnerLearns.includes(s));

      return theyCanTeachMe || iCanTeachThem;
    }).map(student => {
      const partnerLearns = student.skillsToLearn.map(s => s.toLowerCase());

      const mutualTeach = student.skillsToTeach.filter(s => learnNames.includes(s.name.toLowerCase()));
      const mutualLearn = currentUser.skillsToTeach.filter(s => partnerLearns.includes(s.name.toLowerCase()));

      const isMutual = mutualTeach.length > 0 && mutualLearn.length > 0;

      return {
        student,
        mutualTeach,
        mutualLearn,
        isMutual
      };
    }).sort((a, b) => (b.isMutual ? 1 : 0) - (a.isMutual ? 1 : 0)); // Put mutual matches first
  };

  const matches = getMutualMatches();

  const handleStartSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setCurrentView('session');
  };

  return (
    <div className="container animate-fade-in">
      {/* Top Banner Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Welcome Dashboard */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="var(--warning)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Student Dashboard
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '12px', fontFamily: "'Outfit', sans-serif" }}>
              Welcome back, {currentUser.name}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', lineHeight: 1.6, fontSize: '0.95rem' }}>
              You have earned {currentUser.karma} Karma points. Build connections by exchanging skills. You can review matches below or schedule live whiteboard collaborative sessions!
            </p>
          </div>
          
          {/* Achievements Row */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
            {currentUser.badges.map(badge => (
              <div key={badge} className="badge">
                <Award size={14} />
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Small Statistics Widget */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '16px' }}>
          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ color: 'var(--primary)' }}>
              <Video size={20} />
            </div>
            <div className="stat-info">
              <h3>{sessions.length}</h3>
              <p>Total Exchanges</p>
            </div>
          </div>
          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ color: 'var(--success)' }}>
              <Star size={20} />
            </div>
            <div className="stat-info">
              <h3>{currentUser.rating} ★</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Side Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Active / Scheduled Sessions */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--primary)" /> Scheduled Exchange Sessions
            </h2>
            {activeSessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                No upcoming sessions. Propose an exchange to get started!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeSessions.map(session => {
                  const partnerId = session.studentAId === currentUser.id ? session.studentBId : session.studentAId;
                  const partner = students.find(s => s.id === partnerId);

                  return (
                    <div 
                      key={session.id} 
                      className="glass-panel" 
                      style={{ 
                        padding: '16px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img 
                          src={partner?.avatar} 
                          alt={partner?.name} 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{partner?.name}</h4>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>Teach: <strong style={{ color: 'var(--primary)' }}>{session.teachSkill}</strong></span>
                            <span>•</span>
                            <span>Learn: <strong style={{ color: 'var(--success)' }}>{session.learnSkill}</strong></span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            📅 {session.scheduledTime}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleStartSession(session.id)}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <Video size={14} /> Join Learning Space
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Smart Matchmaker */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--success)" /> Smart Matches for You
              </h2>
              <button 
                onClick={() => setCurrentView('explore')}
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Explore More <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {matches.slice(0, 4).map(({ student, mutualTeach, mutualLearn, isMutual }) => (
                <div 
                  key={student.id} 
                  className="glass-panel glass-panel-hover" 
                  style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}
                >
                  {isMutual && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: 'var(--success)',
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Flame size={10} fill="currentColor" /> Mutual Match
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{student.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.major}</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px', lineHeight: '1.4' }}>
                      {student.bio}
                    </p>

                    {/* Teach tag list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {mutualTeach.length > 0 && (
                        <div style={{ fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Can Teach you: </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '3px' }}>
                            {mutualTeach.map(t => (
                              <span key={t.name} className="tag tag-programming" style={{ fontSize: '0.7rem' }}>{t.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {mutualLearn.length > 0 && (
                        <div style={{ fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Wants to Learn: </span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '3px' }}>
                            {mutualLearn.map(l => (
                              <span key={l.name} className="tag tag-design" style={{ fontSize: '0.7rem' }}>{l.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedPartner(student)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '8px 0', fontSize: '0.8rem', marginTop: '8px' }}
                  >
                    Propose Exchange
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side Column (Requests Log) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Incoming Requests */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Inbox size={16} color="var(--warning)" /> Incoming Exchange Requests
            </h3>

            {pendingRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No pending requests.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {pendingRequests.map(req => {
                  const sender = students.find(s => s.id === req.senderId);
                  return (
                    <div 
                      key={req.id} 
                      className="glass-panel" 
                      style={{ 
                        padding: '14px', 
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <img 
                          src={sender?.avatar} 
                          alt={sender?.name} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <span style={{ fontWeight: 600 }}>{sender?.name}</span>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Major: {sender?.major}</div>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0, 0, 0, 0.15)', padding: '8px', borderRadius: '6px', marginBottom: '10px', fontSize: '0.75rem' }}>
                        <div>📚 Teach you: <strong>{req.teachSkill}</strong></div>
                        <div style={{ marginTop: '2px' }}>💡 Learn from you: <strong>{req.learnSkill}</strong></div>
                        <div style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{req.agenda}"</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button 
                          onClick={() => respondToRequest(req.id, 'declined')}
                          className="btn btn-secondary" 
                          style={{ padding: '6px 0', fontSize: '0.75rem' }}
                        >
                          Decline
                        </button>
                        <button 
                          onClick={() => respondToRequest(req.id, 'accepted')}
                          className="btn btn-success" 
                          style={{ padding: '6px 0', fontSize: '0.75rem' }}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Outgoing Requests Status */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={16} color="var(--primary)" /> Sent Proposals Status
            </h3>

            {sentRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active proposals.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sentRequests.map(req => {
                  const receiver = students.find(s => s.id === req.receiverId);
                  
                  const statusColors = {
                    pending: { bg: 'rgba(245, 158, 11, 0.08)', text: 'var(--warning)', label: 'Pending' },
                    accepted: { bg: 'rgba(16, 185, 129, 0.08)', text: 'var(--success)', label: 'Accepted' },
                    declined: { bg: 'rgba(239, 68, 68, 0.08)', text: 'var(--danger)', label: 'Declined' },
                    completed: { bg: 'rgba(99, 102, 241, 0.08)', text: 'var(--primary)', label: 'Completed' }
                  };

                  const config = statusColors[req.status];

                  return (
                    <div 
                      key={req.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={receiver?.avatar} 
                          alt={receiver?.name} 
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{receiver?.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Exchanging: {req.learnSkill}</div>
                        </div>
                      </div>

                      <div style={{
                        background: config.bg,
                        color: config.text,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}>
                        {config.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {selectedPartner && (
        <RequestModal 
          partner={selectedPartner} 
          onClose={() => setSelectedPartner(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
