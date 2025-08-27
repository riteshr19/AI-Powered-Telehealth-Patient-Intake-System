export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface IntakeForm {
  id?: number;
  patientId: number;
  chiefComplaint: string;
  currentMedications: string;
  allergies: string;
  medicalHistory: string;
  socialHistory: string;
  familyHistory: string;
  reviewOfSystems: string;
  vitalSigns?: {
    height: string;
    weight: string;
    bloodPressure: string;
    temperature: string;
    heartRate: string;
  };
  processed?: boolean;
  aiSummary?: string;
  riskAssessment?: string;
  createdAt?: string;
}

export interface Appointment {
  id?: number;
  patientId: number;
  providerId: number;
  appointmentDate: string;
  appointmentTime: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt?: string;
}

export interface Provider {
  id: number;
  name: string;
  specialty: string;
  availability: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}