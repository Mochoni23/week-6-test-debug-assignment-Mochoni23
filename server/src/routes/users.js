import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import Post from '../models/Post.js'
import { auth, admin } from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (admin)
router.get('/', auth, admin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query

    // Build query
    const query = {}
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    if (role) {
      query.role = role
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .populate('postCount')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean()

    // Get total count
    const total = await User.countDocuments(query)

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (admin or self)
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('postCount')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if user can view this profile
    const isSelf = req.user._id.toString() === req.params.id
    const isAdmin = req.user.role === 'admin'
    
    if (!isSelf && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   GET /api/users/:id/posts
// @desc    Get posts by user
// @access  Public
router.get('/:id/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    // Check if user exists
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)

    // Get posts
    const posts = await Post.find({ 
      author: req.params.id,
      status: 'published'
    })
      .populate('category', 'name color')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean()

    // Get total count
    const total = await Post.countDocuments({ 
      author: req.params.id,
      status: 'published'
    })

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    console.error('Get user posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
// @access  Private (admin)
router.put('/:id', auth, admin, [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const { username, email, role, isActive } = req.body
    const updateData = {}

    // Check if username is being updated and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        })
      }
      updateData.username = username
    }

    // Check if email is being updated and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        })
      }
      updateData.email = email
    }

    // Update role and status
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
// @access  Private (admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      })
    }

    // Delete user's posts
    await Post.deleteMany({ author: req.params.id })

    // Delete user
    await User.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'User and associated posts deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

export default router 