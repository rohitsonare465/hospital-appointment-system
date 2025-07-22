const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d'
    });
};

exports.register = async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        const { name, email, password, role, specialization, phoneNumber } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role || !phoneNumber) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide all required fields: name, email, password, role, phoneNumber'
            });
        }

        // Validate doctor specialization
        if (role === 'doctor' && !specialization) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide specialization for doctor role'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            role,
            specialization: role === 'doctor' ? specialization : undefined,
            phoneNumber
        });

        // Remove password from output
        user.password = undefined;

        // Create token
        const token = signToken(user._id);

        console.log('User created successfully:', user._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Check if user exists and password is correct
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect email or password'
            });
        }

        // Remove password from output
        user.password = undefined;

        // Create token
        const token = signToken(user._id);

        console.log('User logged in successfully:', user._id);

        res.status(200).json({
            status: 'success',
            token,
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};

// Protect middleware for authentication
exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check if it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verification token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'error',
                message: 'The user belonging to this token does no longer exist.'
            });
        }

        // Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
            status: 'error',
            message: 'Invalid token. Please log in again!'
        });
    }
};
