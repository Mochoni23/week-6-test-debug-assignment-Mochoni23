import request from 'supertest'
import app from '../../src/app.js'
import User from '../../src/models/User.js'
import jwt from 'jsonwebtoken'

describe('Auth Routes', () => {
  let testUser

  beforeEach(async () => {
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })
    await testUser.save()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      }

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.user).toHaveProperty('username', userData.username)
      expect(res.body.user).toHaveProperty('email', userData.email)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).not.toHaveProperty('password')
    })

    it('should return error for duplicate email', async () => {
      const userData = {
        username: 'anotheruser',
        email: 'test@example.com', // Same email as testUser
        password: 'password123'
      }

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain('already registered')
    })

    it('should return error for duplicate username', async () => {
      const userData = {
        username: 'testuser', // Same username as testUser
        email: 'another@example.com',
        password: 'password123'
      }

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain('already taken')
    })

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({})

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.errors).toBeDefined()
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.user).toHaveProperty('username', 'testuser')
      expect(res.body).toHaveProperty('token')
    })

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain('Invalid credentials')
    })

    it('should return error for non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      }

      const res = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain('Invalid credentials')
    })
  })

  describe('GET /api/auth/me', () => {
    it('should get current user profile with valid token', async () => {
      const token = jwt.sign(
        { userId: testUser._id, email: testUser.email, role: testUser.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      )

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.user).toHaveProperty('username', 'testuser')
      expect(res.body.user).toHaveProperty('email', 'test@example.com')
    })

    it('should return error without token', async () => {
      const res = await request(app)
        .get('/api/auth/me')

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain('No token provided')
    })

    it('should return error with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain('Invalid token')
    })
  })
}) 