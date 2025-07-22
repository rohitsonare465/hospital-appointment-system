const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user.model');

describe('User Management API', () => {
    let authToken;
    let doctorId;
    let patientId;

    beforeAll(async () => {
        // Connect to test database
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/hospital-appointment-system-test');
        }
        
        // Clear test database
        await User.deleteMany({});
        
        // Create test users
        const doctor = await User.create({
            name: 'Test Doctor',
            email: 'test.doctor@test.com',
            password: 'password123',
            role: 'doctor',
            specialization: 'Cardiology',
            phoneNumber: '1234567890'
        });
        doctorId = doctor._id;

        const patient = await User.create({
            name: 'Test Patient',
            email: 'test.patient@test.com',
            password: 'password123',
            role: 'patient',
            phoneNumber: '1234567891'
        });
        patientId = patient._id;

        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test.doctor@test.com',
                password: 'password123'
            });

        authToken = loginResponse.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    describe('GET /api/users', () => {
        test('should get all users with authentication', async () => {
            const response = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.users).toHaveLength(2);
            expect(response.body.data.pagination).toBeDefined();
        });

        test('should fail without authentication', async () => {
            await request(app)
                .get('/api/users')
                .expect(401);
        });

        test('should filter users by role', async () => {
            const response = await request(app)
                .get('/api/users?role=doctor')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.users).toHaveLength(1);
            expect(response.body.data.users[0].role).toBe('doctor');
        });

        test('should search users by name', async () => {
            const response = await request(app)
                .get('/api/users?search=Test Doctor')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.users).toHaveLength(1);
            expect(response.body.data.users[0].name).toBe('Test Doctor');
        });

        test('should paginate results', async () => {
            const response = await request(app)
                .get('/api/users?page=1&limit=1')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.users).toHaveLength(1);
            expect(response.body.data.pagination.currentPage).toBe(1);
            expect(response.body.data.pagination.totalPages).toBe(2);
        });
    });

    describe('GET /api/users/doctors', () => {
        test('should get all doctors', async () => {
            const response = await request(app)
                .get('/api/users/doctors')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.doctors).toHaveLength(1);
            expect(response.body.data.doctors[0].role).toBe('doctor');
            expect(response.body.data.doctors[0].specialization).toBe('Cardiology');
        });

        test('should search doctors by specialization', async () => {
            const response = await request(app)
                .get('/api/users/doctors?search=Cardiology')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.doctors).toHaveLength(1);
        });
    });

    describe('GET /api/users/patients', () => {
        test('should get all patients', async () => {
            const response = await request(app)
                .get('/api/users/patients')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.patients).toHaveLength(1);
            expect(response.body.data.patients[0].role).toBe('patient');
        });
    });

    describe('GET /api/users/stats', () => {
        test('should get user statistics', async () => {
            const response = await request(app)
                .get('/api/users/stats')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.totalUsers).toBe(2);
            expect(response.body.data.totalDoctors).toBe(1);
            expect(response.body.data.totalPatients).toBe(1);
            expect(response.body.data.newUsers).toBeDefined();
        });
    });

    describe('GET /api/users/:id', () => {
        test('should get user by ID', async () => {
            const response = await request(app)
                .get(`/api/users/${doctorId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.name).toBe('Test Doctor');
            expect(response.body.data.user.password).toBeUndefined(); // Password should not be returned
        });

        test('should return 404 for non-existent user', async () => {
            const fakeId = new mongoose.Types.ObjectId();
            await request(app)
                .get(`/api/users/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});
