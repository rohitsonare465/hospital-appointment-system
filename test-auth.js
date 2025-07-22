// Test script to verify authentication endpoints
console.log('Testing Hospital Appointment System Authentication...');

const testRegistration = async () => {
    try {
        const response = await fetch('http://localhost:50001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: 'Doctor Smith',
                email: 'doctor.smith@hospital.com',
                password: 'securepassword123',
                role: 'doctor',
                specialization: 'Cardiology',
                phoneNumber: '9876543210'
            })
        });

        const data = await response.json();
        console.log('Registration Response:', data);
        return data;
    } catch (error) {
        console.error('Registration Error:', error);
    }
};

const testLogin = async (email, password) => {
    try {
        const response = await fetch('http://localhost:50001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:3000'
            },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        console.log('Login Response:', data);
        return data;
    } catch (error) {
        console.error('Login Error:', error);
    }
};

const runTests = async () => {
    console.log('\\n=== Testing Registration ===');
    const regResult = await testRegistration();
    
    if (regResult && regResult.status === 'success') {
        console.log('\\n=== Testing Login ===');
        await testLogin('doctor.smith@hospital.com', 'securepassword123');
    }
    
    console.log('\\n=== Testing Patient Registration ===');
    const patientResponse = await fetch('http://localhost:50001/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
        },
        credentials: 'include',
        body: JSON.stringify({
            name: 'John Patient',
            email: 'john.patient@email.com',
            password: 'patientpass123',
            role: 'patient',
            phoneNumber: '1122334455'
        })
    });
    
    const patientData = await patientResponse.json();
    console.log('Patient Registration Response:', patientData);
    
    if (patientData && patientData.status === 'success') {
        console.log('\\n=== Testing Patient Login ===');
        await testLogin('john.patient@email.com', 'patientpass123');
    }
};

runTests();
