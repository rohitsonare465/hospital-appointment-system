const mongoose = require('mongoose');
const User = require('./models/user.model');
require('dotenv').config();

// Sample users data
const sampleUsers = [
    // Doctors
    {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        password: 'password123',
        role: 'doctor',
        specialization: 'Cardiology',
        phoneNumber: '1234567890'
    },
    {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@hospital.com',
        password: 'password123',
        role: 'doctor',
        specialization: 'Neurology',
        phoneNumber: '1234567891'
    },
    {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@hospital.com',
        password: 'password123',
        role: 'doctor',
        specialization: 'Pediatrics',
        phoneNumber: '1234567892'
    },
    {
        name: 'Dr. David Kim',
        email: 'david.kim@hospital.com',
        password: 'password123',
        role: 'doctor',
        specialization: 'Orthopedics',
        phoneNumber: '1234567893'
    },
    {
        name: 'Dr. Lisa Williams',
        email: 'lisa.williams@hospital.com',
        password: 'password123',
        role: 'doctor',
        specialization: 'Dermatology',
        phoneNumber: '1234567894'
    },
    {
        name: 'Dr. Robert Brown',
        email: 'robert.brown@hospital.com',
        password: 'password123',
        role: 'doctor',
        specialization: 'Oncology',
        phoneNumber: '1234567895'
    },
    
    // Patients
    {
        name: 'John Smith',
        email: 'john.smith@email.com',
        password: 'password123',
        role: 'patient',
        phoneNumber: '2234567890'
    },
    {
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        password: 'password123',
        role: 'patient',
        phoneNumber: '2234567891'
    },
    {
        name: 'James Wilson',
        email: 'james.wilson@email.com',
        password: 'password123',
        role: 'patient',
        phoneNumber: '2234567892'
    },
    {
        name: 'Jennifer Taylor',
        email: 'jennifer.taylor@email.com',
        password: 'password123',
        role: 'patient',
        phoneNumber: '2234567893'
    },
    {
        name: 'Christopher Davis',
        email: 'christopher.davis@email.com',
        password: 'password123',
        role: 'patient',
        phoneNumber: '2234567894'
    },
    {
        name: 'Ashley Miller',
        email: 'ashley.miller@email.com',
        password: 'password123',
        role: 'patient',
        phoneNumber: '2234567895'
    },
    {
        name: 'Matthew Anderson',
        email: 'matthew.anderson@email.com',
        password: 'password123',
        role: 'patient',
        phoneNumber: '2234567896'
    },
    {
        name: 'Amanda Thomas',
        email: 'amanda.thomas@email.com',
        password: 'password123',
        role: 'patient',
        phoneNumber: '2234567897'
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-appointment-system',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        console.log('Connected to MongoDB');

        // Clear existing users (optional - uncomment if you want to reset)
        // await User.deleteMany({});
        // console.log('Cleared existing users');

        // Check if users already exist
        const existingUsersCount = await User.countDocuments();
        
        if (existingUsersCount > 0) {
            console.log(`Database already has ${existingUsersCount} users. Skipping seed.`);
            console.log('If you want to reseed, uncomment the User.deleteMany line in this script.');
            return;
        }

        // Create sample users
        console.log('Creating sample users...');
        
        for (const userData of sampleUsers) {
            try {
                const existingUser = await User.findOne({ email: userData.email });
                if (!existingUser) {
                    await User.create(userData);
                    console.log(`Created user: ${userData.name}`);
                } else {
                    console.log(`User already exists: ${userData.email}`);
                }
            } catch (error) {
                console.error(`Error creating user ${userData.name}:`, error.message);
            }
        }

        // Display statistics
        const doctorsCount = await User.countDocuments({ role: 'doctor' });
        const patientsCount = await User.countDocuments({ role: 'patient' });
        const totalCount = await User.countDocuments();

        console.log('\n=== Database Seeding Complete ===');
        console.log(`Total Users: ${totalCount}`);
        console.log(`Doctors: ${doctorsCount}`);
        console.log(`Patients: ${patientsCount}`);
        console.log('\nTest credentials:');
        console.log('Doctor: sarah.johnson@hospital.com / password123');
        console.log('Patient: john.smith@email.com / password123');
        
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the seed function
seedDatabase();
