import axios from 'axios';

// Use environment variable or fallback to localhost for development
const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API_URL = `${BASE_API_URL}/appointments`;

// Get token from localStorage
const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
};

// Create axios instance with auth header
const createAuthAxios = () => {
    const token = getAuthToken();
    return axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    });
};

// Create new appointment
export const createAppointment = async (appointmentData) => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.post('/', appointmentData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all appointments
export const getAllAppointments = async (params = {}) => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get('/', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get appointment by ID
export const getAppointmentById = async (id) => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update appointment status
export const updateAppointmentStatus = async (id, status, notes = '') => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.put(`/${id}/status`, { status, notes });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Cancel appointment
export const cancelAppointment = async (id, reason = '') => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.delete(`/${id}`, { 
            data: { reason } 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get doctor availability 
export const getDoctorAvailability = async (doctorId, date) => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get(`/availability/${doctorId}/${date}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get appointment statistics
export const getAppointmentStats = async () => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get('/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Helper function to format date for API
export const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
};

// Helper function to get available time slots (frontend logic)
export const getTimeSlots = () => {
    return [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00'
    ];
};

// Helper function to format appointment status
export const formatStatus = (status) => {
    const statusMap = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed'
    };
    return statusMap[status] || status;
};

// Helper function to get status color
export const getStatusColor = (status) => {
    const colorMap = {
        pending: '#ff9800',
        confirmed: '#4caf50',
        cancelled: '#f44336',
        completed: '#2196f3'
    };
    return colorMap[status] || '#757575';
};
