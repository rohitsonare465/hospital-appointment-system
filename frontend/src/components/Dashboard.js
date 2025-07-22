import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Chip
} from '@mui/material';
import {
    CalendarMonth,
    Schedule,
    Person,
    LocalHospital,
    Add,
    List
} from '@mui/icons-material';
import { getCurrentUser, logout } from '../services/auth.service';
import { getAppointmentStats } from '../services/appointment.service';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [appointmentStats, setAppointmentStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser.data.user);
            fetchAppointmentStats(currentUser.data.user.id);
        }
    }, [navigate]);

    const fetchAppointmentStats = async (userId) => {
        try {
            const stats = await getAppointmentStats(userId);
            setAppointmentStats(stats.data);
        } catch (error) {
            console.error('Error fetching appointment stats:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography component="h1" variant="h4">
                        Welcome to Hospital Appointment System
                    </Typography>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    User Profile
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Name:</strong> {user.name}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Email:</strong> {user.email}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Role:</strong> {user.role}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Phone:</strong> {user.phoneNumber}
                                </Typography>
                                {user.specialization && (
                                    <Typography variant="body1">
                                        <strong>Specialization:</strong> {user.specialization}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Quick Actions
                                </Typography>
                                {user.role === 'patient' ? (
                                    <Box>
                                        <Typography variant="body1" paragraph>
                                            As a patient, you can:
                                        </Typography>
                                        <ul>
                                            <li>Book appointments with doctors</li>
                                            <li>View your medical history</li>
                                            <li>Manage your profile</li>
                                        </ul>
                                        <Box mt={2}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                component={Link}
                                                to="/book-appointment"
                                                startIcon={<Add />}
                                                sx={{ mr: 1, mb: 1 }}
                                            >
                                                Book Appointment
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                component={Link}
                                                to="/appointments"
                                                startIcon={<Schedule />}
                                                sx={{ mr: 1, mb: 1 }}
                                            >
                                                My Appointments
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                component={Link}
                                                to="/users"
                                                startIcon={<LocalHospital />}
                                                sx={{ mb: 1 }}
                                            >
                                                Find Doctors
                                            </Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="body1" paragraph>
                                            As a doctor, you can:
                                        </Typography>
                                        <ul>
                                            <li>Manage your appointments</li>
                                            <li>View patient records</li>
                                            <li>Update your availability</li>
                                        </ul>
                                        <Box mt={2}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                component={Link}
                                                to="/appointments"
                                                startIcon={<Schedule />}
                                                sx={{ mr: 1, mb: 1 }}
                                            >
                                                My Appointments
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                component={Link}
                                                to="/users"
                                                startIcon={<Person />}
                                                sx={{ mb: 1 }}
                                            >
                                                Manage Patients
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Appointment Statistics
                                </Typography>
                                {appointmentStats ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                                                <CalendarMonth color="primary" sx={{ fontSize: 40 }} />
                                                <Typography variant="h6">
                                                    {appointmentStats.total || 0}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Total Appointments
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                                                <Schedule color="success" sx={{ fontSize: 40 }} />
                                                <Typography variant="h6">
                                                    {appointmentStats.upcoming || 0}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Upcoming Appointments
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                                                <Schedule color="warning" sx={{ fontSize: 40 }} />
                                                <Typography variant="h6">
                                                    {appointmentStats.today || 0}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Today's Appointments
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                                        Loading appointment statistics...
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Dashboard;
