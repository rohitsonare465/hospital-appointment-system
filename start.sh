#!/bin/bash

echo "🚀 Starting Hospital Appointment System"
echo "======================================"

# Check if backend is already running
if curl -s http://localhost:50001/api/test > /dev/null 2>&1; then
    echo "⚠️  Backend is already running on port 50001"
else
    echo "🔧 Starting backend server..."
    cd backend && npm run dev &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
fi

# Wait a moment for backend to start
sleep 3

# Check if frontend is already running
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "⚠️  Frontend is already running on port 3000"
else
    echo "🎨 Starting frontend server..."
    cd frontend && npm start &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
fi

echo ""
echo "✅ Hospital Appointment System is starting up!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:50001"
echo ""
echo "🔐 Test Credentials:"
echo "   Doctor:  test.doctor@test.com / password123"  
echo "   Patient: test.patient@test.com / password123"
echo ""
echo "📝 To stop the services:"
echo "   Press Ctrl+C in each terminal"
echo "   Or use: pkill -f 'npm.*start|npm.*dev'"
