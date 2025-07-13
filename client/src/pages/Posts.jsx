import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { postsApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Heart,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Tag
} from 'lucide-react'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const Posts = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const { data: posts, isLoading, error, refetch } = useQuery(
    ['posts', searchTerm, selectedCategory, sortBy],
    () => postsApi.getAll({ 
      search: searchTerm, 
      category: selectedCategory,
      sort: sortBy 
    }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const categories = [
    { id: '', name: 'All Categories', color: 'from-gray-500 to-gray-600' },
    { id: 'technology', name: 'Technology', color: 'from-blue-500 to-indigo-500' },
    { id: 'lifestyle', name: 'Lifestyle', color: 'from-green-500 to-emerald-500' },
    { id: 'travel', name: 'Travel', color: 'from-purple-500 to-pink-500' },
    { id: 'food', name: 'Food', color: 'from-orange-500 to-red-500' },
    { id: 'health', name: 'Health', color: 'from-teal-500 to-cyan-500' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: <Clock className="w-4 h-4" /> },
    { value: 'oldest', label: 'Oldest First', icon: <Calendar className="w-4 h-4" /> },
    { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'title', label: 'Alphabetical', icon: <FileText className="w-4 h-4" /> }
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getReadTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Explore <span className="gradient-text">Posts</span>
              </h1>
              <p className="text-xl text-gray-600">
                Discover amazing content from our community
              </p>
            </div>
            {user && (
              <Link to="/posts/create">
                <Button size="lg" className="glow">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Post
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input pl-10"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input pl-10"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post._id} className="card-hover group">
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500 capitalize">
                        {post.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{getReadTime(post.content)}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {post.author?.username || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Link to={`/posts/${post._id}`}>
                    <Button variant="secondary" size="sm" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Be the first to create a post and share your thoughts with the community!'
                }
              </p>
              {user && (
                <Link to="/posts/create">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Post
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Posts 