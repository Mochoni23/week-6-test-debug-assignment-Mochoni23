import mongoose from 'mongoose'
import User from '../../../src/models/User.js'
import bcrypt from 'bcryptjs'

describe('User Model', () => {
  let testUser

  beforeEach(() => {
    testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })
  })

  describe('Validation', () => {
    it('should create a user with valid data', async () => {
      await expect(testUser.save()).resolves.toBeDefined()
      expect(testUser.username).toBe('testuser')
      expect(testUser.email).toBe('test@example.com')
      expect(testUser.password).toBeDefined()
      expect(testUser.role).toBe('user')
      expect(testUser.isActive).toBe(true)
    })

    it('should require username', async () => {
      testUser.username = undefined
      await expect(testUser.save()).rejects.toThrow()
    })

    it('should require email', async () => {
      testUser.email = undefined
      await expect(testUser.save()).rejects.toThrow()
    })

    it('should require password', async () => {
      testUser.password = undefined
      await expect(testUser.save()).rejects.toThrow()
    })

    it('should validate email format', async () => {
      testUser.email = 'invalid-email'
      await expect(testUser.save()).rejects.toThrow()
    })

    it('should enforce minimum username length', async () => {
      testUser.username = 'ab'
      await expect(testUser.save()).rejects.toThrow()
    })

    it('should enforce maximum username length', async () => {
      testUser.username = 'a'.repeat(31)
      await expect(testUser.save()).rejects.toThrow()
    })

    it('should enforce minimum password length', async () => {
      testUser.password = '12345'
      await expect(testUser.save()).rejects.toThrow()
    })

    it('should enforce unique username', async () => {
      await testUser.save()
      
      const duplicateUser = new User({
        username: 'testuser',
        email: 'another@example.com',
        password: 'password123'
      })
      
      await expect(duplicateUser.save()).rejects.toThrow()
    })

    it('should enforce unique email', async () => {
      await testUser.save()
      
      const duplicateUser = new User({
        username: 'anotheruser',
        email: 'test@example.com',
        password: 'password123'
      })
      
      await expect(duplicateUser.save()).rejects.toThrow()
    })
  })

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'password123'
      testUser.password = plainPassword
      
      await testUser.save()
      
      expect(testUser.password).not.toBe(plainPassword)
      expect(testUser.password).toMatch(/^\$2[aby]\$\d{1,2}\$/)
    })

    it('should not hash password if not modified', async () => {
      await testUser.save()
      const hashedPassword = testUser.password
      
      testUser.username = 'newusername'
      await testUser.save()
      
      expect(testUser.password).toBe(hashedPassword)
    })
  })

  describe('Password Comparison', () => {
    it('should compare password correctly', async () => {
      await testUser.save()
      
      const isMatch = await testUser.comparePassword('password123')
      expect(isMatch).toBe(true)
    })

    it('should return false for wrong password', async () => {
      await testUser.save()
      
      const isMatch = await testUser.comparePassword('wrongpassword')
      expect(isMatch).toBe(false)
    })
  })

  describe('Token Generation', () => {
    it('should generate auth token', async () => {
      await testUser.save()
      
      const token = testUser.generateAuthToken()
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
    })
  })

  describe('JSON Serialization', () => {
    it('should exclude password from JSON', async () => {
      await testUser.save()
      
      const userJson = testUser.toJSON()
      expect(userJson).not.toHaveProperty('password')
    })
  })

  describe('Virtual Fields', () => {
    it('should have postCount virtual', () => {
      expect(testUser.postCount).toBeDefined()
    })
  })
}) 