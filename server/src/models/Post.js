import mongoose from 'mongoose'
import slugify from 'slugify'

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters long']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  meta: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Generate slug before saving
postSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next()
  }
  
  this.slug = slugify(this.title, { 
    lower: true, 
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })
  
  // Generate excerpt if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...'
  }
  
  next()
})

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length
})

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length
})

// Virtual for reading time (estimated)
postSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200
  const wordCount = this.content.split(' ').length
  return Math.ceil(wordCount / wordsPerMinute)
})

// Index for better query performance
postSchema.index({ title: 'text', content: 'text' })
postSchema.index({ slug: 1 })
postSchema.index({ author: 1 })
postSchema.index({ category: 1 })
postSchema.index({ status: 1 })
postSchema.index({ createdAt: -1 })

// Static method to find published posts
postSchema.statics.findPublished = function() {
  return this.find({ status: 'published' })
}

// Instance method to increment views
postSchema.methods.incrementViews = function() {
  this.views += 1
  return this.save()
}

// Instance method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const likeIndex = this.likes.indexOf(userId)
  
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1)
  } else {
    this.likes.push(userId)
  }
  
  return this.save()
}

// Instance method to add comment
postSchema.methods.addComment = function(userId, content) {
  this.comments.push({
    user: userId,
    content: content.trim()
  })
  
  return this.save()
}

const Post = mongoose.model('Post', postSchema)

export default Post 