import axios from 'axios';

// Use environment variable or fallback to localhost for development
const BASE_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const API_URL = `${BASE_API_URL}/users`;

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

// Get all users with filtering and pagination
export const getAllUsers = async (params = {}) => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get('/', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all doctors
export const getAllDoctors = async (params = {}) => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get('/doctors', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get all patients
export const getAllPatients = async (params = {}) => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get('/patients', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get user statistics
export const getUserStats = async () => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get('/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get user by ID
export const getUserById = async (id) => {
    try {
        const authAxios = createAuthAxios();
        const response = await authAxios.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
