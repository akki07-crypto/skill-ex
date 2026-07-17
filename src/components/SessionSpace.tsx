import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  BookOpen, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  Trash2, 
  Star,
  CheckCircle,
  Download
} from 'lucide-react';

const SessionSpace: React.FC = () => {
  const { activeSessionId, sessions, students, currentUser, completeSession, updateSessionNotes, updateSessionWhiteboard, addSessionResource } = useApp();
  const session = sessions.find(s => s.id === activeSessionId);

  if (!session) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Session not found</h2>
        <p>Please return to the dashboard and try again.</p>
      </div>
    );
  }

  const partnerId = session.studentAId === currentUser.id ? session.studentBId : session.studentAId;
  const partner = students.find(s => s.id === partnerId);

  // Video / Audio toggles
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [partnerVideoOn] = useState(true);

  // Timer states (45 minutes session simulated)
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins simulator
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Notes state
  const [notes, setNotes] = useState(session.notes);

  // Whiteboard drawing states
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState('#6366f1');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'whiteboard' | 'resources'>('whiteboard');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');

  // Feedback popup states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  // Handle countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto open feedback popup when timer expires
      setIsTimerRunning(false);
      setShowFeedbackModal(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Format timer text
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Canvas Whiteboard Drawing Code
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = canvas.parentElement?.clientHeight || 450;

    // Fill white/transparent background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If session had previous drawing, load it
    if (session.whiteboardData) {
      const img = new Image();
      img.src = session.whiteboardData;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [activeSessionId]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Save drawing to state context
    const canvas = canvasRef.current;
    if (canvas) {
      updateSessionWhiteboard(session.id, canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    updateSessionWhiteboard(session.id, '');
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `whiteboard-${session.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    updateSessionNotes(session.id, val);
  };

  const handleFinishSession = () => {
    setShowFeedbackModal(true);
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partner) return;
    completeSession(session.id, partner.id, rating, reviewComment || 'Great exchange session! Highly recommend.');
  };

  return (
    <div className="container animate-fade-in" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
      
      {/* Session space head bar */}
      <div className="flex-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Outfit', sans-serif" }}>
            🤝 Skill Exchange Room
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Teaching: <strong style={{ color: 'var(--primary)' }}>{session.teachSkill}</strong> | Learning: <strong style={{ color: 'var(--success)' }}>{session.learnSkill}</strong>
          </p>
        </div>

        {/* Exit Button */}
        <button 
          onClick={handleFinishSession}
          className="btn btn-danger"
          style={{ padding: '10px 18px' }}
        >
          <CheckCircle size={16} /> Complete & Finish Session
        </button>
      </div>

      {/* Main split dashboard layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '20px', minHeight: '650px' }}>
        
        {/* Left column (video, timer, notes) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Audio/Video streams */}
          <div className="glass-panel" style={{ padding: '16px', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '0.95rem', marginBottom: '12px' }}>Live Feeds (Simulated)</h3>
            
            {/* Feeds grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', height: '160px', marginBottom: '14px' }}>
              {/* Current user Feed */}
              <div style={{ 
                position: 'relative', 
                background: '#1e293b', 
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {videoOn ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.1)' }}
                  />
                ) : (
                  <VideoOff size={32} color="var(--text-muted)" />
                )}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem'
                }}>
                  You {micOn ? '🎙️' : '🔇'}
                </div>
              </div>

              {/* Partner Feed */}
              <div style={{ 
                position: 'relative', 
                background: '#1e293b', 
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {partnerVideoOn ? (
                  <img 
                    src={partner?.avatar} 
                    alt={partner?.name} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      animation: 'pulse 6s infinite ease-in-out'
                    }}
                  />
                ) : (
                  <VideoOff size={32} color="var(--text-muted)" />
                )}
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem'
                }}>
                  {partner?.name}
                </div>
              </div>
            </div>

            {/* Stream Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                onClick={() => setVideoOn(!videoOn)}
                className="btn btn-secondary"
                style={{ padding: '8px', borderRadius: '50%', width: '38px', height: '38px' }}
              >
                {videoOn ? <Video size={16} /> : <VideoOff size={16} color="var(--danger)" />}
              </button>
              <button 
                onClick={() => setMicOn(!micOn)}
                className="btn btn-secondary"
                style={{ padding: '8px', borderRadius: '50%', width: '38px', height: '38px' }}
              >
                {micOn ? <Mic size={16} /> : <MicOff size={16} color="var(--danger)" />}
              </button>
            </div>
          </div>

          {/* Countdown Session Timer */}
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Remaining time</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: timeLeft < 120 ? 'var(--danger)' : 'var(--text-primary)', fontFamily: "'Outfit', sans-serif", marginTop: '2px' }}>
                {formatTime(timeLeft)}
              </h3>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="btn btn-secondary"
                style={{ padding: '8px 12px' }}
              >
                {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button 
                onClick={() => setTimeLeft(15 * 60)}
                className="btn btn-secondary"
                style={{ padding: '8px 12px' }}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Notes pad */}
          <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} color="var(--primary)" /> Shared Session Notes
            </h3>
            <textarea 
              className="form-textarea"
              style={{ flex: 1, resize: 'none', background: 'rgba(0,0,0,0.3)', border: 'none', borderTop: '1px solid var(--border-glass)', borderRadius: '8px', padding: '12px', fontSize: '0.9rem', lineHeight: '1.5' }}
              placeholder="Jot down notes, links, or lists during your study session. Changes auto-save..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
            />
          </div>

        </div>

        {/* Right column (interactive whiteboard / resources tab) */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs selector header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-glass)',
            background: 'rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveRightTab('whiteboard')}
                className="btn"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  background: activeRightTab === 'whiteboard' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  borderColor: activeRightTab === 'whiteboard' ? 'var(--border-glass)' : 'transparent',
                  color: activeRightTab === 'whiteboard' ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                Whiteboard
              </button>
              <button
                onClick={() => setActiveRightTab('resources')}
                className="btn"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  background: activeRightTab === 'resources' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  borderColor: activeRightTab === 'resources' ? 'var(--border-glass)' : 'transparent',
                  color: activeRightTab === 'resources' ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                Shared Resources ({session.resources?.length || 0})
              </button>
            </div>

            {/* Conditionally render whiteboard controls if whiteboard tab active */}
            {activeRightTab === 'whiteboard' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Color</span>
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                      width: '24px',
                      height: '24px',
                      border: 'none',
                      borderRadius: '4px',
                      background: 'none',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Size</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    style={{ width: '60px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.75rem', width: '12px' }}>{brushSize}</span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    onClick={downloadCanvas}
                    className="btn btn-secondary" 
                    style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                    title="Download whiteboard"
                  >
                    <Download size={12} />
                  </button>
                  <button 
                    onClick={clearCanvas}
                    className="btn btn-secondary" 
                    style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--danger)' }}
                    title="Clear whiteboard"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Conditional Body rendering */}
          {activeRightTab === 'whiteboard' ? (
            <div style={{ flex: 1, position: 'relative', background: '#0f172a' }}>
              <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  display: 'block',
                  cursor: 'crosshair',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          ) : (
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(0,0,0,0.1)' }}>
              {/* Resources list container */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {!session.resources || session.resources.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No resource links shared yet in this session.
                  </div>
                ) : (
                  session.resources.map((res, i) => {
                    const author = students.find(s => s.id === res.addedBy);
                    return (
                      <div 
                        key={i} 
                        className="glass-panel" 
                        style={{ 
                          padding: '14px 18px', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                      >
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{res.title}</h4>
                          <a 
                            href={res.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', display: 'block', marginTop: '4px', wordBreak: 'break-all' }}
                          >
                            {res.url}
                          </a>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Shared by: </span>
                          <strong style={{ color: 'var(--text-secondary)' }}>{author?.name || 'Student'}</strong>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add resource form */}
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!resourceTitle.trim() || !resourceUrl.trim()) return;
                  await addSessionResource(session.id, resourceTitle.trim(), resourceUrl.trim());
                  setResourceTitle('');
                  setResourceUrl('');
                }}
                className="glass-panel" 
                style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '12px', alignItems: 'end', background: 'rgba(0,0,0,0.2)' }}
              >
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>Resource Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. GitHub Repository link" 
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    required
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>URL / Link</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://example.com/notes" 
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    required
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Share link
                </button>
              </form>
            </div>
          )}
        </div>

      </div>

      {/* Review & Feedback Overlay Modal */}
      {showFeedbackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 7, 13, 0.95)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>Session Completed!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
              How was your experience learning with <strong>{partner?.name}</strong>? Rate them to complete the exchange.
            </p>

            <form onSubmit={submitFeedback}>
              {/* Star Rating select */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fbbf24' }}
                  >
                    <Star 
                      size={36} 
                      fill={(hoverRating !== null ? star <= hoverRating : star <= rating) ? 'currentColor' : 'none'} 
                      color="currentColor" 
                    />
                  </button>
                ))}
              </div>

              {/* Review Text */}
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Review comment</label>
                <textarea 
                  className="form-textarea" 
                  rows={3} 
                  placeholder={`Write a friendly review about Elena's teaching style, patience...`}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setShowFeedbackModal(false)}
                >
                  Go Back
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Submit & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SessionSpace;
