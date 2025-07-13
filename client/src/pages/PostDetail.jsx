import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { postsApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { FileText, Edit, Trash2, ArrowLeft, User, Calendar } from 'lucide-react'
import Button from '../components/Button'
import toast from 'react-hot-toast'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: post, isLoading, error } = useQuery(
    ['post', id],
    () => postsApi.getById(id),
    {
      retry: 1,
    }
  )

  const deleteMutation = useMutation(
    () => postsApi.delete(id),
    {
      onSuccess: () => {
        toast.success('Post deleted successfully')
        queryClient.invalidateQueries(['posts'])
        navigate('/posts')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete post')
      },
    }
  )

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">Error loading post: {error.message}</p>
          <Link to="/posts">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Post not found</p>
          <Link to="/posts">
            <Button>Back to Posts</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = user && post.author?._id === user._id

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          to="/posts" 
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Posts
        </Link>
      </div>

      {/* Post Header */}
      <div className="card p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-gray-500 capitalize">
              {post.category?.name || 'Uncategorized'}
            </span>
          </div>
          
          {isAuthor && (
            <div className="flex items-center space-x-2">
              <Link to={`/posts/${id}/edit`}>
                <Button size="sm" variant="secondary">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button 
                size="sm" 
                variant="danger"
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{post.author?.username || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {post.content}
          </div>
        </div>
      </div>

      {/* Author Info */}
      {post.author && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-primary-600">
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author.username}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(post.author.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetail 