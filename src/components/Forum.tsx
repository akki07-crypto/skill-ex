import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThumbsUp, Send, Tag, HelpCircle, ArrowLeft, Plus } from 'lucide-react';

const Forum: React.FC = () => {
  const { forumPosts, currentUser, students, createForumPost, replyToPost, upvotePost, upvoteReply } = useApp();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // New post states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Reply state
  const [replyContent, setReplyContent] = useState('');

  const selectedPost = forumPosts.find(p => p.id === selectedPostId);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    createForumPost(title, content, tags);
    setTitle('');
    setContent('');
    setTagInput('');
    setIsPosting(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedPostId) return;

    replyToPost(selectedPostId, replyContent);
    setReplyContent('');
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' at ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container animate-fade-in">
      {selectedPost ? (
        // Question Details View
        <div>
          <button 
            onClick={() => setSelectedPostId(null)}
            className="btn btn-secondary"
            style={{ marginBottom: '24px', padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Back to Forum
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: '24px' }}>
            {/* Thread detail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <img 
                    src={selectedPost.authorAvatar} 
                    alt={selectedPost.authorName} 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{selectedPost.authorName}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Posted on {formatTime(selectedPost.createdAt)}</span>
                  </div>
                </div>

                <h2 style={{ fontSize: '1.4rem', marginBottom: '12px', fontFamily: "'Outfit', sans-serif" }}>{selectedPost.title}</h2>
                
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                  {selectedPost.content}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="tag tag-programming">{tag}</span>
                  ))}
                </div>

                {/* Footer votes */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                  <button 
                    onClick={() => upvotePost(selectedPost.id)}
                    className="btn"
                    style={{
                      background: selectedPost.votedBy.includes(currentUser.id) ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      borderColor: selectedPost.votedBy.includes(currentUser.id) ? 'var(--primary)' : 'var(--border-glass)',
                      color: selectedPost.votedBy.includes(currentUser.id) ? 'var(--primary)' : 'var(--text-primary)',
                      padding: '6px 14px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <ThumbsUp size={14} fill={selectedPost.votedBy.includes(currentUser.id) ? "currentColor" : "none"} />
                    Helpful ({selectedPost.upvotes})
                  </button>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {selectedPost.replies.length} replies
                  </span>
                </div>
              </div>

              {/* Replies Log */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', paddingLeft: '4px' }}>Answers</h3>
                {selectedPost.replies.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No answers yet. Be the first to help out and earn Karma points!
                  </div>
                ) : (
                  selectedPost.replies.map(reply => (
                    <div key={reply.id} className="glass-panel" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <img 
                          src={reply.authorAvatar} 
                          alt={reply.authorName} 
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{reply.authorName}</h5>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Replied on {formatTime(reply.createdAt)}</span>
                        </div>
                      </div>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '14px', whiteSpace: 'pre-wrap' }}>
                        {reply.content}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button 
                          onClick={() => upvoteReply(selectedPost.id, reply.id)}
                          className="btn"
                          style={{
                            background: reply.votedBy.includes(currentUser.id) ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                            borderColor: reply.votedBy.includes(currentUser.id) ? 'var(--primary)' : 'var(--border-glass)',
                            color: reply.votedBy.includes(currentUser.id) ? 'var(--primary)' : 'var(--text-primary)',
                            padding: '4px 10px',
                            fontSize: '0.75rem'
                          }}
                        >
                          <ThumbsUp size={12} fill={reply.votedBy.includes(currentUser.id) ? "currentColor" : "none"} /> 
                          Upvote ({reply.upvotes})
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Your Answer</h4>
                <form onSubmit={handleSendReply}>
                  <textarea 
                    className="form-textarea" 
                    rows={4}
                    placeholder="Provide a detailed explanation. Be constructive and friendly!"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    required
                    style={{ marginBottom: '12px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary">
                      <Send size={14} /> Post Answer (+15 Karma)
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar info */}
            <div>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={16} color="var(--warning)" /> Karma Reward System
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Participating in conversations grows the network.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Asking a Question</span>
                    <strong style={{ color: 'var(--warning)' }}>+10 Karma</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Replying to others</span>
                    <strong style={{ color: 'var(--success)' }}>+15 Karma</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Getting upvoted</span>
                    <strong style={{ color: 'var(--primary)' }}>+5 Karma</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isPosting ? (
        // Create Post Form View
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <button 
            onClick={() => setIsPosting(false)}
            className="btn btn-secondary"
            style={{ marginBottom: '24px' }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="glass-panel animate-fade-in" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontFamily: "'Outfit', sans-serif" }}>
              Ask the Community
            </h2>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label className="form-label">Question Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. How to draw perspective lines in Figma?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Describe your problem</label>
                <textarea 
                  className="form-textarea" 
                  rows={6}
                  placeholder="Provide all context, code snippets, or configurations other students might need to understand your issue."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={14} /> Tags (comma separated)
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="React, Figma, Design, Spanish"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsPosting(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Publish Question (+10 Karma)
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Forum Feed View
        <div>
          <div className="flex-between" style={{ marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>
                Q&A Help Forum
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Ask code or design questions, help other students troubleshoot, and earn Karma multipliers.
              </p>
            </div>
            
            <button 
              onClick={() => setIsPosting(true)}
              className="btn btn-primary"
            >
              <Plus size={16} /> Ask Question
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: '24px' }}>
            {/* Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {forumPosts.map(post => (
                <div 
                  key={post.id} 
                  className="glass-panel glass-panel-hover" 
                  style={{ padding: '20px', cursor: 'pointer' }}
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <img 
                      src={post.authorAvatar} 
                      alt={post.authorName} 
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{post.authorName}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{formatTime(post.createdAt)}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', fontWeight: 600 }}>{post.title}</h3>
                  
                  <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.875rem', 
                    lineHeight: '1.5',
                    marginBottom: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.content}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {post.tags.map(tag => (
                        <span key={tag} className="tag tag-programming" style={{ fontSize: '0.7rem' }}>{tag}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        👍 {post.upvotes} Upvotes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        💬 {post.replies.length} Replies
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Q&A Rules sidebar */}
            <div>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Weekly Top Contributors</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {students.slice(1, 4).map((stud, idx) => (
                    <div key={stud.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 700, color: idx === 0 ? '#fbbf24' : idx === 1 ? '#d1d5db' : '#b45309' }}>#{idx + 1}</span>
                      <img 
                        src={stud.avatar} 
                        alt={stud.name} 
                        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{stud.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{stud.karma} Karma</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
