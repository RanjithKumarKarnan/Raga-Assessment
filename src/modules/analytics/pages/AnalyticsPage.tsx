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
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {analyticsData.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <CardContent className="p-3 sm:p-4 lg:p-5 flex items-center justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">{item.title}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">{item.current}</p>
                    <p className="text-xs font-medium text-green-600">+{item.percentage}%</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl ${item.color} flex-shrink-0 ml-2 sm:ml-3`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="rounded-xl border border-gray-100 shadow-sm">
            <CardHeader className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-gray-100">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Patient Overview</h3>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="h-48 sm:h-56 lg:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-500">Chart placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-100 shadow-sm">
            <CardHeader className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-gray-100">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Revenue Trends</h3>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-5">
              <div className="h-48 sm:h-56 lg:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-500">Chart placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-xl border border-gray-100 shadow-sm">
          <CardHeader className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Monthly Data</h3>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-5">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Month</TableHead>
                    <TableHead className="text-xs sm:text-sm">Patients</TableHead>
                    <TableHead className="text-xs sm:text-sm">Revenue</TableHead>
                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-xs sm:text-sm">{row.month}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{row.patients}</TableCell>
                      <TableCell className="text-xs sm:text-sm">${row.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600 text-xs sm:text-sm hidden sm:table-cell">+{Math.round((row.patients / 100) * 10)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
