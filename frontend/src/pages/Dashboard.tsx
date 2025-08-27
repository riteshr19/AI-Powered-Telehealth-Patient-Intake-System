import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Patient, Appointment, IntakeForm } from '../types';
import { patientService, appointmentService, intakeService } from '../services/api';

const Dashboard: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [intakeForms, setIntakeForms] = useState<IntakeForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // In a real app, patient ID would come from authentication context
      const patientId = 1;
      
      const [patientResponse, appointmentsResponse, formsResponse] = await Promise.all([
        patientService.getPatient(patientId),
        appointmentService.getPatientAppointments(patientId),
        intakeService.getPatientForms(patientId),
      ]);

      if (patientResponse.success) {
        setPatient(patientResponse.data);
      }
      
      if (appointmentsResponse.success) {
        setAppointments(appointmentsResponse.data);
      }
      
      if (formsResponse.success) {
        setIntakeForms(formsResponse.data);
      }
    } catch (error: any) {
      setError('Failed to load dashboard data.');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  // Mock data for demonstration
  const mockPatient: Patient = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    address: '123 Main St, City, State 12345',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 987-6543',
      relationship: 'Spouse',
    },
  };

  const mockAppointments: Appointment[] = [
    {
      id: 1,
      patientId: 1,
      providerId: 1,
      appointmentDate: '2024-01-15',
      appointmentTime: '10:00',
      type: 'consultation',
      status: 'confirmed',
      createdAt: '2024-01-10',
    },
    {
      id: 2,
      patientId: 1,
      providerId: 2,
      appointmentDate: '2024-01-08',
      appointmentTime: '14:30',
      type: 'follow-up',
      status: 'completed',
      createdAt: '2024-01-05',
    },
  ];

  const mockIntakeForms: IntakeForm[] = [
    {
      id: 1,
      patientId: 1,
      chiefComplaint: 'Persistent headaches and fatigue',
      currentMedications: 'Ibuprofen 400mg as needed',
      allergies: 'Penicillin',
      medicalHistory: 'Hypertension, diagnosed 2020',
      socialHistory: 'Non-smoker, occasional alcohol use',
      familyHistory: 'Mother: diabetes, Father: heart disease',
      reviewOfSystems: 'Headaches daily, fatigue, no fever',
      processed: true,
      aiSummary: 'Patient presents with chronic headaches and fatigue. Possible tension headaches or stress-related symptoms.',
      riskAssessment: 'Low risk - symptoms suggest common conditions, recommend evaluation.',
      createdAt: '2024-01-10',
    },
  ];

  const displayPatient = patient || mockPatient;
  const displayAppointments = appointments.length > 0 ? appointments : mockAppointments;
  const displayIntakeForms = intakeForms.length > 0 ? intakeForms : mockIntakeForms;

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography>Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Dashboard
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error} - Showing sample data for demonstration.
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Patient Profile Card */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {displayPatient.firstName} {displayPatient.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patient ID: {displayPatient.id}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Typography variant="body2">
                  <strong>Email:</strong> {displayPatient.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {displayPatient.phone}
                </Typography>
                <Typography variant="body2">
                  <strong>DOB:</strong> {displayPatient.dateOfBirth}
                </Typography>
                <Typography variant="body2">
                  <strong>Gender:</strong> {displayPatient.gender}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Card sx={{ flex: '1 1 200px', textAlign: 'center', p: 2 }}>
              <CalendarIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4">{displayAppointments.length}</Typography>
              <Typography variant="body2">Total Appointments</Typography>
            </Card>
            <Card sx={{ flex: '1 1 200px', textAlign: 'center', p: 2 }}>
              <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4">{displayIntakeForms.length}</Typography>
              <Typography variant="body2">Intake Forms</Typography>
            </Card>
            <Card sx={{ flex: '1 1 200px', textAlign: 'center', p: 2 }}>
              <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h4">
                {displayAppointments.filter(a => a.status === 'completed').length}
              </Typography>
              <Typography variant="body2">Completed</Typography>
            </Card>
            <Card sx={{ flex: '1 1 200px', textAlign: 'center', p: 2 }}>
              <CalendarIcon color="info" sx={{ fontSize: 40 }} />
              <Typography variant="h4">
                {displayAppointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length}
              </Typography>
              <Typography variant="body2">Upcoming</Typography>
            </Card>
          </Box>

          {/* Recent Appointments */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Appointments
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayAppointments.slice(0, 5).map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.appointmentDate}</TableCell>
                        <TableCell>{appointment.appointmentTime}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={appointment.type}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="outlined" href="/appointment">
                  Book New Appointment
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Intake Forms */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Intake Forms
              </Typography>
              <List>
                {displayIntakeForms.slice(0, 3).map((form, index) => (
                  <React.Fragment key={form.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          <AssignmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={form.chiefComplaint.substring(0, 50) + '...'}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {form.createdAt}
                            </Typography>
                            {form.processed && (
                              <Chip
                                size="small"
                                label="AI Processed"
                                color="success"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < displayIntakeForms.slice(0, 3).length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="outlined" href="/intake">
                  Fill New Form
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* AI Insights */}
          {displayIntakeForms.some(form => form.aiSummary) && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI Health Insights
                </Typography>
                {displayIntakeForms
                  .filter(form => form.aiSummary)
                  .slice(0, 2)
                  .map((form) => (
                    <Alert key={form.id} severity="info" sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Latest Assessment:</Typography>
                      <Typography variant="body2">{form.aiSummary}</Typography>
                      {form.riskAssessment && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Risk Assessment:</strong> {form.riskAssessment}
                        </Typography>
                      )}
                    </Alert>
                  ))}
              </CardContent>
            </Card>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default Dashboard;