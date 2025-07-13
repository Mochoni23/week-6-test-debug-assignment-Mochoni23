import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Home as HomeIcon, 
  FileText, 
  Plus, 
  Users, 
  Sparkles,
  ArrowRight,
  Star,
  TrendingUp,
  Heart
} from 'lucide-react'
import Button from '../components/Button'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Create Posts',
      description: 'Share your thoughts and ideas with the community',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Connect',
      description: 'Build meaningful connections with other users',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Discover',
      description: 'Explore trending topics and fresh content',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Engage',
      description: 'Like, comment, and interact with posts',
      color: 'from-red-500 to-pink-500'
    }
  ]

  const stats = [
    { label: 'Active Users', value: '1,234', icon: <Users className="w-4 h-4" /> },
    { label: 'Total Posts', value: '5,678', icon: <FileText className="w-4 h-4" /> },
    { label: 'Daily Views', value: '12,345', icon: <TrendingUp className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="gradient-text">BlogHub</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A modern platform for sharing ideas, connecting with others, and building meaningful conversations. 
              Join our vibrant community today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button size="lg" className="glow">
                    <FileText className="w-5 h-5 mr-2" />
                    View Posts
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Link to="/posts/create">
                    <Button variant="secondary" size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Post
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button size="lg" className="glow">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary" size="lg">
                      Join Community
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold gradient-text mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text">BlogHub</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the next generation of social blogging with our cutting-edge features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card-hover p-6 text-center group">
              <div className="flex justify-center mb-4">
                <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="card p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-white shadow-lg">
              <Star className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already sharing their stories and connecting with others
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/posts">
                <Button size="lg" className="glow">
                  Explore Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="glow">
                    Sign Up Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Already have an account?
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/posts" className="card-hover p-8 text-center group">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FileText className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse Posts</h3>
            <p className="text-gray-600 mb-6">Discover amazing content from our community</p>
            <Button variant="secondary" size="sm">
              Explore Posts
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>

          {user && (
            <Link to="/posts/create" className="card-hover p-8 text-center group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Plus className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Post</h3>
              <p className="text-gray-600 mb-6">Share your thoughts with the world</p>
              <Button size="sm">
                Start Writing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}

          <div className="card-hover p-8 text-center group">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Community</h3>
            <p className="text-gray-600 mb-6">Connect with like-minded individuals</p>
            <Button variant="secondary" size="sm">
              Join Community
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 