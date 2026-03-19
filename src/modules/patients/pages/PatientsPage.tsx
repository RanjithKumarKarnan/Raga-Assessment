import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Layout } from '../../../components/layout/Layout';
import { PatientModal } from '../../../components/patients/PatientModal';
import { patientService } from '../../../services/patientService';
import type { Patient } from '../../../types/patient';
import { Users, Activity, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);


  const fetchPatients = async () => {
    setLoading(true);
    try {
      const fetchedPatients = await patientService.getAllPatients();
      setPatients(fetchedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreatePatient = () => {
    setModalMode('create');
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setModalMode('edit');
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleDeletePatient = async (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      try {
        await patientService.deletePatient(patient.id);
        await fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  interface CreatePatientData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  diagnosis: string;
  bloodType: string;
  allergies: string[];
  status: 'active' | 'inactive' | 'pending';
  notes: string;
}

interface UpdatePatientData extends Partial<CreatePatientData> {
  id: string;
}

  const handleSavePatient = async (patientData: CreatePatientData | UpdatePatientData) => {
    try {
      if (modalMode === 'create') {
        await patientService.createPatient(patientData as CreatePatientData);
      } else {
        await patientService.updatePatient(patientData as UpdatePatientData);
      }
      await fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'stable':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Layout 
      title="Patient Management" 
      subtitle={`Total Patients: ${filteredPatients.length}`}
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <ToggleSwitch
              checked={viewMode === 'grid'}
              onChange={(checked) => setViewMode(checked ? 'grid' : 'list')}
              label="Grid View"
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <Button onClick={handleCreatePatient} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {patients.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Grid/List */}
        {filteredPatients.length === 0 ? (
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500">Try adjusting your search or add a new patient.</p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
                <CardHeader className="px-6 py-5 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.age} years, {patient.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{patient.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{patient.lastVisit}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{patient.bloodType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">{patient.phone || 'N/A'}</p>
                      </div>
                    </div>

                    {patient.allergies && patient.allergies.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Allergies</p>
                        <div className="flex flex-wrap gap-1">
                          {patient.allergies.map((allergy, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded-md border border-red-200">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() => handleEditPatient(patient)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Patient List</h3>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                    <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-semibold text-sm">
                              {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">{patient.age} years, {patient.gender}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="text-sm text-gray-900">{patient.phone || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{patient.email || 'N/A'}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-900">{patient.diagnosis}</TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-900">{patient.lastVisit}</TableCell>
                      <TableCell className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeletePatient(patient)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Patient Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
        patient={selectedPatient}
        mode={modalMode}
      />
    </Layout>
  );
};

export default PatientsPage;
