import React from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Layout } from '../../../components/layout/Layout';
import { BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {

  const analyticsData = [
    {
      title: 'Patient Visits',
      current: 456,
      previous: 389,
      percentage: 17.2,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Revenue Growth',
      current: '$125,430',
      previous: '$98,230',
      percentage: 27.7,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Active Treatments',
      current: 89,
      previous: 76,
      percentage: 17.1,
      icon: Activity,
      color: 'bg-purple-500'
    },
    {
      title: 'Success Rate',
      current: '94.5%',
      previous: '91.2%',
      percentage: 3.6,
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  const monthlyData = [
    { month: 'Jan', patients: 320, revenue: 45000 },
    { month: 'Feb', patients: 380, revenue: 52000 },
    { month: 'Mar', patients: 420, revenue: 58000 },
    { month: 'Apr', patients: 390, revenue: 51000 },
    { month: 'May', patients: 456, revenue: 62000 },
    { month: 'Jun', patients: 480, revenue: 68000 }
  ];

  return (
    <Layout 
      title="Analytics Dashboard" 
      subtitle="Healthcare metrics and insights"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {analyticsData.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 font-medium">{item.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{item.current}</p>
                    <p className="text-xs font-medium text-green-600">+{item.percentage}%</p>
                  </div>
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Patient Overview</h3>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-gray-400" />
                <p className="ml-3 text-gray-500">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardHeader className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Revenue Trends</h3>
            </CardHeader>
            <CardContent className="p-5">
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-gray-400" />
                <p className="ml-3 text-gray-500">Chart placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <CardHeader className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">Monthly Data</h3>
          </CardHeader>
          <CardContent className="p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell>{row.patients}</TableCell>
                    <TableCell>${row.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">+{Math.round((row.patients / 100) * 10)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
