import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { postsApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { 
  FileText, 
  Save, 
  ArrowLeft, 
  User, 
  Calendar,
  Clock,
  Lightbulb,
  Sparkles,
  Tag,
  Eye,
  Heart
} from 'lucide-react'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
  })

  const createMutation = useMutation(
    (data) => postsApi.create(data),
    {
      onSuccess: (data) => {
        toast.success('Post created successfully!')
        queryClient.invalidateQueries(['posts'])
        navigate('/posts')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create post')
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    createMutation.mutate(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getWordCount = () => {
    return formData.content.split(' ').filter(word => word.length > 0).length
  }

  const getReadTime = () => {
    const wordsPerMinute = 200
    const words = getWordCount()
    const minutes = Math.ceil(words / wordsPerMinute)
    return minutes
  }

  const categories = [
    { value: '', label: 'Select Category', color: 'from-gray-500 to-gray-600' },
    { value: 'technology', label: 'Technology', color: 'from-blue-500 to-indigo-500' },
    { value: 'lifestyle', label: 'Lifestyle', color: 'from-green-500 to-emerald-500' },
    { value: 'travel', label: 'Travel', color: 'from-purple-500 to-pink-500' },
    { value: 'food', label: 'Food', color: 'from-orange-500 to-red-500' },
    { value: 'health', label: 'Health', color: 'from-teal-500 to-cyan-500' }
  ]

  const writingTips = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Be Authentic',
      description: 'Write from your own experience and perspective'
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Engage Readers',
      description: 'Use compelling headlines and clear structure'
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Add Value',
      description: 'Provide useful information or insights'
    }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="card p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to create a post</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => navigate('/posts')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Create <span className="gradient-text">Post</span>
                </h1>
                <p className="text-xl text-gray-600">Share your thoughts with the community</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter your post title..."
                    className="input text-lg font-medium"
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {formData.title.length}/100 characters
                    </span>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content Input */}
                <div>
                  <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                    Post Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your post content here..."
                    rows={12}
                    className="input resize-none"
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {getReadTime()} min read
                      </span>
                      <span>{getWordCount()} words</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={createMutation.isLoading}
                    className="glow"
                  >
                    {createMutation.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Publish Post
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Author Info
              </h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                  <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).getFullYear()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Writing Tips
              </h3>
              <div className="space-y-4">
                {writingTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white">
                      {tip.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{tip.title}</h4>
                      <p className="text-sm text-gray-600">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Preview */}
            {formData.title && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Preview
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 line-clamp-2">
                      {formData.title}
                    </h4>
                  </div>
                  {formData.category && (
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 capitalize">
                        {categories.find(c => c.value === formData.category)?.label}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-600 line-clamp-3">
                    {formData.content}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{getWordCount()} words</span>
                    <span>{getReadTime()} min read</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost
