import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Layout } from '../../../components/layout/Layout';
import { patientService } from '../../../services/patientService';
import type { Patient } from '../../../types/patient';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Activity,
  AlertTriangle,
  FileText,
  Heart,
  Droplet
} from 'lucide-react';

export const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      
      console.log('Fetching patient with ID:', id);
      setLoading(true);
      try {
        const patientData = await patientService.getPatientById(id);
        console.log('Received patient data:', patientData);
        setPatient(patientData);
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'stable':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return '👨';
      case 'female':
        return '👩';
      default:
        return '👤';
    }
  };

  if (loading) {
    return (
      <Layout title="Patient Details" subtitle="Loading patient information...">
        <div className="min-h-96 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout title="Patient Not Found" subtitle="The requested patient could not be found.">
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Not Found</h3>
            <p className="text-gray-500 mb-6">The patient you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/patients')} className="bg-blue-600 hover:bg-blue-700 text-white">
              Back to Patients
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Patient Details" 
      subtitle={`Comprehensive information for ${patient.name}`}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <Button 
            variant="outline" 
            onClick={() => navigate('/patients')}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Button>
        </div>

        <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">{getGenderIcon(patient.gender)}</span>
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">{patient.name}</h1>
                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {patient.age} years, {patient.gender}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(patient.status)}`}>
                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{patient.phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold text-gray-900">{patient.email || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</p>
                  <p className="text-sm font-semibold text-gray-900">{patient.lastVisit}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{patient.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="rounded-xl border border-gray-100 shadow-sm">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Medical Information</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Primary Diagnosis</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-red-800">{patient.diagnosis}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Blood Type</p>
                <div className="flex items-center space-x-2">
                  <Droplet className="w-4 h-4 text-red-500" />
                  <span className="text-lg font-bold text-gray-900">{patient.bloodType || 'N/A'}</span>
                </div>
              </div>
              
              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Allergies</p>
                  <div className="space-y-2">
                    {patient.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-yellow-800">{allergy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Treatment Status</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="text-center py-4">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(patient.status)}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    patient.status === 'active' ? 'bg-green-500' :
                    patient.status === 'critical' ? 'bg-red-500' :
                    patient.status === 'stable' ? 'bg-blue-500' :
                    patient.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Patient ID</span>
                  <span className="text-sm font-semibold text-gray-900">#{patient.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Age Group</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {patient.age < 18 ? 'Pediatric' : patient.age < 65 ? 'Adult' : 'Senior'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`text-sm font-semibold ${
                    patient.age > 65 || patient.status === 'critical' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {patient.age > 65 || patient.status === 'critical' ? 'High' : 'Normal'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Clinical Notes</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {patient.notes ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{patient.notes}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No clinical notes available</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span className="font-medium">{new Date(patient.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span className="font-medium">{new Date(patient.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PatientDetailsPage;
