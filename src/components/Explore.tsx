import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Student } from '../context/AppContext';
import RequestModal from './RequestModal';
import { Search, Star, BookOpen, Heart, ArrowRight } from 'lucide-react';

const Explore: React.FC = () => {
  const { students, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPartner, setSelectedPartner] = useState<Student | null>(null);

  const categories = ['All', 'Programming', 'Design', 'Languages', 'Academics', 'Hobbies', 'Music'];

  // Filter students based on search and category selection
  const filteredStudents = students.filter(student => {
    // Hide self
    if (student.id === currentUser.id) return false;

    // Search query matches name or skill names
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skillsToTeach.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.skillsToLearn.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category matches
    const matchesCategory = 
      selectedCategory === 'All' ||
      student.skillsToTeach.some(s => s.category === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>
          Discover Exchange Partners
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Search for students who are teaching the skills you want to acquire and exchange your expertise.
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--text-muted)" style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by name, skill (e.g. Figma, Python)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Category buttons list */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                padding: '8px 14px',
                fontSize: '0.8rem',
                background: selectedCategory === cat ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.03)',
                borderColor: selectedCategory === cat ? 'transparent' : 'var(--border-glass)',
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Students grid */}
      {filteredStudents.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No matches found</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Try adjusting your search criteria or changing filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredStudents.map(student => (
            <div 
              key={student.id} 
              className="glass-panel glass-panel-hover" 
              style={{ 
                padding: '24px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                height: '100%',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                {/* Header info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{student.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{student.major}</div>
                    
                    {/* Rating and Karma */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 700 }}>
                        <Star size={12} fill="currentColor" /> {student.rating}
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>•</span>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        🔥 {student.karma} Karma
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio text */}
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.5',
                  marginBottom: '20px',
                  minHeight: '42px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {student.bio}
                </p>

                {/* Skills Can Teach */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                    <BookOpen size={14} color="var(--primary)" /> Skills I Can Teach:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {student.skillsToTeach.map(s => {
                      const tagClass = `tag tag-${s.category.toLowerCase()}`;
                      return (
                        <span key={s.name} className={tagClass} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {s.name} <span style={{ opacity: 0.6, fontSize: '0.65rem' }}>({s.level})</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Skills Want to Learn */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                    <Heart size={14} color="var(--danger)" /> Skills I Want to Learn:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {student.skillsToLearn.map(skill => (
                      <span 
                        key={skill} 
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: 500
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => setSelectedPartner(student)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 0' }}
              >
                Propose Exchange <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPartner && (
        <RequestModal 
          partner={selectedPartner} 
          onClose={() => setSelectedPartner(null)} 
        />
      )}
    </div>
  );
};

export default Explore;
