const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment,
    getDoctorAvailability,
    getAppointmentStats
} = require('../controllers/appointment.controller');

// Import auth middleware
const { protect } = require('../controllers/auth.controller');

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private (Patient only)
router.post('/', protect, createAppointment);

// @route   GET /api/appointments
// @desc    Get all appointments (filtered by user role)
// @access  Private
router.get('/', protect, getAllAppointments);

// @route   GET /api/appointments/stats
// @desc    Get appointment statistics
// @access  Private
router.get('/stats', protect, getAppointmentStats);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get('/:id', protect, getAppointmentById);

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (Doctor can confirm/complete, Patient can cancel)
router.put('/:id/status', protect, updateAppointmentStatus);

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', protect, cancelAppointment);

// @route   GET /api/appointments/availability/:doctorId/:date
// @desc    Get doctor availability for specific date
// @access  Private
router.get('/availability/:doctorId/:date', protect, getDoctorAvailability);

module.exports = router;
