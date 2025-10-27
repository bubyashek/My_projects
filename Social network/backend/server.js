import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;
// Use admin module data files - configurable via ADMIN_DATA_DIR env variable
const ADMIN_DATA_DIR = process.env.ADMIN_DATA_DIR || path.join(__dirname, '../lab3/data');
const USERS_FILE = path.join(ADMIN_DATA_DIR, 'users.json');
const NEWS_FILE = path.join(ADMIN_DATA_DIR, 'news.json');
const FRIENDS_FILE = path.join(ADMIN_DATA_DIR, 'friends.json');

// Middleware
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Authorization,X-Requested-With,X-HTTP-Method-Override,Content-Type,Cache-Control,Accept"
}));
app.use(express.json({ limit: '10mb' }));

// Helper functions to read/write admin data
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

async function readNews() {
  try {
    const data = await fs.readFile(NEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading news:', error);
    return [];
  }
}

async function readFriends() {
  try {
    const data = await fs.readFile(FRIENDS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading friends:', error);
    return [];
  }
}

async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
}

async function writeNews(news) {
  try {
    await fs.writeFile(NEWS_FILE, JSON.stringify(news, null, 2));
  } catch (error) {
    console.error('Error writing news:', error);
  }
}

async function writeFriends(friends) {
  try {
    await fs.writeFile(FRIENDS_FILE, JSON.stringify(friends, null, 2));
  } catch (error) {
    console.error('Error writing friends:', error);
  }
}

// Helper: Map admin user to app user format
function mapAdminUserToAppUser(adminUser, friendsList = []) {
  const userFriends = friendsList
    .filter(f => f.userId === adminUser.id)
    .map(f => f.friendId);
  
  return {
    id: adminUser.id,
    username: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
    email: adminUser.email,
    isAdmin: adminUser.role === 'admin',
    photo: adminUser.photo || '',
    friends: userFriends,
    firstName: adminUser.firstName,
    lastName: adminUser.lastName,
    middleName: adminUser.middleName,
    dateOfBirth: adminUser.dateOfBirth,
    status: adminUser.status,
    createdAt: adminUser.dateOfBirth
  };
}

// Helper: Map admin news to app post format
function mapAdminNewsToAppPost(adminNews) {
  return {
    id: adminNews.id,
    userId: adminNews.userId,
    content: adminNews.title + '\n\n' + adminNews.content,
    image: adminNews.image,
    status: adminNews.status,
    createdAt: adminNews.createdAt
  };
}

// ========== USER ROUTES ==========

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await readUsers();
    const friends = await readFriends();
    
    const appUsers = users
      .filter(u => u.status === 'active' || u.status === 'unconfirmed')
      .map(u => mapAdminUserToAppUser(u, friends));
    
    res.json(appUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const users = await readUsers();
    const friends = await readFriends();
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(mapAdminUserToAppUser(user, friends));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, middleName, dateOfBirth, role, status, photo } = req.body;
    
    // Support both formats: old (username) and new (firstName/lastName)
    const userFirstName = firstName || (username ? username.split(' ')[0] : '');
    const userLastName = lastName || (username ? username.split(' ').slice(1).join(' ') : '');
    
    if (!email || !password || !userFirstName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const users = await readUsers();
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      firstName: userFirstName,
      lastName: userLastName,
      middleName: middleName || '',
      email,
      dateOfBirth: dateOfBirth || new Date().toISOString().split('T')[0],
      role: role || 'user',
      status: status || 'active',
      photo: photo || '',
      password
    };

    users.push(newUser);
    await writeUsers(users);

    const appUser = mapAdminUserToAppUser(newUser, []);
    res.status(201).json(appUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt:', { username, password: '***' });
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const users = await readUsers();
    const friends = await readFriends();
    
    console.log('📊 Total users in DB:', users.length);
    
    // Find user by email or firstName+lastName
    const user = users.find(u => {
      const fullName = `${u.firstName} ${u.lastName}`.trim();
      return u.email === username || fullName === username;
    });

    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ User found:', user.email, 'Expected password:', user.password);

    // Check password
    if (user.password && user.password !== password) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Login successful for:', user.email);
    res.json(mapAdminUserToAppUser(user, friends));
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Update user profile
app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { firstName, lastName, middleName, email, photo, dateOfBirth } = req.body;
    const users = await readUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('📝 Updating user profile:', { userId, updates: req.body });
    console.log('👤 Current user data:', { firstName: user.firstName, lastName: user.lastName, middleName: user.middleName, dateOfBirth: user.dateOfBirth });

    // Update only provided fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (middleName !== undefined) user.middleName = middleName;
    if (email !== undefined) user.email = email;
    if (photo !== undefined) user.photo = photo;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    
    await writeUsers(users);
    
    console.log('✅ User profile updated:', { userId, newData: { firstName: user.firstName, lastName: user.lastName, middleName: user.middleName, dateOfBirth: user.dateOfBirth } });
    res.json(mapAdminUserToAppUser(user, await readFriends()));
  } catch (error) {
    console.error('❌ Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Upload photo (legacy endpoint, use PUT /api/users/:id instead)
app.post('/api/users/:id/photo', async (req, res) => {
  try {
    const { photo } = req.body;
    const users = await readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.photo = photo;
    await writeUsers(users);
    
    res.json(mapAdminUserToAppUser(user, await readFriends()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// ========== POST/NEWS ROUTES ==========

// Get feed for specific user (user's posts + friends' posts)
app.get('/api/posts/feed/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const users = await readUsers();
    const friends = await readFriends();
    const news = await readNews();
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's friend IDs
    const friendIds = friends
      .filter(f => f.userId === userId)
      .map(f => f.friendId);
    
    console.log(`📰 Feed for user ${userId}, friends:`, friendIds);
    
    // Get posts from user and friends (only active)
    const feedPosts = news
      .filter(n => n.status === 'active' && (n.userId === userId || friendIds.includes(n.userId)))
      .map(n => mapAdminNewsToAppPost(n))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log(`✅ Returning ${feedPosts.length} posts for feed`);
    res.json(feedPosts);
  } catch (error) {
    console.error('❌ Feed error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const news = await readNews();
    
    // Only return active posts
    const appPosts = news
      .filter(n => n.status === 'active')
      .map(n => mapAdminNewsToAppPost(n));
    
    res.json(appPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create post
app.post('/api/posts', async (req, res) => {
  try {
    const { userId, content, image } = req.body;
    
    if (!userId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const news = await readNews();
    
    // Split content into title and body (first line as title)
    const lines = content.split('\n').filter(l => l.trim());
    const title = lines[0] || 'Новость';
    const body = lines.slice(1).join('\n') || content;
    
    const newNews = {
      id: news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1,
      userId,
      title,
      content: body,
      status: 'active',
      createdAt: new Date().toISOString(),
      image: image || undefined
    };

    news.push(newNews);
    await writeNews(news);

    const newPost = mapAdminNewsToAppPost(newNews);
    
    // Broadcast new post to all connected clients
    io.emit('newPost', newPost);
    console.log('📢 Broadcasting new post:', newPost.id);

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const news = await readNews();
    const postIndex = news.findIndex(n => n.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const deletedPostId = parseInt(req.params.id);
    news.splice(postIndex, 1);
    await writeNews(news);

    // Broadcast post deletion to all connected clients
    io.emit('postDeleted', deletedPostId);
    console.log('📢 Broadcasting post deletion:', deletedPostId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ========== FRIENDS ROUTES ==========

// Add friend (bidirectional)
app.post('/api/users/:id/friends', async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = parseInt(req.params.id);
    
    const users = await readUsers();
    const friends = await readFriends();
    
    const user = users.find(u => u.id === userId);
    const friend = users.find(u => u.id === friendId);
    
    if (!user || !friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add friendship (bidirectional)
    const existingFriendship1 = friends.find(f => f.userId === userId && f.friendId === friendId);
    const existingFriendship2 = friends.find(f => f.userId === friendId && f.friendId === userId);
    
    if (!existingFriendship1) {
      friends.push({ userId, friendId });
    }
    if (!existingFriendship2) {
      friends.push({ userId: friendId, friendId: userId });
    }

    await writeFriends(friends);

    res.json(mapAdminUserToAppUser(user, friends));
  } catch (error) {
    res.status(500).json({ error: 'Failed to add friend' });
  }
});

// Remove friend (bidirectional)
app.delete('/api/users/:id/friends/:friendId', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const friendId = parseInt(req.params.friendId);
    
    let friends = await readFriends();
    
    // Remove both directions
    friends = friends.filter(f => 
      !(f.userId === userId && f.friendId === friendId) &&
      !(f.userId === friendId && f.friendId === userId)
    );

    await writeFriends(friends);

    const users = await readUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(mapAdminUserToAppUser(user, friends));
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// ========== ERROR LOGGING ==========

// Error logging endpoint
app.post('/api/errors', async (req, res) => {
  try {
    const errorLog = {
      ...req.body,
      serverTimestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    };
    
    // Log to console
    console.error('🔴 Frontend Error:', errorLog);
    
    // You can save to file or database here
    // For now, just acknowledge receipt
    res.status(200).json({ message: 'Error logged successfully' });
  } catch (error) {
    console.error('Failed to log error:', error);
    res.status(500).json({ error: 'Failed to log error' });
  }
});

// ========== SOCKET.IO ==========

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('userOnline', (userId) => {
    console.log('👤 User online:', userId);
    socket.broadcast.emit('userStatusChange', { userId, status: 'online' });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Socket.IO is ready for connections`);
    console.log(`Using admin data from: ${ADMIN_DATA_DIR}`);
  });
}

export { app, httpServer };
