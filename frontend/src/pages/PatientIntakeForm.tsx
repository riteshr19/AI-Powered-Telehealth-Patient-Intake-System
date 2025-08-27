import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { Patient, IntakeForm } from '../types';
import { patientService, intakeService } from '../services/api';

const PatientIntakeForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [patient, setPatient] = useState<Omit<Patient, 'id'>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  });

  const [intakeForm, setIntakeForm] = useState<Omit<IntakeForm, 'id' | 'patientId'>>({
    chiefComplaint: '',
    currentMedications: '',
    allergies: '',
    medicalHistory: '',
    socialHistory: '',
    familyHistory: '',
    reviewOfSystems: '',
  });

  const handlePatientChange = (field: keyof Patient) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatient(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleIntakeChange = (field: keyof Omit<IntakeForm, 'id' | 'patientId'>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntakeForm(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create patient first
      const patientResponse = await patientService.createPatient(patient);
      
      if (patientResponse.success && patientResponse.data.id) {
        // Submit intake form
        const formResponse = await intakeService.submitForm({
          ...intakeForm,
          patientId: patientResponse.data.id,
        });

        if (formResponse.success && formResponse.data.id) {
          // Process form with AI
          await intakeService.processForm(formResponse.data.id);
          setSuccess(true);
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred while submitting the form.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6">Form Submitted Successfully!</Typography>
            <Typography>
              Your intake form has been submitted and processed by our AI system. 
              A healthcare provider will review your information and contact you soon.
            </Typography>
          </Alert>
          <Button variant="contained" onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Patient Intake Form
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <Stack spacing={3} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={patient.firstName}
                  onChange={handlePatientChange('firstName')}
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={patient.lastName}
                  onChange={handlePatientChange('lastName')}
                  required
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={patient.email}
                  onChange={handlePatientChange('email')}
                  required
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={patient.phone}
                  onChange={handlePatientChange('phone')}
                  required
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={patient.dateOfBirth}
                  onChange={handlePatientChange('dateOfBirth')}
                  InputLabelProps={{ shrink: true }}
                  required
                />
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={patient.gender}
                    onChange={(e) => setPatient(prev => ({ ...prev, gender: e.target.value }))}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <TextField
                fullWidth
                label="Address"
                value={patient.address}
                onChange={handlePatientChange('address')}
                multiline
                rows={2}
                required
              />
            </Stack>

            <Typography variant="h6" gutterBottom>
              Medical Information
            </Typography>
            
            <Stack spacing={3} sx={{ mb: 4 }}>
              <TextField
                fullWidth
                label="Chief Complaint"
                value={intakeForm.chiefComplaint}
                onChange={handleIntakeChange('chiefComplaint')}
                multiline
                rows={3}
                placeholder="Describe your main symptoms or reason for visit"
                required
              />
              
              <TextField
                fullWidth
                label="Current Medications"
                value={intakeForm.currentMedications}
                onChange={handleIntakeChange('currentMedications')}
                multiline
                rows={3}
                placeholder="List all current medications, dosages, and frequency"
              />
              
              <TextField
                fullWidth
                label="Allergies"
                value={intakeForm.allergies}
                onChange={handleIntakeChange('allergies')}
                multiline
                rows={2}
                placeholder="List any known allergies to medications, foods, or other substances"
              />
              
              <TextField
                fullWidth
                label="Medical History"
                value={intakeForm.medicalHistory}
                onChange={handleIntakeChange('medicalHistory')}
                multiline
                rows={4}
                placeholder="Previous medical conditions, surgeries, hospitalizations"
              />
              
              <TextField
                fullWidth
                label="Family History"
                value={intakeForm.familyHistory}
                onChange={handleIntakeChange('familyHistory')}
                multiline
                rows={3}
                placeholder="Family history of medical conditions"
              />
              
              <TextField
                fullWidth
                label="Social History"
                value={intakeForm.socialHistory}
                onChange={handleIntakeChange('socialHistory')}
                multiline
                rows={3}
                placeholder="Smoking, alcohol use, occupation, lifestyle factors"
              />
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Form'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default PatientIntakeForm;