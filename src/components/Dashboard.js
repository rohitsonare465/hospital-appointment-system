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
    Grid
} from '@mui/material';
import { getCurrentUser, logout } from '../services/auth.service';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser.data.user);
        }
    }, [navigate]);

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
                                                to="/users"
                                                sx={{ mr: 1 }}
                                            >
                                                View Doctors
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
                                                to="/users"
                                                sx={{ mr: 1 }}
                                            >
                                                View All Users
                                            </Button>
                                        </Box>
                                    </Box>
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
