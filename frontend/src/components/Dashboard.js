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
    Chip,
    Avatar,
    IconButton,
    Divider,
    LinearProgress,
    Badge,
    Tooltip,
    Fade,
    Slide,
    Zoom
} from '@mui/material';
import {
    CalendarMonth,
    Schedule,
    Person,
    LocalHospital,
    Add,
    List,
    Logout,
    TrendingUp,
    AccessTime,
    CheckCircle,
    Cancel,
    AccountCircle,
    Phone,
    Email,
    MedicalServices,
    Dashboard as DashboardIcon,
    Notifications,
    Settings
} from '@mui/icons-material';
import { getCurrentUser, logout } from '../services/auth.service';
import { getAppointmentStats } from '../services/appointment.service';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [appointmentStats, setAppointmentStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser.data.user);
            fetchAppointmentStats(currentUser.data.user._id);
        }
    }, [navigate]);

    const fetchAppointmentStats = async (userId) => {
        try {
            setLoading(true);
            const stats = await getAppointmentStats(userId);
            setAppointmentStats(stats.data);
        } catch (error) {
            console.error('Error fetching appointment stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6">Loading Dashboard...</Typography>
                    <LinearProgress sx={{ mt: 2, width: 200 }} />
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 4
        }}>
            <Container component="main" maxWidth="xl">
                {/* Header Section */}
                <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                    <Paper 
                        elevation={8} 
                        sx={{ 
                            p: 4, 
                            mb: 4, 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: 4
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center">
                                <Avatar 
                                    sx={{ 
                                        width: 60, 
                                        height: 60, 
                                        mr: 3,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        fontSize: 28
                                    }}
                                >
                                    {user.role === 'doctor' ? <LocalHospital /> : <AccountCircle />}
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                                        Welcome back, {user.name}!
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Chip 
                                            label={user.role.toUpperCase()} 
                                            sx={{ 
                                                bgcolor: 'rgba(255,255,255,0.2)', 
                                                color: 'white',
                                                fontWeight: 'bold'
                                            }} 
                                        />
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            {new Date().toLocaleDateString('en-US', { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Tooltip title="Notifications">
                                    <IconButton sx={{ color: 'white' }}>
                                        <Badge badgeContent={3} color="error">
                                            <Notifications />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Settings">
                                    <IconButton sx={{ color: 'white' }}>
                                        <Settings />
                                    </IconButton>
                                </Tooltip>
                                <Button 
                                    variant="outlined" 
                                    sx={{ 
                                        color: 'white', 
                                        borderColor: 'rgba(255,255,255,0.5)',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                    onClick={handleLogout}
                                    startIcon={<Logout />}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Slide>

                <Grid container spacing={3}>
                    {/* Stats Cards */}
                    <Grid item xs={12}>
                        <Fade in={true} timeout={1000}>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                                    📊 Dashboard Overview
                                </Typography>
                                {loading ? (
                                    <Box sx={{ width: '100%', mb: 2 }}>
                                        <LinearProgress />
                                    </Box>
                                ) : (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Zoom in={true} timeout={800}>
                                                <Card sx={{ 
                                                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                                                    color: 'white',
                                                    height: '100%',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                    }
                                                }}>
                                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                        <Avatar sx={{ 
                                                            width: 60, 
                                                            height: 60, 
                                                            mx: 'auto', 
                                                            mb: 2,
                                                            bgcolor: 'rgba(255,255,255,0.2)'
                                                        }}>
                                                            <CalendarMonth sx={{ fontSize: 30 }} />
                                                        </Avatar>
                                                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                                                            {appointmentStats?.total || 0}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            Total Appointments
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Zoom>
                                        </Grid>
                                        
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Zoom in={true} timeout={1000}>
                                                <Card sx={{ 
                                                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                                    color: 'white',
                                                    height: '100%',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                    }
                                                }}>
                                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                        <Avatar sx={{ 
                                                            width: 60, 
                                                            height: 60, 
                                                            mx: 'auto', 
                                                            mb: 2,
                                                            bgcolor: 'rgba(255,255,255,0.2)'
                                                        }}>
                                                            <Schedule sx={{ fontSize: 30 }} />
                                                        </Avatar>
                                                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                                                            {appointmentStats?.upcoming || 0}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            Upcoming Appointments
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Zoom>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Zoom in={true} timeout={1200}>
                                                <Card sx={{ 
                                                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                                                    color: 'white',
                                                    height: '100%',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                    }
                                                }}>
                                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                        <Avatar sx={{ 
                                                            width: 60, 
                                                            height: 60, 
                                                            mx: 'auto', 
                                                            mb: 2,
                                                            bgcolor: 'rgba(255,255,255,0.2)'
                                                        }}>
                                                            <AccessTime sx={{ fontSize: 30 }} />
                                                        </Avatar>
                                                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                                                            {appointmentStats?.today || 0}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            Today's Appointments
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Zoom>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={3}>
                                            <Zoom in={true} timeout={1400}>
                                                <Card sx={{ 
                                                    background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
                                                    color: 'white',
                                                    height: '100%',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                                    }
                                                }}>
                                                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                                        <Avatar sx={{ 
                                                            width: 60, 
                                                            height: 60, 
                                                            mx: 'auto', 
                                                            mb: 2,
                                                            bgcolor: 'rgba(255,255,255,0.2)'
                                                        }}>
                                                            <CheckCircle sx={{ fontSize: 30 }} />
                                                        </Avatar>
                                                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                                                            {appointmentStats?.completed || 0}
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            Completed
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Zoom>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        </Fade>
                    </Grid>
                    {/* Profile and Actions Section */}
                    <Grid item xs={12} lg={8}>
                        <Fade in={true} timeout={1200}>
                            <Card sx={{ 
                                height: '100%',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                borderRadius: 3
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#333' }}>
                                        🎯 Quick Actions
                                    </Typography>
                                    
                                    {user.role === 'patient' ? (
                                        <Box>
                                            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                                                Manage your healthcare appointments and find the best doctors for your needs.
                                            </Typography>
                                            
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Button 
                                                        variant="contained" 
                                                        fullWidth
                                                        component={Link}
                                                        to="/book-appointment"
                                                        startIcon={<Add />}
                                                        sx={{ 
                                                            py: 2,
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        Book New Appointment
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Button 
                                                        variant="outlined" 
                                                        fullWidth
                                                        component={Link}
                                                        to="/appointments"
                                                        startIcon={<Schedule />}
                                                        sx={{ 
                                                            py: 2,
                                                            borderColor: '#667eea',
                                                            color: '#667eea',
                                                            '&:hover': {
                                                                borderColor: '#764ba2',
                                                                color: '#764ba2',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        My Appointments
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Button 
                                                        variant="outlined" 
                                                        fullWidth
                                                        component={Link}
                                                        to="/users"
                                                        startIcon={<LocalHospital />}
                                                        sx={{ 
                                                            py: 2,
                                                            borderColor: '#667eea',
                                                            color: '#667eea',
                                                            '&:hover': {
                                                                borderColor: '#764ba2',
                                                                color: '#764ba2',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        Find Doctors
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Button 
                                                        variant="text" 
                                                        fullWidth
                                                        startIcon={<MedicalServices />}
                                                        sx={{ 
                                                            py: 2,
                                                            color: '#667eea',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(102, 126, 234, 0.1)',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        Medical History
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    ) : (
                                        <Box>
                                            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
                                                Manage your medical practice and patient appointments efficiently.
                                            </Typography>
                                            
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Button 
                                                        variant="contained" 
                                                        fullWidth
                                                        component={Link}
                                                        to="/appointments"
                                                        startIcon={<Schedule />}
                                                        sx={{ 
                                                            py: 2,
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        My Appointments
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Button 
                                                        variant="outlined" 
                                                        fullWidth
                                                        component={Link}
                                                        to="/users"
                                                        startIcon={<Person />}
                                                        sx={{ 
                                                            py: 2,
                                                            borderColor: '#667eea',
                                                            color: '#667eea',
                                                            '&:hover': {
                                                                borderColor: '#764ba2',
                                                                color: '#764ba2',
                                                                transform: 'translateY(-2px)'
                                                            },
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    >
                                                        Manage Patients
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>

                    {/* Profile Information */}
                    <Grid item xs={12} lg={4}>
                        <Fade in={true} timeout={1400}>
                            <Card sx={{ 
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                                borderRadius: 3
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box display="flex" alignItems="center" mb={3}>
                                        <Avatar 
                                            sx={{ 
                                                width: 50, 
                                                height: 50, 
                                                mr: 2,
                                                bgcolor: 'rgba(255,255,255,0.2)'
                                            }}
                                        >
                                            <AccountCircle />
                                        </Avatar>
                                        <Typography variant="h6" fontWeight="bold">
                                            Profile Information
                                        </Typography>
                                    </Box>
                                    
                                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 3 }} />
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                            Full Name
                                        </Typography>
                                        <Typography variant="h6" fontWeight="medium">
                                            {user.name}
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <Email sx={{ fontSize: 18, mr: 1, opacity: 0.8 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                        <Phone sx={{ fontSize: 18, mr: 1, opacity: 0.8 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                {user.phoneNumber}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    {user.specialization && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                                                Specialization
                                            </Typography>
                                            <Chip 
                                                label={user.specialization}
                                                sx={{ 
                                                    bgcolor: 'rgba(255,255,255,0.2)', 
                                                    color: 'white' 
                                                }}
                                                icon={<MedicalServices />}
                                            />
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Dashboard;
