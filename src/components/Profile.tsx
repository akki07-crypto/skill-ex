import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Skill } from '../context/AppContext';
import { Plus, X, User, BookOpen, Star, Edit3, Award } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // Edit states
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [major, setMajor] = useState(currentUser.major);

  // Add skill states
  const [newTeachName, setNewTeachName] = useState('');
  const [newTeachCat, setNewTeachCat] = useState<'Programming' | 'Design' | 'Languages' | 'Academics' | 'Hobbies' | 'Music'>('Programming');
  const [newTeachLvl, setNewTeachLvl] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');

  const [newLearnName, setNewLearnName] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, bio, major });
    setIsEditing(false);
  };

  const handleAddTeachSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeachName.trim()) return;

    // Avoid duplicates
    if (currentUser.skillsToTeach.some(s => s.name.toLowerCase() === newTeachName.trim().toLowerCase())) return;

    const newSkill: Skill = {
      name: newTeachName.trim(),
      category: newTeachCat,
      level: newTeachLvl
    };

    updateProfile({
      skillsToTeach: [...currentUser.skillsToTeach, newSkill]
    });
    setNewTeachName('');
  };

  const handleRemoveTeachSkill = (skillName: string) => {
    updateProfile({
      skillsToTeach: currentUser.skillsToTeach.filter(s => s.name !== skillName)
    });
  };

  const handleAddLearnSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnName.trim()) return;

    if (currentUser.skillsToLearn.some(s => s.toLowerCase() === newLearnName.trim().toLowerCase())) return;

    updateProfile({
      skillsToLearn: [...currentUser.skillsToLearn, newLearnName.trim()]
    });
    setNewLearnName('');
  };

  const handleRemoveLearnSkill = (skillName: string) => {
    updateProfile({
      skillsToLearn: currentUser.skillsToLearn.filter(s => s !== skillName)
    });
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px' }}>
        
        {/* Left Side: Avatar Panel & Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px auto' }}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary)',
                  boxShadow: 'var(--shadow-glow)'
                }}
              />
            </div>

            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px', fontFamily: "'Outfit', sans-serif" }}>{currentUser.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>{currentUser.major}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', borderTop: '1px solid var(--border-glass)', marginTop: '16px', paddingTop: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{currentUser.karma}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Karma Score</span>
              </div>
              <div style={{ width: '1px', background: 'var(--border-glass)' }}></div>
              <div>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                  {currentUser.rating} <Star size={14} fill="currentColor" />
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg Rating</span>
              </div>
            </div>
          </div>

          {/* Badges Panel */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="var(--warning)" /> Earned Badges
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentUser.badges.map(badge => (
                <div 
                  key={badge} 
                  className="badge" 
                  style={{
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    width: '100%',
                    background: 'rgba(245, 158, 11, 0.04)'
                  }}
                >
                  <Award size={14} />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Profile Details & Editing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Details Card */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Outfit', sans-serif" }}>
                <User size={18} color="var(--primary)" /> Profile Information
              </h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Major / Field</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">About Me (Bio)</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setName(currentUser.name);
                      setBio(currentUser.bio);
                      setMajor(currentUser.major);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
                  {currentUser.bio}
                </p>
              </div>
            )}
          </div>

          {/* Manage Taught Skills */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="var(--primary)" /> Skills I Can Teach
            </h3>

            {/* List skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {currentUser.skillsToTeach.map(s => {
                const tagClass = `tag tag-${s.category.toLowerCase()}`;
                return (
                  <span key={s.name} className={tagClass} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {s.name} <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>({s.level})</span>
                    <button 
                      onClick={() => handleRemoveTeachSkill(s.name)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Add skill form */}
            <form onSubmit={handleAddTeachSkill} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <label className="form-label">Skill Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Figma Layouts" 
                  value={newTeachName}
                  onChange={(e) => setNewTeachName(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={newTeachCat}
                  onChange={(e) => setNewTeachCat(e.target.value as any)}
                >
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="Languages">Languages</option>
                  <option value="Academics">Academics</option>
                  <option value="Hobbies">Hobbies</option>
                  <option value="Music">Music</option>
                </select>
              </div>
              <div>
                <label className="form-label">Expertise</label>
                <select 
                  className="form-select"
                  value={newTeachLvl}
                  onChange={(e) => setNewTeachLvl(e.target.value as any)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 14px' }}>
                <Plus size={16} /> Add
              </button>
            </form>
          </div>

          {/* Manage Want to Learn Skills */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={16} color="var(--warning)" /> Skills I Want to Learn
            </h3>

            {/* List skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {currentUser.skillsToLearn.map(skill => (
                <span 
                  key={skill} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 500
                  }}
                >
                  {skill}
                  <button 
                    onClick={() => handleRemoveLearnSkill(skill)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill form */}
            <form onSubmit={handleAddLearnSkill} style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Skill Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Mandarin Chinese" 
                  value={newLearnName}
                  onChange={(e) => setNewLearnName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 14px' }}>
                <Plus size={16} /> Add
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>What other students say</h3>
            {currentUser.reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No reviews yet. Complete your first session to receive reviews!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentUser.reviews.map(rev => (
                  <div 
                    key={rev.id} 
                    style={{ 
                      padding: '16px', 
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      borderRadius: '10px'
                    }}
                  >
                    <div className="flex-between" style={{ marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{rev.reviewerName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--warning)', fontSize: '0.75rem', marginBottom: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < Math.floor(rev.rating) ? 'currentColor' : 'none'} 
                          color="currentColor" 
                        />
                      ))}
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
