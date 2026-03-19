import type { Patient } from '../types/patient';

interface CreatePatientData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  diagnosis: string;
  bloodType?: string;
  allergies?: string[];
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
}

interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

class PatientService {
  private patients: Patient[] = [];
  private nextId = 1;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Load from localStorage or use mock data
    const stored = localStorage.getItem('patients');
    if (stored) {
      this.patients = JSON.parse(stored);
      this.nextId = Math.max(...this.patients.map(p => parseInt(p.id))) + 1;
    } else {
      this.patients = [
        {
          id: '1',
          name: 'John Doe',
          age: 45,
          gender: 'male',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          diagnosis: 'Hypertension',
          bloodType: 'O+',
          allergies: ['Penicillin'],
          status: 'active',
          lastVisit: '2024-01-15',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Jane Smith',
          age: 32,
          gender: 'female',
          email: 'jane.smith@email.com',
          phone: '+1 (555) 987-6543',
          diagnosis: 'Diabetes Type 2',
          bloodType: 'A+',
          allergies: [],
          status: 'active',
          lastVisit: '2024-01-18',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Robert Johnson',
          age: 58,
          gender: 'male',
          email: 'robert.j@email.com',
          phone: '+1 (555) 456-7890',
          diagnosis: 'Arthritis',
          bloodType: 'B+',
          allergies: ['Sulfa', 'Nuts'],
          status: 'inactive',
          lastVisit: '2024-01-10',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem('patients', JSON.stringify(this.patients));
  }

  async getAllPatients(): Promise<Patient[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.patients];
  }

  async getPatientById(id: string): Promise<Patient | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.patients.find(p => p.id === id) || null;
  }

  async createPatient(data: CreatePatientData): Promise<Patient> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newPatient: Patient = {
      id: this.nextId.toString(),
      ...data,
      lastVisit: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.patients.push(newPatient);
    this.nextId++;
    this.saveToLocalStorage();
    
    return newPatient;
  }

  async updatePatient(data: UpdatePatientData): Promise<Patient> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.patients.findIndex(p => p.id === data.id);
    if (index === -1) {
      throw new Error('Patient not found');
    }

    const updatedPatient: Patient = {
      ...this.patients[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    this.patients[index] = updatedPatient;
    this.saveToLocalStorage();
    
    return updatedPatient;
  }

  async deletePatient(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Patient not found');
    }

    this.patients.splice(index, 1);
    this.saveToLocalStorage();
  }

  async searchPatients(query: string): Promise<Patient[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const lowercaseQuery = query.toLowerCase();
    return this.patients.filter(patient => 
      patient.name.toLowerCase().includes(lowercaseQuery) ||
      patient.email?.toLowerCase().includes(lowercaseQuery) ||
      patient.phone?.includes(query) ||
      patient.diagnosis.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const patientService = new PatientService();
