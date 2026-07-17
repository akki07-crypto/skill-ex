import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { Student } from '../context/AppContext';
import RequestModal from './RequestModal';
import { Send, MessageSquare, Calendar } from 'lucide-react';

const Chat: React.FC = () => {
  const { students, currentUser, messages, loadMessages, sendMessage } = useApp();
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [selectedPartnerForRequest, setSelectedPartnerForRequest] = useState<Student | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const activePartner = students.find(s => s.id === activePartnerId);

  // Poll for new messages every 3 seconds when chat is open
  useEffect(() => {
    if (!activePartnerId) return;

    loadMessages(activePartnerId);
    const interval = setInterval(() => {
      loadMessages(activePartnerId);
    }, 3000);

    return () => clearInterval(interval);
  }, [activePartnerId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartnerId) return;

    sendMessage(activePartnerId, inputText.trim());
    setInputText('');
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter out current user from active contacts list
  const chatPartners = students.filter(s => s.id !== currentUser.id);

  return (
    <div className="container animate-fade-in" style={{ height: 'calc(100vh - 120px)', paddingBottom: '0px' }}>
      <div 
        className="glass-panel" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '320px 1fr', 
          height: '100%', 
          overflow: 'hidden',
          borderRadius: '16px'
        }}
      >
        {/* Left Sidebar: Student Contacts */}
        <div style={{ 
          borderRight: '1px solid var(--border-glass)', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="var(--primary)" /> Student Inbox
            </h3>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {chatPartners.map(partner => {
              const isSelected = partner.id === activePartnerId;
              return (
                <div
                  key={partner.id}
                  onClick={() => setActivePartnerId(partner.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                    transition: 'var(--transition)'
                  }}
                  className={!isSelected ? "glass-panel-hover" : ""}
                >
                  <img 
                    src={partner.avatar} 
                    alt={partner.name} 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-glass)'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 650, fontSize: '0.9rem', color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                        {partner.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', gap: '8px' }}>
                      <span>{partner.major}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--warning)', fontWeight: 600 }}>{partner.rating} ★</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Message Chat Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {activePartner ? (
            <>
              {/* Chat Window Header */}
              <div 
                className="flex-between" 
                style={{ 
                  padding: '16px 24px', 
                  borderBottom: '1px solid var(--border-glass)',
                  background: 'rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={activePartner.avatar} 
                    alt={activePartner.name} 
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{activePartner.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activePartner.major}</p>
                  </div>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => setSelectedPartnerForRequest(activePartner)}
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  <Calendar size={14} /> Propose Swap
                </button>
              </div>

              {/* Message History list */}
              <div style={{ 
                flex: 1, 
                padding: '24px', 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                background: 'rgba(0,0,0,0.15)'
              }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Send a message to coordinate your skills exchange with {activePartner.name}.
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div 
                        key={index} 
                        style={{ 
                          display: 'flex', 
                          justifyContent: isMe ? 'flex-end' : 'flex-start' 
                        }}
                      >
                        <div style={{ 
                          maxWidth: '60%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          alignItems: isMe ? 'flex-end' : 'flex-start'
                        }}>
                          <div style={{
                            padding: '10px 16px',
                            borderRadius: '16px',
                            borderTopRightRadius: isMe ? '2px' : '16px',
                            borderTopLeftRadius: isMe ? '16px' : '2px',
                            background: isMe ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
                            border: isMe ? 'none' : '1px solid var(--border-glass)',
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            lineHeight: '1.4',
                            wordBreak: 'break-word'
                          }}>
                            {msg.content}
                          </div>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 4px' }}>
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Message Footer */}
              <form 
                onSubmit={handleSend}
                style={{ 
                  padding: '16px 24px', 
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  gap: '12px',
                  background: 'rgba(0,0,0,0.05)'
                }}
              >
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder={`Type a message to ${activePartner.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ borderRadius: '10px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 16px', borderRadius: '10px' }}>
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
              <MessageSquare size={48} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>Select a student to start a chat</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Discuss meeting times and schedules before swapping.</p>
            </div>
          )}
        </div>
      </div>

      {selectedPartnerForRequest && (
        <RequestModal 
          partner={selectedPartnerForRequest} 
          onClose={() => setSelectedPartnerForRequest(null)} 
        />
      )}
    </div>
  );
};

export default Chat;
