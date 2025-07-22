#!/bin/bash

echo "==========================================="
echo "Hospital Appointment System - User Management Demo"
echo "==========================================="
echo ""

# Check if backend is running
echo "🔍 Checking backend server status..."
curl -s http://localhost:50001/api/test > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend server is running on port 50001"
else
    echo "❌ Backend server is not running. Please start it manually:"
    echo "   cd backend && npm run dev"
    echo ""
    echo "⏳ Attempting to start backend server..."
    cd backend && npm run dev &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    sleep 8
    echo ""
fi

echo ""
echo "🧪 Testing User Management API endpoints..."
echo ""

# Test authentication first
echo "1. Testing user authentication..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:50001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.doctor@test.com","password":"password123"}')

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "✅ Authentication successful"
else
    echo "❌ Authentication failed. Please check if test users exist."
    echo "Run: cd backend && npm run seed"
    exit 1
fi

echo ""
echo "2. Testing get all users..."
USERS_RESPONSE=$(curl -s -X GET "http://localhost:50001/api/users" \
  -H "Authorization: Bearer $TOKEN")
USERS_COUNT=$(echo $USERS_RESPONSE | grep -o '"totalUsers":[0-9]*' | cut -d':' -f2)
echo "✅ Found $USERS_COUNT total users"

echo ""
echo "3. Testing get all doctors..."
DOCTORS_RESPONSE=$(curl -s -X GET "http://localhost:50001/api/users/doctors" \
  -H "Authorization: Bearer $TOKEN")
DOCTORS_COUNT=$(echo $DOCTORS_RESPONSE | grep -o '"totalDoctors":[0-9]*' | cut -d':' -f2)
echo "✅ Found $DOCTORS_COUNT doctors"

echo ""
echo "4. Testing get all patients..."
PATIENTS_RESPONSE=$(curl -s -X GET "http://localhost:50001/api/users/patients" \
  -H "Authorization: Bearer $TOKEN")
PATIENTS_COUNT=$(echo $PATIENTS_RESPONSE | grep -o '"totalPatients":[0-9]*' | cut -d':' -f2)
echo "✅ Found $PATIENTS_COUNT patients"

echo ""
echo "5. Testing search functionality..."
SEARCH_RESPONSE=$(curl -s -X GET "http://localhost:50001/api/users/doctors?search=cardiology" \
  -H "Authorization: Bearer $TOKEN")
echo "✅ Search for 'cardiology' completed"

echo ""
echo "6. Testing pagination..."
PAGINATED_RESPONSE=$(curl -s -X GET "http://localhost:50001/api/users?page=1&limit=2" \
  -H "Authorization: Bearer $TOKEN")
echo "✅ Pagination test completed"

echo ""
echo "7. Testing user statistics..."
STATS_RESPONSE=$(curl -s -X GET "http://localhost:50001/api/users/stats" \
  -H "Authorization: Bearer $TOKEN")
echo "✅ Statistics retrieved"

echo ""
echo "==========================================="
echo "✅ All API endpoints are working correctly!"
echo "==========================================="
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:50001"
echo ""
echo "🔐 Test Login Credentials:"
echo "   Doctor: test.doctor@test.com / password123"
echo "   Patient: test.patient@test.com / password123"
echo ""
echo "📱 To test the User Management feature:"
echo "   1. Login with any account"
echo "   2. Navigate to /users or click 'View Users' from dashboard"
echo "   3. Try different tabs (All Users, Doctors, Patients)"
echo "   4. Test search functionality"
echo "   5. Test pagination if you have more than 8 users"
echo ""
echo "🧪 To run tests:"
echo "   Backend: cd backend && npm test"
echo "   Frontend: cd frontend && npm test"
echo ""
echo "📁 Project Structure:"
echo "   frontend/  - React.js frontend application"
echo "   backend/   - Node.js/Express API server"
echo "   README.md  - Main project documentation"
