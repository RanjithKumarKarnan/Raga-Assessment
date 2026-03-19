import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Layout } from '../../../components/layout/Layout';
import { PatientModal } from '../../../components/patients/PatientModal';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { patientService } from '../../../services/patientService';
import type { Patient } from '../../../types/patient';
import { Users, Activity, Search, Plus, Edit, Eye } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      if (mobile) {
        setViewMode('grid');
      } else {
        setViewMode('table');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
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

  const handleViewDetails = (patient: Patient) => {
    navigate(`/patients/${patient.id}`);
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
      <Layout title="Patient Management" subtitle="Loading patients...">
        <div className="min-h-96 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Patient Management" 
      subtitle={`Total Patients: ${filteredPatients.length}`}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Grid
                </button>
              </div>
              <div className="sm:hidden text-sm text-gray-500">
                Grid View
              </div>
              <div className="hidden sm:block text-sm text-gray-500">
                {viewMode === 'table' ? 'Table View' : 'Grid View'}
              </div>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
              />
            </div>
          </div>
          <Button onClick={handleCreatePatient} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add New Patient</span>
            <span className="sm:hidden">Add Patient</span>
          </Button>
        </div>

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

        {filteredPatients.length === 0 ? (
          <Card className="rounded-xl border border-gray-100 shadow-sm">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or add a new patient.</p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white font-semibold text-lg">
                          {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg truncate">{patient.name}</h3>
                        <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Diagnosis</p>
                        <p className="text-sm font-semibold text-gray-900">{patient.diagnosis}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Visit</p>
                        <p className="text-sm font-semibold text-gray-900">{patient.lastVisit}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Blood Type</p>
                        <p className="text-sm font-semibold text-gray-900">{patient.bloodType || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                        <p className="text-sm font-semibold text-gray-900">{patient.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {patient.allergies && patient.allergies.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {patient.allergies.map((allergy, index) => (
                          <span key={index} className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded-md border border-red-200 font-medium">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex space-x-3">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors"
                      onClick={() => handleViewDetails(patient)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-2.5 transition-colors"
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
          <Card className="rounded-xl border border-gray-100 shadow-sm">
            <CardHeader className="px-3 sm:px-4 lg:px-6 py-3 sm:py-5 border-b border-gray-100">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Patient List</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</TableHead>
                      <TableHead className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</TableHead>
                      <TableHead className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</TableHead>
                      <TableHead className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Last Visit</TableHead>
                      <TableHead className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                      <TableHead className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{patient.name}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{patient.age} years, {patient.gender}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <div className="text-xs sm:text-sm text-gray-900">{patient.phone || 'N/A'}</div>
                          <div className="text-xs sm:text-sm text-gray-500 truncate">{patient.email || 'N/A'}</div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="text-xs sm:text-sm text-gray-900 truncate">{patient.diagnosis}</div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden md:table-cell">
                          <div className="text-xs sm:text-sm text-gray-900">{patient.lastVisit}</div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                            {patient.status}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                              onClick={() => handleViewDetails(patient)}
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden xs:inline">View</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-gray-200 text-gray-700 hover:bg-gray-50 text-xs px-2 py-1"
                              onClick={() => handleEditPatient(patient)}
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              <span className="hidden xs:inline">Edit</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
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
