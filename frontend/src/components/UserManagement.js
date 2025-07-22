import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Chip,
    Pagination,
    Alert,
    CircularProgress,
    Avatar,
    Tabs,
    Tab,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Search as SearchIcon,
    Person as PersonIcon,
    LocalHospital as DoctorIcon,
    PersonOutline as PatientIcon,
    Refresh as RefreshIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';
import { getAllUsers, getAllDoctors, getAllPatients, getUserStats } from '../services/user.service';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [refreshing, setRefreshing] = useState(false);

    const itemsPerPage = 8;

    // Tab configuration
    const tabs = [
        { label: 'All Users', value: 'all', icon: <PersonIcon /> },
        { label: 'Doctors', value: 'doctors', icon: <DoctorIcon /> },
        { label: 'Patients', value: 'patients', icon: <PatientIcon /> }
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [currentTab, currentPage, searchTerm, roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                ...(searchTerm && { search: searchTerm }),
                ...(roleFilter && { role: roleFilter })
            };

            let response;
            switch (currentTab) {
                case 1: // Doctors
                    response = await getAllDoctors(params);
                    setUsers(response.data.doctors || []);
                    break;
                case 2: // Patients
                    response = await getAllPatients(params);
                    setUsers(response.data.patients || []);
                    break;
                default: // All users
                    response = await getAllUsers(params);
                    setUsers(response.data.users || []);
            }
            
            setPagination(response.data.pagination || {});
        } catch (error) {
            setError(error.message || 'Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getUserStats();
            setStats(response.data || {});
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        setCurrentPage(1);
        setSearchTerm('');
        setRoleFilter('');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleRoleFilterChange = (event) => {
        setRoleFilter(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchUsers(), fetchStats()]);
        setRefreshing(false);
    };

    const getRoleChipColor = (role) => {
        return role === 'doctor' ? 'primary' : 'secondary';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <Container component="main" maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography component="h1" variant="h4" color="primary">
                    User Management
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    Refresh
                </Button>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Users
                                    </Typography>
                                    <Typography variant="h5">
                                        {stats.totalUsers || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                                    <DoctorIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Doctors
                                    </Typography>
                                    <Typography variant="h5">
                                        {stats.totalDoctors || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                                    <PatientIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        Patients
                                    </Typography>
                                    <Typography variant="h5">
                                        {stats.totalPatients || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                                    <PersonIcon />
                                </Avatar>
                                <Box>
                                    <Typography color="textSecondary" gutterBottom>
                                        New Users (30d)
                                    </Typography>
                                    <Typography variant="h5">
                                        {stats.newUsers || 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Paper elevation={3} sx={{ p: 3 }}>
                {/* Tabs */}
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            icon={tab.icon}
                            label={tab.label}
                            iconPosition="start"
                        />
                    ))}
                </Tabs>

                {/* Filters */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search users"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Search by name, email, specialization..."
                        />
                    </Grid>
                    {currentTab === 0 && (
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>Filter by Role</InputLabel>
                                <Select
                                    value={roleFilter}
                                    label="Filter by Role"
                                    onChange={handleRoleFilterChange}
                                >
                                    <MenuItem value="">All Roles</MenuItem>
                                    <MenuItem value="doctor">Doctor</MenuItem>
                                    <MenuItem value="patient">Patient</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Users Table */}
                {loading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Contact</TableCell>
                                        <TableCell>Role</TableCell>
                                        {(currentTab === 0 || currentTab === 1) && (
                                            <TableCell>Specialization</TableCell>
                                        )}
                                        <TableCell>Joined</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography color="textSecondary">
                                                    No users found
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user._id} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar sx={{ mr: 2, bgcolor: getRoleChipColor(user.role) === 'primary' ? 'primary.main' : 'secondary.main' }}>
                                                            {getInitials(user.name)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2">
                                                                {user.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary">
                                                                ID: {user._id.slice(-8)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {user.email}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {user.phoneNumber}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                        color={getRoleChipColor(user.role)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                {(currentTab === 0 || currentTab === 1) && (
                                                    <TableCell>
                                                        <Typography variant="body2">
                                                            {user.specialization || 'N/A'}
                                                        </Typography>
                                                    </TableCell>
                                                )}
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {formatDate(user.createdAt)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="View Details">
                                                        <IconButton
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => {
                                                                // Handle view user details
                                                                console.log('View user:', user._id);
                                                            }}
                                                        >
                                                            <ViewIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <Box display="flex" justifyContent="center" mt={3}>
                                <Pagination
                                    count={pagination.totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        )}

                        {/* Results Summary */}
                        {users.length > 0 && (
                            <Box mt={2}>
                                <Typography variant="body2" color="textSecondary" align="center">
                                    Showing {users.length} of {pagination.totalUsers || pagination.totalDoctors || pagination.totalPatients || 0} users
                                    {searchTerm && ` matching "${searchTerm}"`}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default UserManagement;
