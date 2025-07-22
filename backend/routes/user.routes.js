const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../controllers/auth.controller');

// Apply authentication middleware to all user routes
router.use(protect);

// GET /api/users - Get all users with optional filtering
router.get('/', userController.getAllUsers);

// GET /api/users/doctors - Get all doctors
router.get('/doctors', userController.getAllDoctors);

// GET /api/users/patients - Get all patients
router.get('/patients', userController.getAllPatients);

// GET /api/users/stats - Get user statistics
router.get('/stats', userController.getUserStats);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getUserById);

module.exports = router;
