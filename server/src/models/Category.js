import mongoose from 'mongoose'
import slugify from 'slugify'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters long'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: [/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color']
  },
  icon: {
    type: String,
    default: 'folder'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Generate slug before saving
categorySchema.pre('save', function(next) {
  if (!this.isModified('name')) {
    return next()
  }
  
  this.slug = slugify(this.name, { 
    lower: true, 
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })
  
  next()
})

// Virtual for post count
categorySchema.virtual('postCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'category',
  count: true
})

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
})

// Index for better query performance
categorySchema.index({ slug: 1 })
categorySchema.index({ parent: 1 })
categorySchema.index({ isActive: 1 })

// Static method to find active categories
categorySchema.statics.findActive = function() {
  return this.find({ isActive: true })
}

// Static method to find root categories (no parent)
categorySchema.statics.findRoots = function() {
  return this.find({ parent: null, isActive: true })
}

const Category = mongoose.model('Category', categorySchema)

export default Category 