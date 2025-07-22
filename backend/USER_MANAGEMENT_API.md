# User Management Feature - API Documentation

## Overview
This document describes the User Management feature that allows viewing all patients and doctors in the Hospital Appointment System.

## Base URL
```
http://localhost:5000/api/users
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Get All Users
Get all users with optional filtering, searching, and pagination.

**Endpoint:** `GET /api/users`

**Query Parameters:**
- `role` (optional): Filter by user role ('doctor' or 'patient')
- `search` (optional): Search by name, email, specialization, or phone
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/users?role=doctor&search=cardiology&page=1&limit=5" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "60f7b1b3b3b3b3b3b3b3b3b3",
        "name": "Dr. Sarah Johnson",
        "email": "sarah.johnson@hospital.com",
        "role": "doctor",
        "specialization": "Cardiology",
        "phoneNumber": "1234567890",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalUsers": 15,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 2. Get All Doctors
Get all doctors with searching and pagination.

**Endpoint:** `GET /api/users/doctors`

**Query Parameters:**
- `search` (optional): Search by name, email, or specialization
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/users/doctors?search=cardiology" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "_id": "60f7b1b3b3b3b3b3b3b3b3b3",
        "name": "Dr. Sarah Johnson",
        "email": "sarah.johnson@hospital.com",
        "role": "doctor",
        "specialization": "Cardiology",
        "phoneNumber": "1234567890",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalDoctors": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### 3. Get All Patients
Get all patients with searching and pagination.

**Endpoint:** `GET /api/users/patients`

**Query Parameters:**
- `search` (optional): Search by name, email, or phone number
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/users/patients?search=john" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "_id": "60f7b1b3b3b3b3b3b3b3b3b4",
        "name": "John Smith",
        "email": "john.smith@email.com",
        "role": "patient",
        "phoneNumber": "2234567890",
        "createdAt": "2024-01-16T14:20:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalPatients": 7,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### 4. Get User Statistics
Get overall user statistics for the dashboard.

**Endpoint:** `GET /api/users/stats`

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/users/stats" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 15,
    "totalDoctors": 8,
    "totalPatients": 7,
    "newUsers": 3
  }
}
```

### 5. Get User by ID
Get detailed information about a specific user.

**Endpoint:** `GET /api/users/:id`

**Parameters:**
- `id` (required): User ID

**Example Request:**
```bash
curl -X GET "http://localhost:5000/api/users/60f7b1b3b3b3b3b3b3b3b3b3" \
  -H "Authorization: Bearer your-jwt-token"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60f7b1b3b3b3b3b3b3b3b3b3",
      "name": "Dr. Sarah Johnson",
      "email": "sarah.johnson@hospital.com",
      "role": "doctor",
      "specialization": "Cardiology",
      "phoneNumber": "1234567890",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## Error Responses

### Authentication Error (401)
```json
{
  "status": "error",
  "message": "You are not logged in! Please log in to get access."
}
```

### User Not Found (404)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Error fetching users",
  "error": "Database connection failed"
}
```

## Features
- **Authentication**: All endpoints require valid JWT authentication
- **Role-based filtering**: Filter users by doctor or patient role
- **Search functionality**: Search across name, email, specialization, and phone
- **Pagination**: Efficient pagination with page size control
- **Statistics**: Get overview statistics for dashboard displays
- **Individual user lookup**: Get detailed information about specific users

## Rate Limiting
Currently no rate limiting is implemented, but it's recommended for production use.

## Testing
Use the provided test data by running:
```bash
cd backend
npm run seed
```

Test credentials:
- Doctor: `sarah.johnson@hospital.com / password123`
- Patient: `john.smith@email.com / password123`
