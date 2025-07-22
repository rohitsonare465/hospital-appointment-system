import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add,
  FilterList,
  Event,
  Person,
  Schedule,
  Phone,
  Email,
  MoreVert,
  Cancel,
  Check,
  Visibility,
  LocalHospital,
  AccessTime,
  CalendarMonth,
  TrendingUp
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isTomorrow, isAfter } from 'date-fns';

// Import services
import {
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentStats,
  getStatusColor,
  formatStatus
} from '../services/appointment.service';

const AppointmentCard = ({ appointment, onUpdate, onCancel, userRole }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = async (status) => {
    setLoading(true);
    try {
      await updateAppointmentStatus(appointment._id, status);
      setNotification({
        open: true,
        message: `Appointment ${status === 'confirmed' ? 'confirmed' : 'marked as completed'} successfully`,
        severity: 'success'
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to update appointment status',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  const openConfirmDialog = () => {
    setConfirmDialog(true);
    handleMenuClose();
  };

  const handleConfirmAppointment = async () => {
    setLoading(true);
    try {
      await updateAppointmentStatus(appointment._id, 'confirmed');
      setNotification({
        open: true,
        message: 'Appointment confirmed successfully',
        severity: 'success'
      });
      onUpdate();
    } catch (error) {
      console.error('Error confirming appointment:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to confirm appointment',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelAppointment(appointment._id, 'Cancelled by user');
      setNotification({
        open: true,
        message: 'Appointment cancelled successfully',
        severity: 'success'
      });
      onUpdate();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to cancel appointment',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setCancelDialog(false);
      handleMenuClose();
    }
  };

  const openCancelDialog = () => {
    setCancelDialog(true);
    handleMenuClose();
  };

  const formatDate = (date) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) return 'Today';
    if (isTomorrow(appointmentDate)) return 'Tomorrow';
    return format(appointmentDate, 'MMM dd, yyyy');
  };

  const getDateChipColor = (date) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) return 'error';
    if (isTomorrow(appointmentDate)) return 'warning';
    return 'default';
  };

  const otherPerson = userRole === 'patient' ? appointment.doctor : appointment.patient;

  return (
    <Card sx={{ mb: 2, position: 'relative', '&:hover': { boxShadow: 3 } }}>
      {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              {userRole === 'patient' ? <LocalHospital /> : <Person />}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                {userRole === 'patient' ? `Dr. ${otherPerson?.name}` : otherPerson?.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {userRole === 'patient' ? otherPerson?.specialization : 'Patient'}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Chip
                  icon={<CalendarMonth />}
                  label={formatDate(appointment.appointmentDate)}
                  size="small"
                  color={getDateChipColor(appointment.appointmentDate)}
                  variant="outlined"
                />
                
                <Chip
                  icon={<AccessTime />}
                  label={appointment.appointmentTime}
                  size="small"
                  variant="outlined"
                />
                
                <Chip
                  label={formatStatus(appointment.status)}
                  size="small"
                  sx={{
                    bgcolor: getStatusColor(appointment.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" noWrap>
                <strong>Reason:</strong> {appointment.reason}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`${appointment.duration} minutes`}>
              <Chip
                label={`${appointment.duration}m`}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Tooltip>
            
            <IconButton onClick={handleMenuOpen} disabled={loading}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <Email sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">{otherPerson?.email}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <Phone sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">{otherPerson?.phoneNumber}</Typography>
          </Box>

          <Chip 
            label={appointment.priority.toUpperCase()} 
            size="small"
            color={appointment.priority === 'urgent' ? 'error' : appointment.priority === 'high' ? 'warning' : 'default'}
            variant="outlined"
          />
        </Box>

        {appointment.symptoms && appointment.symptoms.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Symptoms:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {appointment.symptoms.map((symptom, index) => (
                <Chip key={index} label={symptom} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}

        {appointment.notes && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Notes:
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {appointment.notes}
            </Typography>
          </Box>
        )}

        {/* Quick Action Buttons */}
        {(userRole === 'doctor' && appointment.status === 'pending') && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={openConfirmDialog}
              startIcon={<Check />}
              disabled={loading}
            >
              Confirm
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={openCancelDialog}
              startIcon={<Cancel />}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        )}

        {(userRole === 'doctor' && appointment.status === 'confirmed') && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => handleStatusUpdate('completed')}
              startIcon={<Check />}
              disabled={loading}
            >
              Mark Completed
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={openCancelDialog}
              startIcon={<Cancel />}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        )}

        {(userRole === 'patient' && ['pending', 'confirmed'].includes(appointment.status)) && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={openCancelDialog}
              startIcon={<Cancel />}
              disabled={loading}
            >
              Cancel Appointment
            </Button>
          </Box>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {}}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        
        {userRole === 'doctor' && appointment.status === 'pending' && (
          <MenuItem onClick={openConfirmDialog}>
            <Check sx={{ mr: 1 }} />
            Confirm
          </MenuItem>
        )}
        
        {userRole === 'doctor' && appointment.status === 'confirmed' && (
          <MenuItem onClick={() => handleStatusUpdate('completed')}>
            <Check sx={{ mr: 1 }} />
            Mark Completed
          </MenuItem>
        )}
        
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <MenuItem onClick={openCancelDialog} sx={{ color: 'error.main' }}>
            <Cancel sx={{ mr: 1 }} />
            Cancel
          </MenuItem>
        )}
      </Menu>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog}
        onClose={() => setCancelDialog(false)}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">
          Cancel Appointment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Are you sure you want to cancel this appointment with{' '}
            {userRole === 'patient' 
              ? `Dr. ${appointment.doctor?.name}` 
              : appointment.patient?.name
            } on {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} at {appointment.appointmentTime}?
            <br />
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)} color="primary">
            Keep Appointment
          </Button>
          <Button 
            onClick={handleCancel} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Cancel Appointment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Appointment Dialog */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Appointment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to confirm this appointment with{' '}
            {appointment.patient?.name} on {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} at {appointment.appointmentTime}?
            <br />
            <br />
            The patient will be notified of the confirmation.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAppointment} 
            color="success" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Confirm Appointment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

