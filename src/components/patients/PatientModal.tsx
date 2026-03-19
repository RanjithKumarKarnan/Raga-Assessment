import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { CardContent, CardHeader } from '../ui/Card';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Patient } from '../../types/patient';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: any) => void;
  patient?: Patient | null;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  diagnosis: string;
  bloodType: string;
  allergies: string[];
  status: 'active' | 'inactive' | 'critical' | 'stable' | 'pending';
  notes: string;
}

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patient,
  mode
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: 'male',
    email: '',
    phone: '',
    diagnosis: '',
    bloodType: '',
    allergies: [],
    status: 'active',
    notes: ''
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patient && mode === 'edit') {
      setFormData({
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        email: patient.email || '',
        phone: patient.phone || '',
        diagnosis: patient.diagnosis,
        bloodType: patient.bloodType || '',
        allergies: patient.allergies || [],
        status: patient.status,
        notes: patient.notes || ''
      });
    } else {
      setFormData({
        name: '',
        age: '',
        gender: 'male',
        email: '',
        phone: '',
        diagnosis: '',
        bloodType: '',
        allergies: [],
        status: 'active',
        notes: ''
      });
    }
  }, [patient, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || +formData.age < 0 || +formData.age > 150) newErrors.age = 'Enter valid age';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSave({
      ...formData,
      age: parseInt(formData.age),
      ...(mode === 'edit' && { id: patient?.id })
    });

    onClose();
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !formData.allergies.includes(allergyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()]
      }));
      setAllergyInput('');
    }
  };

  const removeAllergy = (value: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== value)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'Add Patient' : 'Edit Patient'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Age"
                  value={formData.age}
                  onChange={e => setFormData(p => ({ ...p, age: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.age ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
              </div>

              <select
                value={formData.gender}
                onChange={e => setFormData(p => ({ ...p, gender: e.target.value as any }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <select
                value={formData.status}
                onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="critical">Critical</option>
                <option value="stable">Stable</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />

              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Diagnosis"
              value={formData.diagnosis}
              onChange={e => setFormData(p => ({ ...p, diagnosis: e.target.value }))}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
                errors.diagnosis ? 'border-red-500' : 'border-gray-200'
              }`}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <select
                value={formData.bloodType}
                onChange={e => setFormData(p => ({ ...p, bloodType: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Blood Type</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <input
                  value={allergyInput}
                  onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                  placeholder="Allergy"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={addAllergy}
                  className="px-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((a, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-50 text-red-600">
                    {a}
                    <button onClick={() => removeAllergy(a)}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <textarea
              rows={3}
              placeholder="Notes"
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={onClose} className="rounded-xl">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  );
};