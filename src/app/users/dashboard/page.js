import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Coffee, 
  LogIn, 
  LogOut, 
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  User,
  Timer,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalWorkedTime, setTotalWorkedTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [overtimeAlert, setOvertimeAlert] = useState(false);

  // Mock employee data
  const employee = {
    name: 'Juan Dela Cruz',
    position: 'Software Developer',
    department: 'IT Department',
    shift: '9:00 AM - 5:00 PM'
  };

  // Mock recent activities
  const recentActivities = [
    { time: '08:55', action: 'Checked In', date: 'Today' },
    { time: '12:00', action: 'Break Started', date: 'Today' },
    { time: '13:00', action: 'Break Ended', date: 'Today' },
    { time: '17:30', action: 'Checked Out', date: 'Yesterday' },
  ];

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate worked time
  useEffect(() => {
    if (isCheckedIn && checkInTime) {
      const timer = setInterval(() => {
        const now = new Date();
        const worked = (now - checkInTime) / (1000 * 60 * 60);
        setTotalWorkedTime(worked);
        
        if (worked > 8) {
          setOvertimeAlert(true);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCheckedIn, checkInTime]);

  const handleClockIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
    setTotalWorkedTime(0);
    setTotalBreakTime(0);
    setOvertimeAlert(false);
  };

  const handleClockOut = () => {
    setIsCheckedIn(false);
    setIsOnBreak(false);
    setCheckInTime(null);
    setBreakStartTime(null);
  };

  const handleBreakToggle = () => {
    if (isOnBreak) {
      setIsOnBreak(false);
      setBreakStartTime(null);
    } else {
      setIsOnBreak(true);
      setBreakStartTime(new Date());
    }
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusColor = () => {
    if (!isCheckedIn) return 'text-gray-500';
    if (isOnBreak) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getStatusText = () => {
    if (!isCheckedIn) return 'Not Checked In';
    if (isOnBreak) return 'On Break';
    return 'Working';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {employee.name}
              </h1>
              <p className="text-gray-600 mt-1">{employee.position} • {employee.department}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Time Tracker Widget */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Clock className="w-7 h-7 mr-3 text-blue-600" />
              Time Tracker
            </h2>
            <div className={`flex items-center px-4 py-2 rounded-full bg-white/50 ${getStatusColor()}`}>
              <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
              <span className="font-medium">{getStatusText()}</span>
            </div>
          </div>

          {/* Current Status Display */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Clock Display */}
              <div className="text-center">
                <div className="bg-white/50 rounded-xl p-6">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm text-gray-600">Current Time</div>
                </div>
              </div>

              {/* Work Hours */}
              <div className="text-center">
                <div className="bg-white/50 rounded-xl p-6">
                  <Timer className="w-12 h-12 mx-auto mb-3 text-emerald-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {isCheckedIn ? formatTime(totalWorkedTime) : '0h 0m'}
                  </div>
                  <div className="text-sm text-gray-600">Hours Worked</div>
                </div>
              </div>

              {/* Break Time */}
              <div className="text-center">
                <div className="bg-white/50 rounded-xl p-6">
                  <Coffee className="w-12 h-12 mx-auto mb-3 text-amber-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {formatTime(totalBreakTime)}
                  </div>
                  <div className="text-sm text-gray-600">Break Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Overtime Alert */}
          {overtimeAlert && (
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
                <div>
                  <p className="font-medium text-amber-800">Overtime Alert</p>
                  <p className="text-sm text-amber-700">You've worked over 8 hours today. Consider taking a break!</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!isCheckedIn ? (
              <button
                onClick={handleClockIn}
                className="col-span-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Clock In
              </button>
            ) : (
              <>
                <button
                  onClick={handleBreakToggle}
                  className={`py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    isOnBreak 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                  }`}
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  {isOnBreak ? 'End Break' : 'Start Break'}
                </button>
                
                <div className="flex items-center justify-center px-4 py-4 bg-white/50 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700">Location Verified</span>
                </div>
                
                <button
                  onClick={handleClockOut}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Clock Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Today's Summary */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Today's Summary</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check In:</span>
                <span className="font-medium">{isCheckedIn ? checkInTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expected Out:</span>
                <span className="font-medium">5:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span>
              </div>
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">This Week</h3>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Hours:</span>
                <span className="font-medium">32h 45m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overtime:</span>
                <span className="font-medium text-amber-600">2h 15m</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Days Present:</span>
                <span className="font-medium">4/5</span>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Tasks Today</h3>
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium text-emerald-600">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">In Progress:</span>
                <span className="font-medium text-blue-600">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending:</span>
                <span className="font-medium text-amber-600">1</span>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Profile</h3>
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">IT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shift:</span>
                <span className="font-medium">9AM-5PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Employee ID:</span>
                <span className="font-medium">EMP001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-purple-600" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-4 bg-white/50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                  <span className="font-medium text-gray-800">{activity.action}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">{activity.time}</div>
                  <div className="text-xs text-gray-500">{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;