const AppointmentsList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filterDate, setFilterDate] = useState(null);
  const [userRole, setUserRole] = useState('patient'); // This should come from auth

  useEffect(() => {
    fetchAppointments();
    fetchStats();
    
    // Get user role from localStorage or auth context
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.data && user.data.user) {
      setUserRole(user.data.user.role);
    }
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, activeTab, filterDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await getAllAppointments({
        sortBy: 'appointmentDate',
        sortOrder: 'asc'
      });
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getAppointmentStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(apt => apt.status === activeTab);
    }

    // Filter by date
    if (filterDate) {
      const targetDate = format(filterDate, 'yyyy-MM-dd');
      filtered = filtered.filter(apt => 
        format(new Date(apt.appointmentDate), 'yyyy-MM-dd') === targetDate
      );
    }

    setFilteredAppointments(filtered);
  };

  const getTabCount = (status) => {
    if (!stats) return 0;
    if (status === 'all') return stats.total;
    return stats.byStatus[status] || 0;
  };

  const getUpcomingCount = () => {
    return appointments.filter(apt => 
      isAfter(new Date(apt.appointmentDate), new Date()) && 
      ['pending', 'confirmed'].includes(apt.status)
    ).length;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            My Appointments
          </Typography>
          
          {userRole === 'patient' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/book-appointment')}
              size="large"
            >
              Book New Appointment
            </Button>
          )}
        </Box>

        {/* Statistics Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" color="primary.main">
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Appointments
                      </Typography>
                    </Box>
                    <Event sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" color="warning.main">
                        {stats.today}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Today
                      </Typography>
                    </Box>
                    <Schedule sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" color="success.main">
                        {stats.upcoming}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upcoming
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" color="error.main">
                        {stats.byStatus.cancelled || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cancelled
                      </Typography>
                    </Box>
                    <Cancel sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Filters */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterList />
            
            <DatePicker
              label="Filter by Date"
              value={filterDate}
              onChange={setFilterDate}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ minWidth: 200 }} />
              )}
            />
            
            <Button
              variant="outlined"
              onClick={() => setFilterDate(null)}
              disabled={!filterDate}
            >
              Clear Date
            </Button>
          </Box>

          {/* Status Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label={
                <Badge badgeContent={getTabCount('all')} color="primary">
                  All
                </Badge>
              } 
              value="all" 
            />
            <Tab 
              label={
                <Badge badgeContent={getTabCount('pending')} color="warning">
                  Pending
                </Badge>
              } 
              value="pending" 
            />
            <Tab 
              label={
                <Badge badgeContent={getTabCount('confirmed')} color="success">
                  Confirmed
                </Badge>
              } 
              value="confirmed" 
            />
            <Tab 
              label={
                <Badge badgeContent={getTabCount('completed')} color="info">
                  Completed
                </Badge>
              } 
              value="completed" 
            />
            <Tab 
              label={
                <Badge badgeContent={getTabCount('cancelled')} color="error">
                  Cancelled
                </Badge>
              } 
              value="cancelled" 
            />
          </Tabs>
        </Paper>

        {/* Appointments List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredAppointments.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Event sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No appointments found
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {activeTab === 'all' 
                ? "You don't have any appointments yet." 
                : `No ${activeTab} appointments found.`}
            </Typography>
            {userRole === 'patient' && activeTab === 'all' && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate('/book-appointment')}
                sx={{ mt: 2 }}
              >
                Book Your First Appointment
              </Button>
            )}
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
            </Typography>
            
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment}
                onUpdate={fetchAppointments}
                userRole={userRole}
              />
            ))}
          </Box>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentsList;
