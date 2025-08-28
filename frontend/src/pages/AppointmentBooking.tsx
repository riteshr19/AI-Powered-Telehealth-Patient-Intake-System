import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  CircularProgress,
  TextField,
  Stack,
} from '@mui/material';
import { Appointment, Provider } from '../types';
import { appointmentService } from '../services/api';

const AppointmentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<number | ''>('');
  const [appointmentType, setAppointmentType] = useState<Appointment['type']>('consultation');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock providers data
  const providers: Provider[] = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      availability: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      availability: ['08:00', '09:00', '13:00', '14:00', '15:00'],
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      availability: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
    },
  ];

  const availableSlots = selectedProvider 
    ? providers.find(p => p.id === selectedProvider)?.availability || []
    : [];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedProvider) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const appointment: Omit<Appointment, 'id'> = {
        patientId: 1, // In real app, this would come from auth context
        providerId: selectedProvider as number,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        type: appointmentType,
        status: 'scheduled',
      };

      const response = await appointmentService.createAppointment(appointment);
      
      if (response.success) {
        setSuccess(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">Appointment Booked Successfully!</Typography>
            <Typography>
              Your appointment has been scheduled. You will receive a confirmation email shortly.
            </Typography>
          </Alert>
          <Button variant="contained" onClick={() => window.location.href = '/dashboard'}>
            View Appointments
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book an Appointment
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card elevation={2}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h6" gutterBottom>
                Select Provider
              </Typography>
              
              <FormControl fullWidth required>
                <InputLabel>Healthcare Provider</InputLabel>
                <Select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as number)}
                >
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name} - {provider.specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Appointment Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                }}
              />

              {selectedProvider && availableSlots.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Available Time Slots:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {availableSlots.map((slot) => (
                      <Chip
                        key={slot}
                        label={slot}
                        onClick={() => setSelectedTime(slot)}
                        color={selectedTime === slot ? 'primary' : 'default'}
                        variant={selectedTime === slot ? 'filled' : 'outlined'}
                        clickable
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <FormControl fullWidth>
                <InputLabel>Appointment Type</InputLabel>
                <Select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as Appointment['type'])}
                >
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
              </FormControl>

              {selectedDate && selectedTime && selectedProvider && (
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Appointment Summary:
                  </Typography>
                  <Typography variant="body2">
                    Provider: {providers.find(p => p.id === selectedProvider)?.name}
                  </Typography>
                  <Typography variant="body2">
                    Date: {selectedDate}
                  </Typography>
                  <Typography variant="body2">
                    Time: {selectedTime}
                  </Typography>
                  <Typography variant="body2">
                    Type: {appointmentType.charAt(0).toUpperCase() + appointmentType.slice(1)}
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime || !selectedProvider || loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Book Appointment'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AppointmentBooking;