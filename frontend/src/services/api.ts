import axios from 'axios';
import { Patient, IntakeForm, Appointment, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const ML_API_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const patientService = {
  async createPatient(patient: Omit<Patient, 'id'>): Promise<ApiResponse<Patient>> {
    const response = await api.post('/patients', patient);
    return response.data;
  },

  async getPatient(id: number): Promise<ApiResponse<Patient>> {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async updatePatient(id: number, patient: Partial<Patient>): Promise<ApiResponse<Patient>> {
    const response = await api.put(`/patients/${id}`, patient);
    return response.data;
  },

  async listPatients(): Promise<ApiResponse<Patient[]>> {
    const response = await api.get('/patients');
    return response.data;
  },
};

export const intakeService = {
  async submitForm(form: Omit<IntakeForm, 'id'>): Promise<ApiResponse<IntakeForm>> {
    const response = await api.post('/intake-forms', form);
    return response.data;
  },

  async getForm(id: number): Promise<ApiResponse<IntakeForm>> {
    const response = await api.get(`/intake-forms/${id}`);
    return response.data;
  },

  async processForm(id: number): Promise<ApiResponse<IntakeForm>> {
    const response = await api.post(`/intake-forms/${id}/process`);
    return response.data;
  },

  async getPatientForms(patientId: number): Promise<ApiResponse<IntakeForm[]>> {
    const response = await api.get(`/patients/${patientId}/intake-forms`);
    return response.data;
  },
};

export const appointmentService = {
  async createAppointment(appointment: Omit<Appointment, 'id'>): Promise<ApiResponse<Appointment>> {
    const response = await api.post('/appointments', appointment);
    return response.data;
  },

  async getAppointment(id: number): Promise<ApiResponse<Appointment>> {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    const response = await api.put(`/appointments/${id}`, appointment);
    return response.data;
  },

  async listAppointments(): Promise<ApiResponse<Appointment[]>> {
    const response = await api.get('/appointments');
    return response.data;
  },

  async getPatientAppointments(patientId: number): Promise<ApiResponse<Appointment[]>> {
    const response = await api.get(`/patients/${patientId}/appointments`);
    return response.data;
  },
};

export const mlService = {
  async extractKeyInformation(text: string): Promise<any> {
    const response = await axios.post(`${ML_API_URL}/extract`, { text });
    return response.data;
  },

  async getRiskAssessment(formData: any): Promise<any> {
    const response = await axios.post(`${ML_API_URL}/risk-assessment`, formData);
    return response.data;
  },

  async getFormSuggestions(partialData: any): Promise<any> {
    const response = await axios.post(`${ML_API_URL}/suggestions`, partialData);
    return response.data;
  },
};

export default api;