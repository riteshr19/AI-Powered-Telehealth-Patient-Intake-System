import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';

const HomePage: React.FC = () => {
  const features = [
    {
      title: 'Patient Intake Forms',
      description: 'Complete your medical intake forms with AI assistance for faster and more accurate submissions.',
      icon: <AssignmentIcon fontSize="large" color="primary" />,
      link: '/intake',
      buttonText: 'Start Intake Form',
    },
    {
      title: 'Appointment Booking',
      description: 'Schedule appointments with healthcare providers at your convenience.',
      icon: <CalendarTodayIcon fontSize="large" color="primary" />,
      link: '/appointment',
      buttonText: 'Book Appointment',
    },
    {
      title: 'Patient Dashboard',
      description: 'View your medical history, upcoming appointments, and test results.',
      icon: <DashboardIcon fontSize="large" color="primary" />,
      link: '/dashboard',
      buttonText: 'View Dashboard',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <LocalHospitalIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          AI-Powered Telehealth
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Streamlined Patient Intake & Appointment Scheduling
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Experience the future of healthcare with our intelligent patient intake system. 
          Our AI-powered platform helps extract key information from your forms, 
          making the process faster and more accurate for both patients and healthcare providers.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/intake"
          sx={{ mr: 2, mb: 2 }}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          size="large"
          component={Link}
          to="/dashboard"
          sx={{ mb: 2 }}
        >
          View Dashboard
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', py: 8 }}>
        {features.map((feature, index) => (
          <Card key={index} sx={{ flex: '1 1 300px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                {feature.icon}
              </Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                component={Link}
                to={feature.link}
              >
                {feature.buttonText}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Box sx={{ py: 8, textAlign: 'center', backgroundColor: 'grey.50', borderRadius: 2, mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Why Choose Our Platform?
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              AI-Powered
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intelligent form processing and key information extraction
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Secure
            </Typography>
            <Typography variant="body2" color="text.secondary">
              HIPAA compliant with end-to-end encryption
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              User-Friendly
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intuitive interface designed for all age groups
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 200px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              24/7 Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access your health information anytime, anywhere
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;