import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Rating
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  CalendarMonth,
  Person,
  MedicalServices,
  CheckCircle,
  AccessTime,
  Phone,
  Email,
  LocalHospital,
  Add
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Import services
import { getAllDoctors } from '../services/user.service';
import { getCurrentUser } from '../services/auth.service';
import { 
  createAppointment, 
  getDoctorAvailability,
  formatDateForAPI 
} from '../services/appointment.service';

const steps = ['Select Doctor', 'Choose Date & Time', 'Enter Details', 'Confirm'];

const validationSchema = Yup.object({
  doctorId: Yup.string().required('Please select a doctor'),
  appointmentDate: Yup.date()
    .min(new Date(), 'Appointment date must be in the future')
    .required('Please select a date'),
  appointmentTime: Yup.string().required('Please select a time'),
  reason: Yup.string()
    .min(10, 'Please provide at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters')
    .required('Please enter the reason for your appointment'),
  symptoms: Yup.array().of(Yup.string()),
  priority: Yup.string().oneOf(['low', 'medium', 'high', 'urgent']),
  duration: Yup.number().min(15).max(180)
});

const BookAppointment = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (currentUser.data.user.role !== 'patient') {
      setError('Only patients can book appointments');
      return;
    }
    
    setUser(currentUser.data.user);
    fetchDoctors();
  }, [navigate]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllDoctors();
      setDoctors(response.data.doctors || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(error.message || 'Failed to fetch doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (doctorId, date) => {
    try {
      setLoading(true);
      const response = await getDoctorAvailability(doctorId, formatDateForAPI(date));
      setAvailability(response.data);
      setAvailableTimes(response.data.availableTimes || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await createAppointment({
        ...values,
        appointmentDate: formatDateForAPI(values.appointmentDate)
      });
      
      setAppointmentData(response.data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/appointments');
      }, 3000);
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
      setConfirmDialog(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Appointment Booked Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          Your appointment has been scheduled. You will receive a confirmation shortly.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/appointments')}
          size="large"
        >
          View My Appointments
        </Button>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Book New Appointment
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Formik
          initialValues={{
            doctorId: '',
            appointmentDate: null,
            appointmentTime: '',
            reason: '',
            symptoms: [],
            priority: 'medium',
            duration: 30,
            notes: ''
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setAppointmentData(values);
            setConfirmDialog(true);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isValid
          }) => (
            <Form>
              <Paper sx={{ p: 3, mb: 3 }}>
                {/* Step 1: Select Doctor */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Person sx={{ mr: 1 }} />
                      Select a Doctor
                    </Typography>
                    
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : doctors.length === 0 ? (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        No doctors available at the moment. Please try again later or contact support.
                      </Alert>
                    ) : (
                      <Grid container spacing={2}>
                        {doctors.map((doctor) => (
                          <Grid item xs={12} md={6} lg={4} key={doctor._id}>
                            <Card 
                              sx={{ 
                                cursor: 'pointer',
                                border: values.doctorId === doctor._id ? 2 : 1,
                                borderColor: values.doctorId === doctor._id ? 'primary.main' : 'divider',
                                '&:hover': { borderColor: 'primary.light' }
                              }}
                              onClick={() => {
                                setFieldValue('doctorId', doctor._id);
                                setSelectedDoctor(doctor);
                              }}
                            >
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                    <LocalHospital />
                                  </Avatar>
                                  <Box>
                                    <Typography variant="h6">{doctor.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {doctor.specialization}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {doctor.email}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {doctor.phoneNumber}
                                  </Typography>
                                </Box>

                                <Rating value={4.5} readOnly size="small" />
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}

                    {touched.doctorId && errors.doctorId && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {errors.doctorId}
                      </Alert>
                    )}
                  </Box>
                )}

                {/* Step 2: Choose Date & Time */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CalendarMonth sx={{ mr: 1 }} />
                      Choose Date & Time
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <DatePicker
                          label="Appointment Date"
                          value={values.appointmentDate}
                          onChange={(newValue) => {
                            setFieldValue('appointmentDate', newValue);
                            setFieldValue('appointmentTime', '');
                            if (newValue && values.doctorId) {
                              fetchAvailability(values.doctorId, newValue);
                            }
                          }}
                          minDate={new Date()}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={touched.appointmentDate && !!errors.appointmentDate}
                              helperText={touched.appointmentDate && errors.appointmentDate}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        {values.appointmentDate && (
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              Available Time Slots
                            </Typography>
                            {loading ? (
                              <CircularProgress size={24} />
                            ) : (
                              <Grid container spacing={1}>
                                {availableTimes.map((time) => (
                                  <Grid item key={time}>
                                    <Chip
                                      label={time}
                                      clickable
                                      variant={values.appointmentTime === time ? 'filled' : 'outlined'}
                                      color={values.appointmentTime === time ? 'primary' : 'default'}
                                      onClick={() => setFieldValue('appointmentTime', time)}
                                      icon={<AccessTime />}
                                    />
                                  </Grid>
                                ))}
                              </Grid>
                            )}
                          </Box>
                        )}
                      </Grid>
                    </Grid>

                    {touched.appointmentTime && errors.appointmentTime && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {errors.appointmentTime}
                      </Alert>
                    )}
                  </Box>
                )}

                {/* Step 3: Enter Details */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <MedicalServices sx={{ mr: 1 }} />
                      Appointment Details
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Reason for Appointment *"
                          name="reason"
                          value={values.reason}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.reason && !!errors.reason}
                          helperText={touched.reason && errors.reason}
                          placeholder="Please describe your symptoms or reason for the visit..."
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Priority</InputLabel>
                          <Select
                            name="priority"
                            value={values.priority}
                            onChange={handleChange}
                            label="Priority"
                          >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="urgent">Urgent</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Duration (minutes)</InputLabel>
                          <Select
                            name="duration"
                            value={values.duration}
                            onChange={handleChange}
                            label="Duration (minutes)"
                          >
                            <MenuItem value={15}>15 minutes</MenuItem>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={45}>45 minutes</MenuItem>
                            <MenuItem value={60}>1 hour</MenuItem>
                            <MenuItem value={90}>1.5 hours</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <Autocomplete
                          multiple
                          freeSolo
                          options={[
                            'Fever', 'Headache', 'Cough', 'Chest Pain', 
                            'Abdominal Pain', 'Nausea', 'Fatigue', 'Dizziness'
                          ]}
                          value={values.symptoms}
                          onChange={(event, newValue) => {
                            setFieldValue('symptoms', newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Symptoms (optional)"
                              placeholder="Type and press Enter to add symptoms"
                            />
                          )}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip
                                variant="outlined"
                                label={option}
                                {...getTagProps({ index })}
                                color="primary"
                              />
                            ))
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Additional Notes (optional)"
                          name="notes"
                          value={values.notes}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Any additional information you'd like to share..."
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Step 4: Confirm */}
                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CheckCircle sx={{ mr: 1 }} />
                      Confirm Appointment Details
                    </Typography>

                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Doctor Information
                            </Typography>
                            <Typography variant="body1">
                              <strong>{selectedDoctor?.name}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedDoctor?.specialization}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedDoctor?.email}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Appointment Details
                            </Typography>
                            <Typography variant="body1">
                              <strong>Date:</strong> {values.appointmentDate?.toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Time:</strong> {values.appointmentTime}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Duration:</strong> {values.duration} minutes
                            </Typography>
                            <Typography variant="body1">
                              <strong>Priority:</strong> {values.priority.charAt(0).toUpperCase() + values.priority.slice(1)}
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Reason for Visit
                            </Typography>
                            <Typography variant="body2">
                              {values.reason}
                            </Typography>
                            
                            {values.symptoms.length > 0 && (
                              <>
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                                  Symptoms
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {values.symptoms.map((symptom, index) => (
                                    <Chip key={index} label={symptom} size="small" variant="outlined" />
                                  ))}
                                </Box>
                              </>
                            )}
                            
                            {values.notes && (
                              <>
                                <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                                  Additional Notes
                                </Typography>
                                <Typography variant="body2">
                                  {values.notes}
                                </Typography>
                              </>
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  
                  <Box>
                    {activeStep < steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={
                          (activeStep === 0 && !values.doctorId) ||
                          (activeStep === 1 && (!values.appointmentDate || !values.appointmentTime)) ||
                          (activeStep === 2 && (!values.reason || values.reason.length < 10))
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || loading}
                        startIcon={loading && <CircularProgress size={20} />}
                      >
                        {loading ? 'Booking...' : 'Book Appointment'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Form>
          )}
        </Formik>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmDialog}
          onClose={() => setConfirmDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Confirm Appointment Booking</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Please confirm that you want to book this appointment:
            </Typography>
            {appointmentData && selectedDoctor && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Doctor:</strong> {selectedDoctor.name} ({selectedDoctor.specialization})
                </Typography>
                <Typography variant="body2">
                  <strong>Date & Time:</strong> {appointmentData.appointmentDate?.toLocaleDateString()} at {appointmentData.appointmentTime}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {appointmentData.duration} minutes
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button
              onClick={() => appointmentData && handleSubmit(appointmentData)}
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default BookAppointment;
