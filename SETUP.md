# MERN Testing Application Setup Guide

This guide will help you set up and run the complete MERN stack application with comprehensive testing.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
pnpm install

# Install client dependencies
cd client && pnpm install

# Install server dependencies
cd ../server && pnpm install

# Return to root
cd ..
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mern-testing

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 4. Run the Application

#### Development Mode (Recommended)
```bash
# Run both client and server concurrently
pnpm dev

# Or run them separately:
# Terminal 1 - Server
pnpm dev:server

# Terminal 2 - Client
pnpm dev:client
```

#### Production Mode
```bash
# Build the application
pnpm build

# Start the server
pnpm start
```

## Testing

### Run All Tests
```bash
pnpm test
```

### Run Tests with Coverage
```bash
pnpm test:coverage
```

### Run Tests in Watch Mode
```bash
pnpm test:watch
```

### Run Client Tests Only
```bash
pnpm test:client
```

### Run Server Tests Only
```bash
pnpm test:server
```

## Project Structure

```
mern-testing/
├── client/                 # React front-end
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── tests/         # Client-side tests
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                 # Express.js back-end
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration files
│   ├── tests/             # Server-side tests
│   └── package.json
├── package.json           # Root package.json
├── jest.config.js         # Jest configuration
└── README.md
```

## Features

### Client-Side Features
- ✅ React 18 with Vite
- ✅ Tailwind CSS v4
- ✅ React Router for navigation
- ✅ React Query for data fetching
- ✅ Axios for API communication
- ✅ React Hook Form for forms
- ✅ React Hot Toast for notifications
- ✅ Lucide React for icons
- ✅ Comprehensive unit tests
- ✅ Modern UI/UX design

### Server-Side Features
- ✅ Express.js with ES modules
- ✅ MongoDB with Mongoose
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation with express-validator
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Helmet for security
- ✅ Comprehensive API testing
- ✅ Error handling middleware

### Testing Features
- ✅ Jest testing framework
- ✅ React Testing Library
- ✅ Supertest for API testing
- ✅ MongoDB Memory Server for testing
- ✅ Coverage reporting
- ✅ Separate test configurations for client and server

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Posts
- `GET /api/posts` - Get all posts (with pagination/filtering)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Toggle like on post
- `POST /api/posts/:id/comments` - Add comment to post

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/posts` - Get posts by user
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## Demo Credentials

For testing purposes, you can use these demo credentials:

**Email:** demo@example.com  
**Password:** password123

Or register a new account through the application.

## Development Workflow

1. **Start Development Servers**
   ```bash
   pnpm dev
   ```

2. **Run Tests**
   ```bash
   pnpm test:watch
   ```

3. **Check Coverage**
   ```bash
   pnpm test:coverage
   ```

4. **Build for Production**
   ```bash
   pnpm build
   ```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the port in `.env` file
   - Kill the process using the port

2. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check your connection string
   - Verify network connectivity

3. **Dependencies Issues**
   - Clear node_modules and reinstall:
     ```bash
     rm -rf node_modules
     pnpm install
     ```

4. **Test Failures**
   - Ensure MongoDB Memory Server is working
   - Check test environment variables
   - Verify test database isolation

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is for educational purposes and testing demonstration. 