import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Student } from '../context/AppContext';
import { X, Calendar, Clock, BookOpen, Send } from 'lucide-react';

interface RequestModalProps {
  partner: Student;
  onClose: () => void;
}

const RequestModal: React.FC<RequestModalProps> = ({ partner, onClose }) => {
  const { currentUser, sendRequest } = useApp();
  const [teachSkill, setTeachSkill] = useState(currentUser.skillsToTeach[0]?.name || '');
  const [learnSkill, setLearnSkill] = useState(partner.skillsToTeach[0]?.name || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teachSkill || !learnSkill || !date || !time) return;

    sendRequest({
      receiverId: partner.id,
      teachSkill,
      learnSkill,
      proposedDate: date,
      proposedTime: time,
      agenda: agenda || `Learn ${learnSkill} and teach ${teachSkill}.`
    });

    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 7, 13, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        className="glass-panel animate-fade-in" 
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Send size={28} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Proposal Sent!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              We have notified {partner.name} about your skill exchange proposal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px', fontFamily: "'Outfit', sans-serif" }}>
              Propose Skill Exchange
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Select the skills you want to exchange with <strong>{partner.name}</strong>.
            </p>

            {/* Skills selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="form-label">I Will Teach</label>
                <select 
                  className="form-select"
                  value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)}
                  required
                >
                  {currentUser.skillsToTeach.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">I Want to Learn</label>
                <select 
                  className="form-select"
                  value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)}
                  required
                >
                  {partner.skillsToTeach.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Time selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> Proposed Date
                </label>
                <input 
                  type="date" 
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} /> Proposed Time
                </label>
                <input 
                  type="time" 
                  className="form-input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Agenda */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} /> Session Agenda / Message
              </label>
              <textarea 
                className="form-textarea" 
                rows={3}
                placeholder="Suggest what you'll work on. e.g. First 45 mins learning React, next 45 mins practicing Spanish."
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Send Proposal
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RequestModal;
