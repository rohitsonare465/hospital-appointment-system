# Hospital Appointment System

A comprehensive hospital appointment management system with separate frontend and backend services.

## Project Structure

```
hospital-appointment-system/
├── frontend/          # React.js frontend application
├── backend/           # Node.js/Express backend API
├── demo.sh           # Demo script for testing
└── README.md         # This file
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run seed          # Seed database with test data
npm run dev           # Start development server
```

### Frontend Setup
```bash
cd frontend
npm install
npm start             # Start development server
```

## Features

### 🏥 User Management System
- **View all users** (doctors and patients)
- **Advanced search and filtering**
- **Role-based access control**
- **Pagination support**
- **User statistics dashboard**

### 🔐 Authentication
- **JWT-based authentication**
- **Secure password hashing**
- **Protected routes**

### 🎨 Modern UI/UX
- **Material-UI components**
- **Responsive design**
- **Interactive user interface**
- **Real-time search**

### 🧪 Testing
- **Comprehensive backend API tests**
- **Frontend component tests**
- **Integration tests**

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users` - Get all users with filtering
- `GET /api/users/doctors` - Get all doctors
- `GET /api/users/patients` - Get all patients
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/:id` - Get user by ID

## Default Ports
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:50001

## Test Credentials
- **Doctor**: `test.doctor@test.com / password123`
- **Patient**: `test.patient@test.com / password123`

## Scripts

### Root Directory
```bash
./demo.sh             # Run comprehensive demo and tests
```

### Backend Scripts
```bash
npm run dev           # Start development server
npm start            # Start production server
npm test             # Run tests
npm run seed         # Seed database with test data
```

### Frontend Scripts
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run eject        # Eject from Create React App
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/hospital-appointment-system
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=90d
NODE_ENV=development
PORT=50001
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
