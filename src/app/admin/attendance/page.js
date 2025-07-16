'use client'
import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AttendancePage = () => {
  // Sample attendance data
  const [attendanceData] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      department: 'Engineering',
      date: '2024-07-03',
      checkIn: '09:15',
      checkOut: '17:30',
      status: 'present',
      workingHours: '8h 15m',
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Design',
      date: '2024-07-03',
      checkIn: '08:45',
      checkOut: '17:00',
      status: 'present',
      workingHours: '8h 15m',
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      department: 'Marketing',
      date: '2024-07-03',
      checkIn: '10:30',
      checkOut: '--',
      status: 'late',
      workingHours: '--',
      avatar: 'MD'
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@company.com',
      department: 'HR',
      date: '2024-07-03',
      checkIn: '--',
      checkOut: '--',
      status: 'absent',
      workingHours: '--',
      avatar: 'EC'
    },
    {
      id: 5,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@company.com',
      department: 'Engineering',
      date: '2024-07-03',
      checkIn: '09:00',
      checkOut: '18:15',
      status: 'present',
      workingHours: '9h 15m',
      avatar: 'AR'
    },
    {
      id: 6,
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      department: 'Finance',
      date: '2024-07-03',
      checkIn: '08:30',
      checkOut: '16:45',
      status: 'present',
      workingHours: '8h 15m',
      avatar: 'LW'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Get unique departments
  const departments = useMemo(() => {
    return [...new Set(attendanceData.map(item => item.department))];
  }, [attendanceData]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return attendanceData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || item.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [attendanceData, searchTerm, statusFilter, departmentFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const present = attendanceData.filter(item => item.status === 'present').length;
    const late = attendanceData.filter(item => item.status === 'late').length;
    const absent = attendanceData.filter(item => item.status === 'absent').length;
    const total = attendanceData.length;
    
    return { present, late, absent, total };
  }, [attendanceData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'late':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'present':
        return `${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200`;
      case 'late':
        return `${baseClasses} bg-amber-50 text-amber-700 border border-amber-200`;
      case 'absent':
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Dashboard</h1>
              <p className="text-gray-600">Track and manage employee attendance records</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <Calendar className="w-4 h-4" />
                Today
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-600/25">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.present}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Late</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.late}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Absent</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Department Filter */}
              <div className="relative">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Employee</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Department</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Check In</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Check Out</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Working Hours</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((employee, index) => (
                  <tr 
                    key={employee.id} 
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {employee.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {employee.department}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{employee.checkIn}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{employee.checkOut}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 font-medium">{employee.workingHours}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(employee.status)}>
                        {getStatusIcon(employee.status)}
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No employees found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {filteredData.length} of {attendanceData.length} employees
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;