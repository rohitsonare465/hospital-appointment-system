# Hospital Appointment System - Backend

Node.js/Express backend API for the Hospital Appointment System with MongoDB integration.

## Features

- **User Management API** - CRUD operations for doctors and patients
- **JWT Authentication** - Secure token-based authentication
- **Advanced Search & Filtering** - Search across multiple fields
- **Pagination Support** - Efficient data retrieval
- **Role-based Access** - Doctor and patient role management
- **Comprehensive Testing** - Full test coverage with Jest

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Jest** - Testing framework

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables in .env
# MONGODB_URI=mongodb://localhost:27017/hospital-appointment-system
# JWT_SECRET=your-secret-key

# Seed database with test data
npm run seed

# Start development server
npm run dev
```

The API server will start at `http://localhost:50001`

## Project Structure

```
backend/
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   └── user.controller.js   # User management logic
├── models/
│   └── user.model.js        # User data model
├── routes/
│   ├── auth.routes.js       # Authentication routes
│   └── user.routes.js       # User management routes
├── tests/
│   ├── setup.js             # Test configuration
│   └── user.test.js         # API tests
├── server.js                # Main server file
├── seed.js                  # Database seeding script
└── package.json             # Dependencies and scripts
```

## Available Scripts

### `npm run dev`
Starts the server in development mode with nodemon for auto-restart.

### `npm start`
Starts the server in production mode.

### `npm test`
Runs the test suite using Jest.

### `npm run seed`
Seeds the database with sample users (doctors and patients).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### User Management (Protected Routes)
- `GET /api/users` - Get all users with filtering and pagination
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/patients` - Get all patients  
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID

### Test Route
- `GET /api/test` - Health check endpoint

## Authentication

All user management endpoints require JWT authentication:

```bash
Authorization: Bearer <your-jwt-token>
```

Get token by logging in:
```bash
curl -X POST http://localhost:50001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.doctor@test.com","password":"password123"}'
```

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (required, 'doctor' or 'patient'),
  specialization: String (required for doctors),
  phoneNumber: String (required),
  createdAt: Date (auto-generated)
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hospital-appointment-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=90d

# Server Configuration
NODE_ENV=development
PORT=50001

# Test Database (optional)
TEST_MONGODB_URI=mongodb://localhost:27017/hospital-appointment-system-test
```

## Testing

The backend includes comprehensive tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
- ✅ Authentication endpoints
- ✅ User management endpoints  
- ✅ Search and filtering
- ✅ Pagination
- ✅ Error handling
- ✅ Authorization middleware

## API Examples

### Register a New User
```bash
curl -X POST http://localhost:50001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Doe",
    "email": "john.doe@hospital.com",
    "password": "password123",
    "role": "doctor",
    "specialization": "Cardiology",
    "phoneNumber": "1234567890"
  }'
```

### Get All Users with Filtering
```bash
curl -X GET "http://localhost:50001/api/users?role=doctor&search=cardiology&page=1&limit=5" \
  -H "Authorization: Bearer <your-token>"
```

### Search Doctors by Specialization
```bash
curl -X GET "http://localhost:50001/api/users/doctors?search=neurology" \
  -H "Authorization: Bearer <your-token>"
```

## Database Seeding

The seed script creates sample data:

```bash
npm run seed
```

This creates:
- 6 sample doctors with different specializations
- 8 sample patients
- All with password: `password123`

### Test Credentials
- **Doctor**: `test.doctor@test.com / password123`
- **Patient**: `test.patient@test.com / password123`

## Error Handling

The API returns consistent error responses:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "status": "error", 
  "message": "You are not logged in! Please log in to get access."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error fetching users",
  "error": "Detailed error message"
}
```

## Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Mongoose schema validation
- **CORS Configuration** - Configured for frontend integration
- **Error Logging** - Comprehensive request/error logging

## Performance Optimizations

- **Database Indexing** - Email field indexed for faster queries
- **Pagination** - Efficient data loading with skip/limit
- **Field Selection** - Exclude sensitive data (passwords)
- **Query Optimization** - Optimized MongoDB queries

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Setup
1. Set up MongoDB (local or Atlas)
2. Configure environment variables
3. Run database migrations/seeding
4. Start the server

## Monitoring and Logging

The server includes:
- Request logging with timestamps
- Error logging with stack traces
- CORS logging for debugging
- Database connection monitoring

## Contributing

1. Follow RESTful API conventions
2. Add appropriate tests for new endpoints
3. Use consistent error handling
4. Document new environment variables
5. Update API documentation

## Troubleshooting

### Common Issues

**Database Connection**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/hospital-appointment-system
```

**Port Conflicts**
- Default port 50001, configured to auto-increment if busy
- Check PORT environment variable

**Authentication Issues**
- Verify JWT_SECRET is set in .env
- Check token expiration (default 90 days)
- Ensure Authorization header format: `Bearer <token>`
