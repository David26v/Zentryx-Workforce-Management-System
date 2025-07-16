'use client'
import React, { useState } from 'react';
import { 
  Plus,
  Edit,
  Trash2,
  Clock,
  Users,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Eye,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';

const ShiftPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  // Mock shift data
  const [shifts, setShifts] = useState([
    {
      id: 1,
      name: 'Morning Shift',
      startTime: '08:00',
      endTime: '16:00',
      breakDuration: 60,
      employees: 25,
      department: 'IT Department',
      status: 'active',
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      overtime: true,
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Afternoon Shift',
      startTime: '14:00',
      endTime: '22:00',
      breakDuration: 45,
      employees: 18,
      department: 'Customer Service',
      status: 'active',
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      overtime: false,
      createdDate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Night Shift',
      startTime: '22:00',
      endTime: '06:00',
      breakDuration: 60,
      employees: 12,
      department: 'Security',
      status: 'active',
      workDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      overtime: true,
      createdDate: '2024-02-01'
    },
    {
      id: 4,
      name: 'Weekend Shift',
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 60,
      employees: 8,
      department: 'Maintenance',
      status: 'inactive',
      workDays: ['Saturday', 'Sunday'],
      overtime: false,
      createdDate: '2024-02-10'
    },
    {
      id: 5,
      name: 'Flexible Hours',
      startTime: '07:00',
      endTime: '19:00',
      breakDuration: 60,
      employees: 35,
      department: 'Development',
      status: 'active',
      workDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      overtime: true,
      createdDate: '2024-01-10'
    }
  ]);

  const [newShift, setNewShift] = useState({
    name: '',
    startTime: '',
    endTime: '',
    breakDuration: 60,
    department: '',
    workDays: [],
    overtime: false
  });

  const departments = ['IT Department', 'Customer Service', 'Security', 'Maintenance', 'Development', 'HR', 'Finance'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleCreateShift = () => {
    const shift = {
      id: shifts.length + 1,
      ...newShift,
      employees: 0,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setShifts([...shifts, shift]);
    setShowCreateModal(false);
    setNewShift({
      name: '',
      startTime: '',
      endTime: '',
      breakDuration: 60,
      department: '',
      workDays: [],
      overtime: false
    });
  };

  const handleDeleteShift = (id) => {
    setShifts(shifts.filter(shift => shift.id !== id));
  };

  const handleToggleStatus = (id) => {
    setShifts(shifts.map(shift => 
      shift.id === id 
        ? { ...shift, status: shift.status === 'active' ? 'inactive' : 'active' }
        : shift
    ));
  };

  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shift.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || shift.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalEmployees = shifts.reduce((sum, shift) => sum + shift.employees, 0);
  const activeShifts = shifts.filter(shift => shift.status === 'active').length;

  const formatWorkDays = (days) => {
    if (days.length === 7) return 'All Days';
    if (days.length === 5 && !days.includes('Saturday') && !days.includes('Sunday')) return 'Weekdays';
    if (days.length === 2 && days.includes('Saturday') && days.includes('Sunday')) return 'Weekends';
    return days.slice(0, 3).map(day => day.slice(0, 3)).join(', ') + (days.length > 3 ? '...' : '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shift Management
              </h1>
              <p className="text-gray-600 mt-1">Manage work shifts and schedules for your organization</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Shift
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Shifts</p>
                <p className="text-3xl font-bold text-gray-800">{shifts.length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Shifts</p>
                <p className="text-3xl font-bold text-gray-800">{activeShifts}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Employees</p>
                <p className="text-3xl font-bold text-gray-800">{totalEmployees}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Departments</p>
                <p className="text-3xl font-bold text-gray-800">{new Set(shifts.map(s => s.department)).size}</p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search shifts or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Shifts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShifts.map((shift) => (
            <div key={shift.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{shift.name}</h3>
                  <p className="text-gray-600 text-sm">{shift.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    shift.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {shift.status}
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Time Info */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">{shift.startTime} - {shift.endTime}</span>
                  </div>
                  {shift.overtime && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-600 text-xs rounded-full font-medium">
                      OT Enabled
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Break: {shift.breakDuration} minutes
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Employees:</span>
                  <span className="font-semibold text-gray-800">{shift.employees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Work Days:</span>
                  <span className="font-semibold text-gray-800">{formatWorkDays(shift.workDays)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Created:</span>
                  <span className="font-semibold text-gray-800">{new Date(shift.createdDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-white/50 hover:bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button className="flex-1 bg-white/50 hover:bg-purple-50 text-purple-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 bg-white/50 hover:bg-gray-50 text-gray-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
                <button 
                  onClick={() => handleDeleteShift(shift.id)}
                  className="bg-white/50 hover:bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredShifts.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-white/20 shadow-lg text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No shifts found</h3>
            <p className="text-gray-600 mb-6">Create your first shift to get started with schedule management.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Create First Shift
            </button>
          </div>
        )}

        {/* Create Shift Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Shift</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Name</label>
                    <input
                      type="text"
                      value={newShift.name}
                      onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Morning Shift"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={newShift.department}
                      onChange={(e) => setNewShift({...newShift, department: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newShift.startTime}
                      onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      value={newShift.endTime}
                      onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Break Duration (minutes)</label>
                    <input
                      type="number"
                      value={newShift.breakDuration}
                      onChange={(e) => setNewShift({...newShift, breakDuration: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Days</label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {weekDays.map(day => (
                      <label key={day} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newShift.workDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewShift({...newShift, workDays: [...newShift.workDays, day]});
                            } else {
                              setNewShift({...newShift, workDays: newShift.workDays.filter(d => d !== day)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="overtime"
                    checked={newShift.overtime}
                    onChange={(e) => setNewShift({...newShift, overtime: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="overtime" className="text-sm text-gray-700">Enable Overtime</label>
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateShift}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Create Shift
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftPage;