const request = require('supertest');
const app = require('../server');
const User = require('../models/user.model');
const Appointment = require('../models/appointment.model');

describe('Appointment Management API - Cancel Feature', () => {
    let patientToken, doctorToken;
    let patientId, doctorId;
    let appointmentId;

    beforeAll(async () => {
        // Create test users and get tokens
        const patientData = {
            name: 'Test Patient',
            email: 'patient@test.com',
            password: 'password123',
            role: 'patient',
            phoneNumber: '1234567890'
        };

        const doctorData = {
            name: 'Dr. Test Doctor',
            email: 'doctor@test.com',
            password: 'password123',
            role: 'doctor',
            specialization: 'Cardiology',
            phoneNumber: '1234567891'
        };

        // Register users
        await request(app).post('/api/auth/register').send(patientData);
        await request(app).post('/api/auth/register').send(doctorData);

        // Login users
        const patientLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: patientData.email, password: patientData.password });

        const doctorLogin = await request(app)
            .post('/api/auth/login')
            .send({ email: doctorData.email, password: doctorData.password });

        patientToken = patientLogin.body.token;
        doctorToken = doctorLogin.body.token;
        patientId = patientLogin.body.data.user._id;
        doctorId = doctorLogin.body.data.user._id;
    });

    beforeEach(async () => {
        // Create a test appointment before each test
        const appointmentData = {
            doctorId: doctorId,
            appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            appointmentTime: '10:00',
            reason: 'Regular checkup',
            duration: 30
        };

        const appointment = await request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${patientToken}`)
            .send(appointmentData);

        appointmentId = appointment.body.data._id;
    });

    it('should allow patient to cancel appointment', async () => {
        const response = await request(app)
            .delete(`/api/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${patientToken}`)
            .send({ reason: 'Patient cancelled' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('cancelled');
    });

    it('should allow doctor to cancel appointment', async () => {
        const response = await request(app)
            .delete(`/api/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${doctorToken}`)
            .send({ reason: 'Doctor cancelled' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toContain('cancelled');
    });

    it('should not allow unauthorized user to cancel', async () => {
        const response = await request(app)
            .delete(`/api/appointments/${appointmentId}`)
            .send({ reason: 'Unauthorized cancel' });

        expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent appointment', async () => {
        const fakeId = '507f1f77bcf86cd799439011';
        const response = await request(app)
            .delete(`/api/appointments/${fakeId}`)
            .set('Authorization', `Bearer ${patientToken}`)
            .send({ reason: 'Test cancel' });

        expect(response.status).toBe(404);
    });
});
