import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Layout } from '../../../components/layout/Layout';
import { Activity, Users, TrendingUp, Calendar } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Active Cases',
      value: '89',
      change: '+5%',
      icon: Activity,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+18%',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Appointments',
      value: '23',
      change: '+2%',
      icon: Calendar,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  return (
    <Layout
      title="Dashboard"
      subtitle={`Welcome back, ${user?.displayName || 'User'}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-xs font-medium text-green-600">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Recent Patients</h3>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {['John Doe - Checkup', 'Jane Smith - Follow-up', 'Robert Johnson - Emergency'].map((patient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-800">{patient}</span>
                  <span className="text-gray-400">{index + 1}h ago</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Upcoming Appointments</h3>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {['Dr. Smith - Cardiology', 'Dr. Johnson - Pediatrics', 'Dr. Williams - General'].map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-800">{appointment}</span>
                  <span className="text-gray-400">{9 + index}:00 AM</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;