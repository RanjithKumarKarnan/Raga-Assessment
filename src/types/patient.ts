export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  diagnosis: string;
  lastVisit: string;
  status: 'active' | 'inactive' | 'critical' | 'stable' | 'pending';
  email?: string;
  phone?: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
