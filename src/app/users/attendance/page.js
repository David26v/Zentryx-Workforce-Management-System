'use client'
import React, { useState } from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Calendar, Clock, TrendingUp, CheckCircle, XCircle, AlertCircle, User,
  CalendarDays, Grid3X3, Search, Filter, Download,
} from 'lucide-react'

const AttendancePage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [currentView, setCurrentView] = useState('calendar')
  const [searchDate, setSearchDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('all')

  const attendanceStats = {
    totalDays: 22,
    presentDays: 18,
    absentDays: 2,
    lateDays: 2,
    attendanceRate: 82,
  }

  const attendanceTableData = [
    { id: 1, date: '2024-01-26', day: 'Friday', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: '9h 0m', overtime: '0h 0m' },
    { id: 2, date: '2024-01-25', day: 'Thursday', status: 'present', checkIn: '09:15 AM', checkOut: '06:05 PM', totalHours: '8h 50m', overtime: '0h 0m' },
    { id: 3, date: '2024-01-24', day: 'Wednesday', status: 'late', checkIn: '09:30 AM', checkOut: '06:30 PM', totalHours: '9h 0m', overtime: '0h 30m' },
    { id: 4, date: '2024-01-23', day: 'Tuesday', status: 'absent', checkIn: '-', checkOut: '-', totalHours: '0h 0m', overtime: '0h 0m' },
    { id: 5, date: '2024-01-22', day: 'Monday', status: 'present', checkIn: '08:55 AM', checkOut: '06:00 PM', totalHours: '9h 5m', overtime: '0h 5m' },
    { id: 6, date: '2024-01-19', day: 'Friday', status: 'present', checkIn: '09:10 AM', checkOut: '06:10 PM', totalHours: '9h 0m', overtime: '0h 0m' },
    { id: 7, date: '2024-01-18', day: 'Thursday', status: 'late', checkIn: '09:25 AM', checkOut: '06:25 PM', totalHours: '9h 0m', overtime: '0h 25m' },
    { id: 8, date: '2024-01-17', day: 'Wednesday', status: 'present', checkIn: '08:45 AM', checkOut: '05:45 PM', totalHours: '9h 0m', overtime: '0h 0m' },
    { id: 9, date: '2024-01-16', day: 'Tuesday', status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: '9h 0m', overtime: '0h 0m' },
    { id: 10, date: '2024-01-15', day: 'Monday', status: 'present', checkIn: '09:05 AM', checkOut: '06:05 PM', totalHours: '9h 0m', overtime: '0h 0m' },
    { id: 11, date: '2024-01-12', day: 'Friday', status: 'absent', checkIn: '-', checkOut: '-', totalHours: '0h 0m', overtime: '0h 0m' },
    { id: 12, date: '2024-01-11', day: 'Thursday', status: 'present', checkIn: '09:00 AM', checkOut: '06:15 PM', totalHours: '9h 15m', overtime: '0h 15m' },
  ]

  const recentAttendance = attendanceTableData.slice(0, 5)

  const filteredAttendanceData = attendanceTableData.filter(record => {
    const matchesDate = !searchDate || record.date.includes(searchDate)
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesMonth = monthFilter === 'all' || new Date(record.date).getMonth() === parseInt(monthFilter)
    return matchesDate && matchesStatus && matchesMonth
  })

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1)
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDate = firstDay.getDay()

    const days = []

    for (let i = 0; i < startDate; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isFuture = date > new Date()

      let status = 'present'
      if (isWeekend) status = 'weekend'
      else if (isFuture) status = 'future'
      else if (Math.random() < 0.1) status = 'absent'
      else if (Math.random() < 0.15) status = 'late'

      days.push({ day, status, isWeekend, isFuture })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-500'
      case 'absent': return 'bg-red-500'
      case 'late': return 'bg-yellow-500'
      case 'weekend': return 'bg-gray-300'
      default: return 'bg-gray-100'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Present</Badge>
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertCircle className="w-3 h-3 mr-1" />Late</Badge>
      default:
        return <Badge variant="outline">-</Badge>
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-gray-600 mt-1">Track your attendance and working hours</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentView === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('calendar')}
              className="flex items-center gap-2 text-xs"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </Button>
            <Button
              variant={currentView === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('table')}
              className="flex items-center gap-2 text-xs"
            >
              <Grid3X3 className="w-4 h-4" />
              Table
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>Employee Dashboard</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceStats.totalDays}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceStats.presentDays}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{attendanceStats.absentDays}</div>
            <p className="text-xs text-muted-foreground">
              -1 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{attendanceStats.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {currentView === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Monthly Attendance
                  </CardTitle>
                  <CardDescription>
                    Your attendance calendar for {monthNames[selectedMonth]} {selectedYear}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (selectedMonth === 0) {
                        setSelectedMonth(11)
                        setSelectedYear(selectedYear - 1)
                      } else {
                        setSelectedMonth(selectedMonth - 1)
                      }
                    }}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (selectedMonth === 11) {
                        setSelectedMonth(0)
                        setSelectedYear(selectedYear + 1)
                      } else {
                        setSelectedMonth(selectedMonth + 1)
                      }
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day && (
                      <div className={`
                        w-full h-full rounded-lg flex items-center justify-center text-sm font-medium
                        ${getStatusColor(day.status)} 
                        ${day.status === 'present' ? 'text-white' : ''}
                        ${day.status === 'absent' ? 'text-white' : ''}
                        ${day.status === 'late' ? 'text-white' : ''}
                        ${day.status === 'weekend' ? 'text-gray-600' : ''}
                        ${day.status === 'future' ? 'text-gray-400 border-2 border-dashed border-gray-300' : ''}
                        transition-all hover:scale-105
                      `}>
                        {day.day}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-500"></div>
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span className="text-sm">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-yellow-500"></div>
                  <span className="text-sm">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gray-300"></div>
                  <span className="text-sm">Weekend</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Attendance
              </CardTitle>
              <CardDescription>
                Your last 5 attendance records
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAttendance.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>In: {record.checkIn}</span>
                      {record.checkOut !== '-' && <span>Out: {record.checkOut}</span>}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(record.status)}
                  </div>
                </div>
              ))}
              
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 text-xs">
                  Full History
                </Button>
                <Button variant="outline" className="flex-1 text-xs">
                  Leave Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Table View */
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search by Date</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="YYYY-MM-DD"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Month</label>
                  <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {monthNames.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex items-end">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Showing {filteredAttendanceData.length} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendanceData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{record.day}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                      <TableCell className={record.overtime !== '0h 0m' ? 'font-medium text-blue-600' : ''}>
                        {record.overtime}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredAttendanceData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No attendance records found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AttendancePage

