const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// промежуточное по
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Статические файлы: используются как в сборках Gulp, так и в сборках Webpack.
app.use('/gulp', express.static(path.join(__dirname, '../dist-gulp')));
app.use('/webpack', express.static(path.join(__dirname, '../dist-webpack')));
app.use('/public', express.static(path.join(__dirname, '../dist-gulp/public')));

// Вспомогательные функции для чтения/записи JSON-файлов
const readJSON = (filename) => {
  const filePath = path.join(__dirname, '../data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSON = (filename, data) => {
  const filePath = path.join(__dirname, '../data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// ============= USERS API =============

// Получить всех пользователей
app.get('/api/users', (req, res) => {
  try {
    const users = readJSON('users.json');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Поулчить пользователя по ID
app.get('/api/users/:id', (req, res) => {
  try {
    const users = readJSON('users.json');
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавить пользователя
app.post('/api/users', (req, res) => {
  try {
    const users = readJSON('users.json');
    
    // Сгенерировать новый ID
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    // создание нового пользователя
    const newUser = {
      id: newId,
      ...req.body
    };
    
    users.push(newUser);
    writeJSON('users.json', users);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить пользователя
app.put('/api/users/:id', (req, res) => {
  try {
    const users = readJSON('users.json');
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (index !== -1) {
      users[index] = { ...users[index], ...req.body, id: users[index].id };
      writeJSON('users.json', users);
      res.json(users[index]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить пользователя
app.delete('/api/users/:id', (req, res) => {
  try {
    const users = readJSON('users.json');
    const filteredUsers = users.filter(u => u.id !== parseInt(req.params.id));
    
    if (users.length !== filteredUsers.length) {
      writeJSON('users.json', filteredUsers);
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= FRIENDS API =============

// Получить всех друзей пользователя
app.get('/api/users/:id/friends', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = readJSON('users.json');
    const friends = readJSON('friends.json');
    
    const userFriends = friends
      .filter(f => f.userId === userId)
      .map(f => users.find(u => u.id === f.friendId))
      .filter(u => u !== undefined);
    
    res.json(userFriends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавить друга
app.post('/api/users/:id/friends', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { friendId } = req.body;
    const friends = readJSON('friends.json');
    
    // Проверка на уже добавленного друга
    const exists = friends.some(f => f.userId === userId && f.friendId === friendId);
    if (exists) {
      return res.status(400).json({ error: 'Friendship already exists' });
    }
    
    // Добавить друга(у обоих пользователей)
    friends.push({ userId, friendId });
    friends.push({ userId: friendId, friendId: userId });
    
    writeJSON('friends.json', friends);
    res.status(201).json({ message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить друга
app.delete('/api/users/:id/friends/:friendId', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const friendId = parseInt(req.params.friendId);
    const friends = readJSON('friends.json');
    
    // Удалить друга(у обоих пользователей)
    const filteredFriends = friends.filter(f => 
      !(f.userId === userId && f.friendId === friendId) &&
      !(f.userId === friendId && f.friendId === userId)
    );
    
    if (friends.length === filteredFriends.length) {
      return res.status(404).json({ error: 'Friendship not found' });
    }
    
    writeJSON('friends.json', filteredFriends);
    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= NEWS API =============

// Получить все новости
app.get('/api/news', (req, res) => {
  try {
    const news = readJSON('news.json');
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Создать новость
app.post('/api/news', (req, res) => {
  try {
    const news = readJSON('news.json');
    
    // Сгенерировать новый ID
    const newId = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1;
    
    // Создать новый экземпляр новости
    const newNews = {
      id: newId,
      ...req.body
    };
    
    news.push(newNews);
    writeJSON('news.json', news);
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Удалить новость
app.delete('/api/news/:id', (req, res) => {
  try {
    const news = readJSON('news.json');
    const filteredNews = news.filter(n => n.id !== parseInt(req.params.id));
    
    if (news.length === filteredNews.length) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    writeJSON('news.json', filteredNews);
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить новости друга пользователя
app.get('/api/users/:id/friends-news', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const friends = readJSON('friends.json');
    const news = readJSON('news.json');
    
    const friendIds = friends
      .filter(f => f.userId === userId)
      .map(f => f.friendId);
    
    const friendsNews = news
      .filter(n => friendIds.includes(n.userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(friendsNews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Обновить статус новости
app.put('/api/news/:id', (req, res) => {
  try {
    const news = readJSON('news.json');
    const index = news.findIndex(n => n.id === parseInt(req.params.id));
    
    if (index !== -1) {
      news[index] = { ...news[index], ...req.body, id: news[index].id };
      writeJSON('news.json', news);
      res.json(news[index]);
    } else {
      res.status(404).json({ error: 'News not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= HTML PAGES =============

// Обслуживание HTML-страниц (сборка Gulp)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist-gulp/users.html'));
});

app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist-gulp/users.html'));
});

app.get('/friends/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist-gulp/friends.html'));
});

app.get('/news/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist-gulp/news.html'));
});

// Страницы для Webpack сборки
app.get('/webpack-users', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist-webpack/users.html'));
});

app.get('/webpack-friends/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist-webpack/friends.html'));
});

app.get('/webpack-news/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist-webpack/news.html'));
});

// Использовать HTTPS, если есть сертификаты, в противном случае HTTP
const sslKeyPath = path.join(__dirname, '../ssl/key.pem');
const sslCertPath = path.join(__dirname, '../ssl/cert.pem');

if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
  const options = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
  };
  
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on https://localhost:${PORT}`);
    console.log(`Gulp build: https://localhost:${PORT}/users`);
    console.log(`Webpack build: https://localhost:${PORT}/webpack-users`);
  });
} else {
  console.log(' SSL certificates not found. Running HTTP server instead.');
  console.log('   To enable HTTPS, run: npm run generate-ssl');
  
  app.listen(PORT, () => {
    console.log(`HTTP Server running on http://localhost:${PORT}`);
    console.log(`Gulp build: http://localhost:${PORT}/users`);
    console.log(`Webpack build: http://localhost:${PORT}/webpack-users`);
  });
}

