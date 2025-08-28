# AI-Powered Telehealth Patient Intake System

A comprehensive full-stack telehealth platform that streamlines patient intake and appointment scheduling using AI-powered form processing.

## Architecture

This system consists of three main components:

- **Frontend**: React.js application for patient and healthcare provider interfaces
- **Backend**: Laravel API providing RESTful endpoints and business logic
- **ML Service**: Python-based machine learning service for intelligent form processing

## Features

### Patient Portal
- Intelligent patient intake forms with auto-completion
- Real-time form validation and assistance
- Appointment scheduling and management
- Medical history tracking
- Secure document upload

### Healthcare Provider Dashboard
- Patient management system
- Appointment scheduling and calendar
- AI-processed intake summaries
- Analytics and reporting

### AI/ML Capabilities
- Automatic extraction of key medical information
- Form auto-completion based on patient history
- Risk assessment and priority scoring
- Natural language processing for medical text

## Technology Stack

### Frontend
- React.js with TypeScript
- Material-UI for component library
- Axios for API communication
- React Router for navigation

### Backend
- Laravel 10 with PHP 8.1+
- MySQL database
- Redis for caching
- JWT authentication

### ML Service
- Python with Flask
- scikit-learn for machine learning
- spaCy for natural language processing
- pandas for data processing

### DevOps
- Docker for containerization
- AWS for cloud deployment
- GitHub Actions for CI/CD

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PHP 8.1+ (for local development)
- Python 3.9+ (for local development)

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/riteshr19/AI-Powered-Telehealth-Patient-Intake-System.git
cd AI-Powered-Telehealth-Patient-Intake-System
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- ML Service: http://localhost:5000

### Local Development

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

#### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

#### ML Service Setup
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

## API Documentation

The API documentation is available at `/api/documentation` when running the backend service.

### Key Endpoints

#### Patient Management
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/{id}` - Get patient details
- `PUT /api/patients/{id}` - Update patient

#### Intake Forms
- `POST /api/intake-forms` - Submit intake form
- `GET /api/intake-forms/{id}` - Get intake form
- `POST /api/intake-forms/{id}/process` - AI process form

#### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Schedule appointment
- `PUT /api/appointments/{id}` - Update appointment

## Deployment

### AWS Deployment

The application is configured for deployment on AWS using:
- ECS for container orchestration
- RDS for database
- S3 for file storage
- CloudFront for CDN

Deploy using the provided scripts:
```bash
cd devops
./deploy.sh production
```

### CI/CD Pipeline

GitHub Actions workflows are configured for:
- Automated testing on pull requests
- Building and pushing Docker images
- Deploying to staging and production environments

## Security

- JWT-based authentication
- CORS protection
- Input validation and sanitization
- Encrypted data transmission
- HIPAA compliance considerations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.