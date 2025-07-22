const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');

// Create new appointment
const createAppointment = async (req, res) => {
    try {
        const {
            doctorId,
            appointmentDate,
            appointmentTime,
            reason,
            symptoms,
            duration,
            priority,
            notes
        } = req.body;

        // Validate required fields
        if (!doctorId || !appointmentDate || !appointmentTime || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Doctor, appointment date, time, and reason are required'
            });
        }

        // Verify doctor exists and has correct role
        const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check if patient exists (from auth middleware)
        const patient = await User.findById(req.user.id);
        if (!patient || patient.role !== 'patient') {
            return res.status(403).json({
                success: false,
                message: 'Only patients can book appointments'
            });
        }

        // Parse and validate appointment date
        const parsedDate = new Date(appointmentDate);
        if (parsedDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Appointment date must be in the future'
            });
        }

        // Check doctor availability
        const isAvailable = await Appointment.isDoctorAvailable(
            doctorId,
            parsedDate,
            appointmentTime
        );

        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: 'Doctor is not available at this time. Please choose another time slot.'
            });
        }

        // Create appointment
        const appointment = new Appointment({
            patient: req.user.id,
            doctor: doctorId,
            appointmentDate: parsedDate,
            appointmentTime,
            reason,
            symptoms: symptoms || [],
            duration: duration || 30,
            priority: priority || 'medium',
            notes: notes || ''
        });

        await appointment.save();

        // Populate patient and doctor details
        await appointment.populate([
            { path: 'patient', select: 'name email phoneNumber' },
            { path: 'doctor', select: 'name email specialization phoneNumber' }
        ]);

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });

    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create appointment',
            error: error.message
        });
    }
};

// Get all appointments with filtering
const getAllAppointments = async (req, res) => {
    try {
        const { 
            status, 
            doctorId, 
            patientId, 
            date, 
            page = 1, 
            limit = 10,
            sortBy = 'appointmentDate',
            sortOrder = 'asc'
        } = req.query;

        // Build query object
        let query = {};

        // Role-based filtering
        if (req.user.role === 'patient') {
            query.patient = req.user.id;
        } else if (req.user.role === 'doctor') {
            query.doctor = req.user.id;
        }

        // Additional filters
        if (status) query.status = status;
        if (doctorId) query.doctor = doctorId;
        if (patientId) query.patient = patientId;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.appointmentDate = { $gte: startDate, $lt: endDate };
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Fetch appointments with pagination
        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phoneNumber')
            .populate('doctor', 'name email specialization phoneNumber')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await Appointment.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                appointments,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalAppointments: total,
                    hasNextPage: skip + appointments.length < total,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id)
            .populate('patient', 'name email phoneNumber')
            .populate('doctor', 'name email specialization phoneNumber');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if user has permission to view this appointment
        if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.error('Get appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment',
            error: error.message
        });
    }
};

// Update appointment status
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check permissions
        const canUpdate = (
            (req.user.role === 'doctor' && appointment.doctor.toString() === req.user.id) ||
            (req.user.role === 'patient' && appointment.patient.toString() === req.user.id && status === 'cancelled')
        );

        if (!canUpdate) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Update appointment
        appointment.status = status;
        if (notes) appointment.notes = notes;
        await appointment.save();

        await appointment.populate([
            { path: 'patient', select: 'name email phoneNumber' },
            { path: 'doctor', select: 'name email specialization phoneNumber' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Appointment updated successfully',
            data: appointment
        });

    } catch (error) {
        console.error('Update appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update appointment',
            error: error.message
        });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if user can cancel this appointment
        const canCancel = (
            appointment.patient.toString() === req.user.id ||
            appointment.doctor.toString() === req.user.id
        );

        if (!canCancel) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if appointment can be cancelled (not in the past)
        if (!appointment.canBeCancelled()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel appointment less than 2 hours before scheduled time'
            });
        }

        appointment.status = 'cancelled';
        if (reason) {
            appointment.notes = `Cancelled: ${reason}`;
        }
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel appointment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel appointment',
            error: error.message
        });
    }
};

// Get doctor availability for a specific date
const getDoctorAvailability = async (req, res) => {
    try {
        const { doctorId, date } = req.params;

        // Verify doctor exists
        const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const targetDate = new Date(date);
        const appointments = await Appointment.getDoctorSchedule(doctorId, targetDate);

        // Define working hours (9 AM to 5 PM)
        const workingHours = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00'
        ];

        const bookedTimes = appointments.map(apt => apt.appointmentTime);
        const availableTimes = workingHours.filter(time => !bookedTimes.includes(time));

        res.status(200).json({
            success: true,
            data: {
                doctor: {
                    id: doctor._id,
                    name: doctor.name,
                    specialization: doctor.specialization
                },
                date: targetDate,
                availableTimes,
                bookedTimes
            }
        });

    } catch (error) {
        console.error('Get availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch availability',
            error: error.message
        });
    }
};

// Get appointment statistics
const getAppointmentStats = async (req, res) => {
    try {
        let matchQuery = {};

        // Role-based filtering
        if (req.user.role === 'patient') {
            matchQuery.patient = req.user.id;
        } else if (req.user.role === 'doctor') {
            matchQuery.doctor = req.user.id;
        }

        const stats = await Appointment.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalAppointments = await Appointment.countDocuments(matchQuery);
        const todayAppointments = await Appointment.countDocuments({
            ...matchQuery,
            appointmentDate: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999)
            }
        });

        const upcomingAppointments = await Appointment.countDocuments({
            ...matchQuery,
            appointmentDate: { $gt: new Date() },
            status: { $in: ['pending', 'confirmed'] }
        });

        res.status(200).json({
            success: true,
            data: {
                total: totalAppointments,
                today: todayAppointments,
                upcoming: upcomingAppointments,
                byStatus: stats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {})
            }
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment,
    getDoctorAvailability,
    getAppointmentStats
};
