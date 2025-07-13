import express from 'express'
import { body, validationResult } from 'express-validator'
import Post from '../models/Post.js'
import User from '../models/User.js'
import Category from '../models/Category.js'
import { auth, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// Validation rules
const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status')
]

// @route   GET /api/posts
// @desc    Get all posts with pagination and filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      author = '',
      status = 'published',
      sort = '-createdAt'
    } = req.query

    // Build query
    const query = {}
    
    // Status filter (only show published posts to non-authenticated users)
    if (req.user && req.user.role === 'admin') {
      query.status = status
    } else {
      query.status = 'published'
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Author filter
    if (author) {
      query.author = author
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const limitNum = parseInt(limit)

    // Execute query
    const posts = await Post.find(query)
      .populate('author', 'username')
      .populate('category', 'name color')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean()

    // Get total count for pagination
    const total = await Post.countDocuments(query)

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    res.json({
      success: true,
      data: posts,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    })
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profile')
      .populate('category', 'name color')
      .populate('comments.user', 'username')

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user can view this post
    if (post.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Increment views
    await post.incrementViews()

    res.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Get post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, postValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { title, content, category, tags, status = 'published' } = req.body

    // Create post
    const post = new Post({
      title,
      content,
      author: req.user._id,
      category: category || null,
      tags: tags || [],
      status
    })

    await post.save()

    // Populate author and category
    await post.populate('author', 'username')
    await post.populate('category', 'name color')

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (author or admin)
router.put('/:id', auth, postValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user can edit this post
    const isAuthor = post.author.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this post'
      })
    }

    const { title, content, category, tags, status } = req.body

    // Update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        category: category || null,
        tags: tags || [],
        status: isAdmin ? status : post.status // Only admins can change status
      },
      { new: true, runValidators: true }
    )
    .populate('author', 'username')
    .populate('category', 'name color')

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    })
  } catch (error) {
    console.error('Update post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (author or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    // Check if user can delete this post
    const isAuthor = post.author.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'
    
    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      })
    }

    await Post.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.error('Delete post error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   POST /api/posts/:id/like
// @desc    Toggle like on a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    await post.toggleLike(req.user._id)

    res.json({
      success: true,
      message: 'Like toggled successfully',
      data: {
        likes: post.likes,
        likeCount: post.likeCount
      }
    })
  } catch (error) {
    console.error('Toggle like error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', auth, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
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

    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      })
    }

    await post.addComment(req.user._id, req.body.content)

    // Populate the new comment
    await post.populate('comments.user', 'username')

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comments: post.comments,
        commentCount: post.commentCount
      }
    })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
})

export default router 