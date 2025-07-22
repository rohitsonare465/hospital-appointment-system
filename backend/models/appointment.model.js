const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Patient is required']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Doctor is required']
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required'],
        validate: {
            validator: function(v) {
                return v > new Date();
            },
            message: 'Appointment date must be in the future'
        }
    },
    appointmentTime: {
        type: String,
        required: [true, 'Appointment time is required'],
        validate: {
            validator: function(v) {
                // Validate time format (HH:MM)
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Please provide a valid time in HH:MM format'
        }
    },
    reason: {
        type: String,
        required: [true, 'Reason for appointment is required'],
        trim: true,
        maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    symptoms: [{
        type: String,
        trim: true
    }],
    duration: {
        type: Number, // in minutes
        default: 30,
        min: [15, 'Minimum duration is 15 minutes'],
        max: [180, 'Maximum duration is 180 minutes']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ status: 1 });

// Pre-save middleware to update updatedAt
appointmentSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Pre-update middleware
appointmentSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    this.set({ updatedAt: new Date() });
    next();
});

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
    return this.appointmentDate.toLocaleDateString();
});

// Virtual for full datetime
appointmentSchema.virtual('fullDateTime').get(function() {
    const date = this.appointmentDate.toLocaleDateString();
    return `${date} at ${this.appointmentTime}`;
});

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
    const appointmentDateTime = new Date(this.appointmentDate);
    const [hours, minutes] = this.appointmentTime.split(':');
    appointmentDateTime.setHours(hours, minutes);
    
    const now = new Date();
    const timeDiff = appointmentDateTime - now;
    
    // Can be cancelled if more than 2 hours before appointment
    return timeDiff > 2 * 60 * 60 * 1000;
};

// Static method to check doctor availability
appointmentSchema.statics.isDoctorAvailable = async function(doctorId, appointmentDate, appointmentTime) {
    const existingAppointment = await this.findOne({
        doctor: doctorId,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        status: { $in: ['pending', 'confirmed'] }
    });
    
    return !existingAppointment;
};

// Static method to get doctor's schedule for a day
appointmentSchema.statics.getDoctorSchedule = async function(doctorId, date) {
    return await this.find({
        doctor: doctorId,
        appointmentDate: date,
        status: { $in: ['pending', 'confirmed'] }
    }).sort({ appointmentTime: 1 });
};

module.exports = mongoose.model('Appointment', appointmentSchema);
