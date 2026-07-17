import React, { createContext, useContext, useState, useEffect } from 'react';

// Data Structures
export interface Skill {
  name: string;
  category: 'Programming' | 'Design' | 'Languages' | 'Academics' | 'Hobbies' | 'Music';
  level: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  major: string;
  karma: number;
  skillsToTeach: Skill[];
  skillsToLearn: string[];
  reviews: Review[];
  rating: number;
  badges: string[];
}

export interface ExchangeRequest {
  id: string;
  senderId: string;
  receiverId: string;
  teachSkill: string;
  learnSkill: string;
  proposedDate: string;
  proposedTime: string;
  agenda: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
}

export interface Resource {
  title: string;
  url: string;
  addedBy: string;
}

export interface Session {
  id: string;
  requestId: string;
  studentAId: string;
  studentBId: string;
  teachSkill: string;
  learnSkill: string;
  scheduledTime: string;
  status: 'upcoming' | 'active' | 'completed';
  notes: string;
  whiteboardData: string;
  resources: Resource[];
}

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  upvotes: number;
  votedBy: string[];
  createdAt: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  votedBy: string[];
  replies: ForumReply[];
  createdAt: string;
}

export interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface AppContextType {
  currentUser: Student;
  students: Student[];
  requests: ExchangeRequest[];
  sessions: Session[];
  forumPosts: ForumPost[];
  messages: Message[];
  currentView: string;
  activeSessionId: string | null;
  setCurrentView: (view: string) => void;
  setActiveSessionId: (id: string | null) => void;
  updateProfile: (updatedProfile: Partial<Student>) => Promise<void>;
  sendRequest: (request: Omit<ExchangeRequest, 'id' | 'senderId' | 'status'>) => Promise<void>;
  respondToRequest: (requestId: string, status: 'accepted' | 'declined') => Promise<void>;
  createForumPost: (title: string, content: string, tags: string[]) => Promise<void>;
  replyToPost: (postId: string, content: string) => Promise<void>;
  upvotePost: (postId: string) => Promise<void>;
  upvoteReply: (postId: string, replyId: string) => Promise<void>;
  completeSession: (sessionId: string, partnerId: string, rating: number, reviewText: string) => Promise<void>;
  updateSessionNotes: (sessionId: string, notes: string) => Promise<void>;
  updateSessionWhiteboard: (sessionId: string, dataUrl: string) => Promise<void>;
  loadMessages: (partnerId: string) => Promise<void>;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  addSessionResource: (sessionId: string, title: string, url: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Fallback values (while loading)
const FALLBACK_STUDENT: Student = {
  id: 'user-current',
  name: 'Alex Rivera',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  bio: 'Loading profile...',
  major: 'Computer Science',
  karma: 0,
  skillsToTeach: [],
  skillsToLearn: [],
  reviews: [],
  rating: 5.0,
  badges: []
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Student>(FALLBACK_STUDENT);
  const [students, setStudents] = useState<Student[]>([]);
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load initial data from Express MongoDB Server
  const refreshAllData = async () => {
    try {
      const resStudents = await fetch('/api/students');
      const dataStudents = await resStudents.json();
      setStudents(dataStudents);
      
      const current = dataStudents.find((s: Student) => s.id === 'user-current');
      if (current) {
        setCurrentUser(current);
      }

      const resRequests = await fetch('/api/requests');
      const dataRequests = await resRequests.json();
      setRequests(dataRequests);

      const resSessions = await fetch('/api/sessions');
      const dataSessions = await resSessions.json();
      setSessions(dataSessions);

      const resForum = await fetch('/api/forum');
      const dataForum = await resForum.json();
      setForumPosts(dataForum);
    } catch (err) {
      console.error('Failed to fetch initial database data:', err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Sync Student profile helper
  const syncStudentProfile = async (studentId: string, updated: Student) => {
    try {
      await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Failed to sync student to database:', err);
    }
  };

  // Profile Update
  const updateProfile = async (updatedProfile: Partial<Student>) => {
    const updated = { ...currentUser, ...updatedProfile };
    setCurrentUser(updated);
    setStudents((all) => all.map((s) => (s.id === currentUser.id ? updated : s)));
    await syncStudentProfile(currentUser.id, updated);
  };

  // Send request
  const sendRequest = async (req: Omit<ExchangeRequest, 'id' | 'senderId' | 'status'>) => {
    const newRequest: ExchangeRequest = {
      ...req,
      id: `req-${Date.now()}`,
      senderId: currentUser.id,
      status: 'pending'
    };

    setRequests((prev) => [newRequest, ...prev]);

    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
    } catch (err) {
      console.error('Failed to create request in database:', err);
    }
  };

  // Accept/Decline request
  const respondToRequest = async (requestId: string, status: 'accepted' | 'declined') => {
    let targetReq: ExchangeRequest | undefined;

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          targetReq = { ...r, status };
          return targetReq;
        }
        return r;
      })
    );

    if (targetReq) {
      try {
        await fetch(`/api/requests/${requestId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetReq)
        });
      } catch (err) {
        console.error('Failed to update request state in database:', err);
      }
    }

    const request = requests.find((r) => r.id === requestId);
    if (status === 'accepted' && request) {
      const newSession: Session = {
        id: `sess-${Date.now()}`,
        requestId: request.id,
        studentAId: request.senderId,
        studentBId: request.receiverId,
        teachSkill: request.teachSkill,
        learnSkill: request.learnSkill,
        scheduledTime: `${request.proposedDate} at ${request.proposedTime}`,
        status: 'upcoming',
        notes: request.agenda || 'Agenda: 45 minutes teaching and 45 minutes learning.',
        whiteboardData: '',
        resources: []
      };

      setSessions((prev) => [newSession, ...prev]);

      try {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSession)
        });
      } catch (err) {
        console.error('Failed to create session in database:', err);
      }
    }
  };

  // Create Forum post
  const createForumPost = async (title: string, content: string, tags: string[]) => {
    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      title,
      content,
      tags,
      upvotes: 0,
      votedBy: [],
      replies: [],
      createdAt: new Date().toISOString()
    };
    setForumPosts((prev) => [newPost, ...prev]);

    try {
      await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
    } catch (err) {
      console.error('Failed to create forum post in database:', err);
    }

    // Give Karma points for asking questions
    await updateProfile({ karma: currentUser.karma + 10 });
  };

  // Reply to Forum post
  const replyToPost = async (postId: string, content: string) => {
    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      content,
      upvotes: 0,
      votedBy: [],
      createdAt: new Date().toISOString()
    };

    let updatedPost: ForumPost | undefined;

    setForumPosts((posts) =>
      posts.map((post) => {
        if (post.id === postId) {
          updatedPost = {
            ...post,
            replies: [...post.replies, newReply]
          };
          return updatedPost;
        }
        return post;
      })
    );

    if (updatedPost) {
      try {
        await fetch(`/api/forum/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost)
        });
      } catch (err) {
        console.error('Failed to post reply in database:', err);
      }
    }

    // Give Karma points for replying/helping
    await updateProfile({ karma: currentUser.karma + 15 });
  };

  // Upvote Post
  const upvotePost = async (postId: string) => {
    let updatedPost: ForumPost | undefined;
    let authorId = '';
    let diff = 0;

    setForumPosts((posts) =>
      posts.map((post) => {
        if (post.id === postId) {
          authorId = post.authorId;
          const alreadyVoted = post.votedBy.includes(currentUser.id);
          let newVotedBy = [...post.votedBy];

          if (alreadyVoted) {
            newVotedBy = newVotedBy.filter((id) => id !== currentUser.id);
            diff = -1;
          } else {
            newVotedBy.push(currentUser.id);
            diff = 1;
          }

          updatedPost = {
            ...post,
            upvotes: post.upvotes + diff,
            votedBy: newVotedBy
          };
          return updatedPost;
        }
        return post;
      })
    );

    if (updatedPost) {
      try {
        await fetch(`/api/forum/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost)
        });

        // Transfer karma to author in students DB list
        const author = students.find((s) => s.id === authorId);
        if (author) {
          const updatedAuthor = { ...author, karma: author.karma + (diff * 5) };
          setStudents((all) => all.map((s) => (s.id === authorId ? updatedAuthor : s)));
          await syncStudentProfile(authorId, updatedAuthor);

          if (authorId === currentUser.id) {
            setCurrentUser(updatedAuthor);
          }
        }
      } catch (err) {
        console.error('Failed to upvote post in database:', err);
      }
    }
  };

  // Upvote Reply
  const upvoteReply = async (postId: string, replyId: string) => {
    let updatedPost: ForumPost | undefined;
    let replyAuthorId = '';
    let diff = 0;

    setForumPosts((posts) =>
      posts.map((post) => {
        if (post.id === postId) {
          const updatedReplies = post.replies.map((reply) => {
            if (reply.id === replyId) {
              replyAuthorId = reply.authorId;
              const alreadyVoted = reply.votedBy.includes(currentUser.id);
              let newVotedBy = [...reply.votedBy];

              if (alreadyVoted) {
                newVotedBy = newVotedBy.filter((id) => id !== currentUser.id);
                diff = -1;
              } else {
                newVotedBy.push(currentUser.id);
                diff = 1;
              }

              return {
                ...reply,
                upvotes: reply.upvotes + diff,
                votedBy: newVotedBy
              };
            }
            return reply;
          });

          updatedPost = { ...post, replies: updatedReplies };
          return updatedPost;
        }
        return post;
      })
    );

    if (updatedPost) {
      try {
        await fetch(`/api/forum/${postId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost)
        });

        // Transfer karma to reply author
        const author = students.find((s) => s.id === replyAuthorId);
        if (author) {
          const updatedAuthor = { ...author, karma: author.karma + (diff * 5) };
          setStudents((all) => all.map((s) => (s.id === replyAuthorId ? updatedAuthor : s)));
          await syncStudentProfile(replyAuthorId, updatedAuthor);

          if (replyAuthorId === currentUser.id) {
            setCurrentUser(updatedAuthor);
          }
        }
      } catch (err) {
        console.error('Failed to upvote reply in database:', err);
      }
    }
  };

  // Update session notes
  const updateSessionNotes = async (sessionId: string, notes: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, notes } : s))
    );

    const sessionObj = sessions.find(s => s.id === sessionId);
    if (sessionObj) {
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...sessionObj, notes })
        });
      } catch (err) {
        console.error('Failed to sync session notes to database:', err);
      }
    }
  };

  // Update session whiteboard
  const updateSessionWhiteboard = async (sessionId: string, dataUrl: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, whiteboardData: dataUrl } : s))
    );

    const sessionObj = sessions.find(s => s.id === sessionId);
    if (sessionObj) {
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...sessionObj, whiteboardData: dataUrl })
        });
      } catch (err) {
        console.error('Failed to sync whiteboard to database:', err);
      }
    }
  };

  // Add session resource
  const addSessionResource = async (sessionId: string, title: string, url: string) => {
    const newResource: Resource = {
      title,
      url,
      addedBy: currentUser.id
    };

    let updatedSession: Session | undefined;

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          updatedSession = {
            ...s,
            resources: [...s.resources, newResource]
          };
          return updatedSession;
        }
        return s;
      })
    );

    if (updatedSession) {
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSession)
        });
      } catch (err) {
        console.error('Failed to add session resource in database:', err);
      }
    }
  };

  // Complete session & trigger review
  const completeSession = async (
    sessionId: string,
    partnerId: string,
    rating: number,
    reviewText: string
  ) => {
    // 1. Mark session as completed
    let targetSession: Session | undefined;
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          targetSession = { ...s, status: 'completed' };
          return targetSession;
        }
        return s;
      })
    );

    if (targetSession) {
      try {
        await fetch(`/api/sessions/${sessionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(targetSession)
        });
      } catch (err) {
        console.error('Failed to complete session in database:', err);
      }
    }

    // 2. Add review to partner
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      reviewerName: currentUser.name,
      rating,
      comment: reviewText,
      date: new Date().toISOString().split('T')[0]
    };

    const partner = students.find((s) => s.id === partnerId);
    if (partner) {
      const updatedReviews = [newReview, ...partner.reviews];
      const averageRating =
        updatedReviews.reduce((sum, rev) => sum + rev.rating, 0) /
        updatedReviews.length;

      // Award Karma points to partner for completing the exchange (e.g. +50 Karma)
      const newKarma = partner.karma + 50 + (rating >= 4.5 ? 20 : 0);

      const updatedPartner = {
        ...partner,
        reviews: updatedReviews,
        rating: parseFloat(averageRating.toFixed(1)),
        karma: newKarma
      };

      setStudents((all) => all.map((s) => (s.id === partnerId ? updatedPartner : s)));
      await syncStudentProfile(partnerId, updatedPartner);
    }

    // 3. Award Karma to the current user as well for teaching (+50 Karma)
    const extraKarma = 50;
    const totalKarma = currentUser.karma + extraKarma;

    // Check if new badges should be awarded based on karma thresholds
    const newBadges = [...currentUser.badges];
    if (totalKarma >= 300 && !newBadges.includes('Super Tutee')) {
      newBadges.push('Super Tutee');
    }
    if (totalKarma >= 500 && !newBadges.includes('Mentor Star')) {
      newBadges.push('Mentor Star');
    }

    await updateProfile({ karma: totalKarma, badges: newBadges });

    // Set request status to completed
    const activeSession = sessions.find((s) => s.id === sessionId);
    if (activeSession) {
      let targetReq: ExchangeRequest | undefined;
      setRequests((prev) =>
        prev.map((r) => {
          if (r.id === activeSession.requestId) {
            targetReq = { ...r, status: 'completed' };
            return targetReq;
          }
          return r;
        })
      );

      if (targetReq) {
        try {
          await fetch(`/api/requests/${activeSession.requestId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(targetReq)
          });
        } catch (err) {
          console.error('Failed to complete request in database:', err);
        }
      }
    }

    setActiveSessionId(null);
    setCurrentView('dashboard');
  };

  // Message chat history loader
  const loadMessages = async (partnerId: string) => {
    try {
      const res = await fetch(`/api/messages/${currentUser.id}/${partnerId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  // Message chat sender
  const sendMessage = async (receiverId: string, content: string) => {
    const newMsg: Message = {
      senderId: currentUser.id,
      receiverId,
      content,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg)
      });
    } catch (err) {
      console.error('Failed to save message to database:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        students,
        requests,
        sessions,
        forumPosts,
        messages,
        currentView,
        activeSessionId,
        setCurrentView,
        setActiveSessionId,
        updateProfile,
        sendRequest,
        respondToRequest,
        createForumPost,
        replyToPost,
        upvotePost,
        upvoteReply,
        completeSession,
        updateSessionNotes,
        updateSessionWhiteboard,
        loadMessages,
        sendMessage,
        addSessionResource
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
