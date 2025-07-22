const mongoose = require('mongoose');
const User = require('./models/user.model');
const Appointment = require('./models/appointment.model');
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

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Appointment.deleteMany({});
        console.log('Existing data cleared.');

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

        // Insert users
        console.log('Creating users...');
        const createdUsers = [];
        
        for (const userData of sampleUsers) {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ email: userData.email });
                if (existingUser) {
                    console.log(`User ${userData.email} already exists, skipping...`);
                    createdUsers.push(existingUser);
                } else {
                    const user = new User(userData);
                    const savedUser = await user.save();
                    console.log(`Created user: ${savedUser.name}`);
                    createdUsers.push(savedUser);
                }
            } catch (error) {
                console.error(`Error creating user ${userData.email}:`, error.message);
            }
        }
        
        console.log(`${createdUsers.length} users processed successfully`);

        // Create sample appointments
        console.log('Creating sample appointments...');
        
        // Get doctors and patients
        const doctors = createdUsers.filter(user => user.role === 'doctor');
        const patients = createdUsers.filter(user => user.role === 'patient');
        
        if (doctors.length === 0 || patients.length === 0) {
            console.log('No doctors or patients found. Skipping appointment creation.');
        } else {
            // Create sample appointments
            const sampleAppointments = [];
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);

            // Sample appointment data
            const appointmentData = [
                {
                    patient: patients[0]._id,
                    doctor: doctors[0]._id,
                    appointmentDate: tomorrow,
                    appointmentTime: '09:00',
                    reason: 'Regular cardiac check-up and EKG monitoring',
                    symptoms: ['Chest pain', 'Shortness of breath'],
                    priority: 'high',
                    duration: 45,
                    status: 'confirmed'
                },
                {
                    patient: patients[1]._id,
                    doctor: doctors[1]._id,
                    appointmentDate: nextWeek,
                    appointmentTime: '14:30',
                    reason: 'Neurological consultation for recurring headaches',
                    symptoms: ['Headache', 'Dizziness'],
                    priority: 'medium',
                    duration: 30,
                    status: 'pending'
                },
                {
                    patient: patients[2]._id,
                    doctor: doctors[2]._id,
                    appointmentDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                    appointmentTime: '10:00',
                    reason: 'Pediatric wellness exam and vaccinations',
                    symptoms: [],
                    priority: 'low',
                    duration: 30,
                    status: 'confirmed'
                },
                {
                    patient: patients[3]._id,
                    doctor: doctors[4]._id,
                    appointmentDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
                    appointmentTime: '15:00',
                    reason: 'Dermatology screening for skin concerns',
                    symptoms: ['Rash', 'Itching'],
                    priority: 'medium',
                    duration: 30,
                    status: 'pending'
                },
                {
                    patient: patients[0]._id,
                    doctor: doctors[3]._id,
                    appointmentDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                    appointmentTime: '11:30',
                    reason: 'Orthopedic consultation for knee pain',
                    symptoms: ['Knee pain', 'Swelling'],
                    priority: 'medium',
                    duration: 45,
                    status: 'pending'
                },
                {
                    patient: patients[1]._id,
                    doctor: doctors[0]._id,
                    appointmentDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
                    appointmentTime: '09:30',
                    reason: 'Follow-up cardiac consultation',
                    symptoms: ['Fatigue'],
                    priority: 'high',
                    duration: 30,
                    status: 'pending'
                }
            ];

            // Create appointments individually to handle validation
            const createdAppointments = [];
            for (const appointmentInfo of appointmentData) {
                try {
                    const appointment = new Appointment(appointmentInfo);
                    const savedAppointment = await appointment.save();
                    createdAppointments.push(savedAppointment);
                    console.log(`Created appointment: ${patients.find(p => p._id.equals(appointmentInfo.patient))?.name} -> ${doctors.find(d => d._id.equals(appointmentInfo.doctor))?.name}`);
                } catch (error) {
                    console.error('Error creating appointment:', error.message);
                }
            }
            
            console.log(`${createdAppointments.length} appointments created successfully`);
        }

        // Display statistics
        const doctorsCount = await User.countDocuments({ role: 'doctor' });
        const patientsCount = await User.countDocuments({ role: 'patient' });
        const totalCount = await User.countDocuments();
        const appointmentsCount = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });

        console.log('\n=== Database Seeding Complete ===');
        console.log(`Total Users: ${totalCount}`);
        console.log(`Doctors: ${doctorsCount}`);
        console.log(`Patients: ${patientsCount}`);
        console.log(`Total Appointments: ${appointmentsCount}`);
        console.log(`Pending Appointments: ${pendingAppointments}`);
        console.log(`Confirmed Appointments: ${confirmedAppointments}`);
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
