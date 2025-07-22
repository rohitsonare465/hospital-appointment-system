const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:50001', 'http://127.0.0.1:50001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Server is working!', 
        timestamp: new Date().toISOString(),
        cors: 'enabled'
    });
});

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const appointmentRoutes = require('./routes/appointment.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-appointment-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Function to start server
const startServer = (port) => {
    try {
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is busy, trying port ${parseInt(port) + 1}`);
                startServer(parseInt(port) + 1);
            } else {
                console.error('Server error:', err);
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

// Start the server
startServer(PORT);

module.exports = app; // For testing purposes
