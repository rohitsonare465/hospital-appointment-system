const mongoose = require('mongoose');

beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
});

afterAll(async () => {
    // Close mongoose connections after all tests
    await mongoose.disconnect();
});
