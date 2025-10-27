import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app, httpServer } from '../server.js';

describe('Social Network API Tests', () => {
  
  afterAll((done) => {
    // Close server gracefully
    if (httpServer.listening) {
      httpServer.close(done);
    } else {
      done();
    }
  });

  // ========== USER TESTS ==========
  
  describe('User API', () => {
    test('GET /api/users - should return all users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('POST /api/login - should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'catmeow@gmail.com', password: 'meow2005' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).not.toHaveProperty('password');
    });

    test('POST /api/login - should fail with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'catmeow@gmail.com', password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('POST /api/register - should create new user', async () => {
      const timestamp = Date.now();
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        middleName: '',
        password: 'testpass123',
        email: `test${timestamp}@example.com`,
        dateOfBirth: '2000-01-01',
        role: 'user',
        status: 'active',
        photo: ''
      };

      const response = await request(app)
        .post('/api/register')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', newUser.email);
      expect(response.body).not.toHaveProperty('password');
    });

    test('GET /api/users/:id - should return user by id', async () => {
      const response = await request(app).get('/api/users/6');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 6);
      expect(response.body).not.toHaveProperty('password');
    });

    test('GET /api/users/:id - should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/99999');
      expect(response.status).toBe(404);
    });
  });

  // ========== POST TESTS ==========
  
  describe('Post API', () => {
    test('GET /api/posts - should return all posts', async () => {
      const response = await request(app).get('/api/posts');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/posts - should create new post', async () => {
      const newPost = {
        userId: 6,
        content: 'Test post content'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(newPost);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('content');
      expect(response.body.content).toContain(newPost.content);
      expect(response.body).toHaveProperty('userId', newPost.userId);
    });

    test('POST /api/posts - should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/posts')
        .send({ userId: 6 });
      
      expect(response.status).toBe(400);
    });

    test('GET /api/posts/feed/:userId - should return user feed', async () => {
      const response = await request(app).get('/api/posts/feed/6');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ========== FRIEND TESTS ==========
  
  describe('Friend API', () => {
    test('POST /api/users/:id/friends - should add friend bidirectionally', async () => {
      // Добавляем user 7 в друзья к user 8
      const response = await request(app)
        .post('/api/users/8/friends')
        .send({ friendId: 7 });
      
      expect(response.status).toBe(200);
      expect(response.body.friends).toContain(7);

      // Проверяем, что user 8 тоже добавился в друзья к user 7
      const user7Response = await request(app).get('/api/users/7');
      expect(user7Response.body.friends).toContain(8);
    });

    test('DELETE /api/users/:id/friends/:friendId - should remove friend bidirectionally', async () => {
      // Сначала добавляем друзей
      await request(app)
        .post('/api/users/7/friends')
        .send({ friendId: 8 });

      // Удаляем друга
      const response = await request(app)
        .delete('/api/users/7/friends/8');
      
      expect(response.status).toBe(200);
      expect(response.body.friends).not.toContain(8);

      // Проверяем, что user 7 тоже удалился из друзей user 8
      const user8Response = await request(app).get('/api/users/8');
      expect(user8Response.body.friends).not.toContain(7);
    });
  });
});

