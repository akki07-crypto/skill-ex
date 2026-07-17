import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Trigger nodemon file reload comment
// Import Mongoose Models
import Student from './models/Student';
import Request from './models/Request';
import Session from './models/Session';
import Forum from './models/Forum';
import Message from './models/Message';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';
console.log('Connecting to MongoDB at:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    await seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// --- SEED DATABASE ROUTINE ---
async function seedDatabase() {
  try {
    const studentCount = await Student.countDocuments();
    if (studentCount > 0) {
      console.log('Database already seeded with students.');
      return;
    }

    console.log('Seeding initial database data...');

    // Seed Students
    const INITIAL_STUDENTS = [
      {
        id: 'user-current',
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        bio: 'CS sophomore passionate about full-stack web development and cloud computing. Always down to trade code tutorials for design hacks or language practice!',
        major: 'Computer Science',
        karma: 280,
        skillsToTeach: [
          { name: 'Python Programming', category: 'Programming', level: 'Expert' },
          { name: 'React & Vite', category: 'Programming', level: 'Intermediate' },
          { name: 'SQL Databases', category: 'Programming', level: 'Intermediate' }
        ],
        skillsToLearn: ['UI/UX Design', 'Public Speaking', 'Spanish Conversation'],
        reviews: [
          {
            id: 'rev-1',
            reviewerName: 'Elena Chen',
            rating: 5,
            comment: 'Alex explained SQL joins so clearly! Super patient and structured. Looking forward to our next session.',
            date: '2026-07-10'
          }
        ],
        rating: 5.0,
        badges: ['Code Starter', 'Problem Solver']
      },
      {
        id: 'user-elena',
        name: 'Elena Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        bio: 'Product Design senior. I craft sleek mobile layouts and prototype in Figma. Eager to level up my backend python skills for my capstone project!',
        major: 'Interaction Design',
        karma: 1250,
        skillsToTeach: [
          { name: 'UI/UX Design', category: 'Design', level: 'Expert' },
          { name: 'Figma Prototyping', category: 'Design', level: 'Expert' },
          { name: 'HTML & CSS Styling', category: 'Programming', level: 'Expert' }
        ],
        skillsToLearn: ['Python Programming', 'Machine Learning', 'Japanese for Beginners'],
        reviews: [
          {
            id: 'rev-2',
            reviewerName: 'Alex Rivera',
            rating: 5,
            comment: 'Elena is a layout goddess! She simplified color theory and visual hierarchies in just 45 minutes.',
            date: '2026-07-12'
          },
          {
            id: 'rev-3',
            reviewerName: 'Marcus Vance',
            rating: 4.8,
            comment: 'Helped me refine my deck designs. Spot on feedback!',
            date: '2026-06-28'
          }
        ],
        rating: 4.9,
        badges: ['Design Guru', 'Top Mentor', 'Community Hero']
      },
      {
        id: 'user-marcus',
        name: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        bio: 'Communications major and Toastmasters regular. Can help you polish pitch decks, conquer stage fright, and structure arguments.',
        major: 'Communications',
        karma: 850,
        skillsToTeach: [
          { name: 'Public Speaking', category: 'Academics', level: 'Expert' },
          { name: 'Pitch Deck Design', category: 'Design', level: 'Intermediate' },
          { name: 'Creative Writing', category: 'Academics', level: 'Expert' }
        ],
        skillsToLearn: ['React & Vite', 'Python Programming', 'Guitar Basics'],
        reviews: [
          {
            id: 'rev-4',
            reviewerName: 'Yuki Tanaka',
            rating: 5,
            comment: 'Helped me prepare for my thesis presentation. I felt so much more confident!',
            date: '2026-07-05'
          }
        ],
        rating: 5.0,
        badges: ['Orator', 'Feedback King']
      },
      {
        id: 'user-yuki',
        name: 'Yuki Tanaka',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        bio: 'International student from Tokyo studying statistics. Native Japanese speaker. Let\'s exchange languages or play some chess!',
        major: 'Mathematical Statistics',
        karma: 950,
        skillsToTeach: [
          { name: 'Japanese Conversation', category: 'Languages', level: 'Expert' },
          { name: 'Chess Tactics', category: 'Hobbies', level: 'Expert' },
          { name: 'Statistical Modeling', category: 'Academics', level: 'Intermediate' }
        ],
        skillsToLearn: ['English Accent Polish', 'React & Vite', 'SQL Databases'],
        reviews: [
          {
            id: 'rev-5',
            reviewerName: 'Sophia Rodriguez',
            rating: 4.7,
            comment: 'Amazing Japanese tutor. Structured and fun lessons!',
            date: '2026-07-01'
          }
        ],
        rating: 4.7,
        badges: ['Bilingual', 'Chess Grandmaster']
      },
      {
        id: 'user-sophia',
        name: 'Sophia Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        bio: 'Modern Languages major. Fluent in Spanish and French. I love traveling, exploring global cuisines, and playing guitar.',
        major: 'Modern Languages',
        karma: 620,
        skillsToTeach: [
          { name: 'Spanish Conversation', category: 'Languages', level: 'Expert' },
          { name: 'French for Beginners', category: 'Languages', level: 'Expert' },
          { name: 'Culinary Basics', category: 'Hobbies', level: 'Intermediate' }
        ],
        skillsToLearn: ['Guitar Basics', 'Chess Tactics', 'HTML & CSS Styling'],
        reviews: [
          {
            id: 'rev-6',
            reviewerName: 'Liam Carter',
            rating: 5,
            comment: 'We did a Spanish-Guitar exchange. Sophia is a natural teacher!',
            date: '2026-07-11'
          }
        ],
        rating: 5.0,
        badges: ['Polyglot', 'Good Vibe']
      },
      {
        id: 'user-liam',
        name: 'Liam Carter',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        bio: 'Music Technology major. I live in the studio. Happy to teach acoustic guitar, music production, or logic pro configurations.',
        major: 'Music Technology',
        karma: 480,
        skillsToTeach: [
          { name: 'Guitar Basics', category: 'Music', level: 'Expert' },
          { name: 'Music Production', category: 'Music', level: 'Expert' },
          { name: 'Logic Pro Basics', category: 'Music', level: 'Expert' }
        ],
        skillsToLearn: ['SQL Databases', 'UI/UX Design', 'Japanese Conversation'],
        reviews: [],
        rating: 4.5,
        badges: ['Melody Maker']
      }
    ];

    const INITIAL_REQUESTS = [
      {
        id: 'req-1',
        senderId: 'user-elena',
        receiverId: 'user-current',
        teachSkill: 'UI/UX Design',
        learnSkill: 'Python Programming',
        proposedDate: '2026-07-20',
        proposedTime: '14:00',
        agenda: 'First 45 mins: Review Elena\'s script. Next 45 mins: Wireframe Alex\'s dashboard.',
        status: 'pending'
      },
      {
        id: 'req-2',
        senderId: 'user-current',
        receiverId: 'user-marcus',
        teachSkill: 'React & Vite',
        learnSkill: 'Public Speaking',
        proposedDate: '2026-07-22',
        proposedTime: '11:00',
        agenda: 'Set up Vite boilerplate for Marcus\'s landing page; then practice slide presentation speech.',
        status: 'pending'
      }
    ];

    const INITIAL_SESSIONS = [
      {
        id: 'sess-1',
        requestId: 'req-3',
        studentAId: 'user-sophia',
        studentBId: 'user-current',
        teachSkill: 'Spanish Conversation',
        learnSkill: 'SQL Databases',
        scheduledTime: '2026-07-18 at 15:30',
        status: 'upcoming',
        notes: 'Priorities: Pronunciation practice & basic SQL commands (SELECT, WHERE, JOIN).',
        whiteboardData: '',
        resources: [
          { title: 'W3Schools SQL Joins Tutorial', url: 'https://www.w3schools.com/sql/sql_join.asp', addedBy: 'user-current' }
        ]
      }
    ];

    const INITIAL_FORUM = [
      {
        id: 'post-1',
        authorId: 'user-elena',
        authorName: 'Elena Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        title: 'How do you structure React components for scale?',
        content: 'Hey everyone! I am working on a larger dashboard client and finding that keeping all code in App.tsx is slowing me down. What folders do you usually create? Components, Hooks, Assets? Any tips on atomic design patterns would be appreciated!',
        tags: ['React', 'Web Dev', 'Design Systems'],
        upvotes: 18,
        votedBy: ['user-marcus', 'user-liam'],
        createdAt: '2026-07-15T09:30:00Z',
        replies: [
          {
            id: 'rep-1',
            authorId: 'user-current',
            authorName: 'Alex Rivera',
            authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
            content: 'I usually organize mine by component type. E.g., src/components/common for reusable UI components (buttons, cards) and src/components/layout for sidebars, navbar. Then, keep views separate in a views/ or pages/ folder. This keeps things highly modular!',
            upvotes: 6,
            votedBy: ['user-elena'],
            createdAt: '2026-07-15T11:45:00Z'
          }
        ]
      },
      {
        id: 'post-2',
        authorId: 'user-liam',
        authorName: 'Liam Carter',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        title: 'Looking for a Spanish exchange partner!',
        content: 'Hey! I\'m a complete beginner in Spanish but am highly motivated to learn. In exchange, I can teach you guitar chords, scaling, or basic music production in Ableton/Logic Pro. Let me know if you want to trade lessons!',
        tags: ['Spanish', 'Guitar', 'Music', 'Languages'],
        upvotes: 8,
        votedBy: [],
        createdAt: '2026-07-16T14:15:00Z',
        replies: []
      }
    ];

    const INITIAL_MESSAGES = [
      { senderId: 'user-elena', receiverId: 'user-current', content: 'Hey Alex! Saw you can teach SQL, let\'s chat!', createdAt: new Date(Date.now() - 1000 * 60 * 10) }
    ];

    await Student.insertMany(INITIAL_STUDENTS);
    await Request.insertMany(INITIAL_REQUESTS);
    await Session.insertMany(INITIAL_SESSIONS);
    await Forum.insertMany(INITIAL_FORUM);
    await Message.insertMany(INITIAL_MESSAGES);

    console.log('Database successfully seeded.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// --- API ENDPOINT ROUTES ---

// 1. Student routes
app.get('/api/students', async (req, res) => {
  try {
    const list = await Student.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students list' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const updated = await Student.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student profile' });
  }
});

// 2. Request routes
app.get('/api/requests', async (req, res) => {
  try {
    const list = await Request.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.json(newRequest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  try {
    const updated = await Request.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

// 3. Session routes
app.get('/api/sessions', async (req, res) => {
  try {
    const list = await Session.find({});
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/api/sessions', async (req, res) => {
  try {
    const newSession = new Session(req.body);
    await newSession.save();
    res.json(newSession);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.put('/api/sessions/:id', async (req, res) => {
  try {
    const updated = await Session.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

// 4. Forum routes
app.get('/api/forum', async (req, res) => {
  try {
    const list = await Forum.find({}).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
});

app.post('/api/forum', async (req, res) => {
  try {
    const newPost = new Forum(req.body);
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

app.put('/api/forum/:id', async (req, res) => {
  try {
    const updated = await Forum.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// 5. Message (Chat) routes
app.get('/api/messages/:userA/:userB', async (req, res) => {
  try {
    const { userA, userB } = req.params;
    const history = await Message.find({
      $or: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA }
      ]
    }).sort({ createdAt: 1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch message history' });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    await newMsg.save();
    res.json(newMsg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

import path from 'path';

// Serve static files from the React frontend build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for React Router routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Express API Server running on port ${PORT}`);
});
