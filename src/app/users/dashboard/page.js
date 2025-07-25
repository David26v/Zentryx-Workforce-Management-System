// app/dashboard/page.js
"use client";
import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Coffee,
  LogIn,
  LogOut,
  Calendar as CalendarIcon, // Renamed import to avoid conflict
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Timer,
  Activity,
  BarChart3,
  Target,
  Award,
  Zap,
  Sun,
  Moon,
  CloudSun,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  Bell, // For notifications
  MessageCircle, // For chat
  Mail, // For email
} from "lucide-react";
// Import the custom Calendar component
import { Calendar } from "@/components/ui/calendar"; // Adjust path if necessary
import supabase from "@/lib/helper";
import CustomCalendar from "@/components/ui/customCalendar";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalWorkedTime, setTotalWorkedTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [overtimeAlert, setOvertimeAlert] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState({
    totalHours: 0,
    overtime: 0,
    daysPresent: 0,
    totalDays: 5,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [tasks, setTasks] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [clientPreferences, setClientPreferences] = useState({
    platform: "web",
    notifications: true,
    autoBreak: false,
  });
  // State for the Calendar component
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State for calendar tabs
  const [activeTab, setActiveTab] = useState("task"); // Default to 'task'
  // Mock notification counts (replace with real data fetching logic)
  const [notificationCounts, setNotificationCounts] = useState({
    chat: 3,
    email: 5,
  });

  useEffect(() => {
    const getUserAndProfile = async () => {
      try {
        setLoading(true);
        setStatusLoading(true);
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!authUser) {
          setError("No user logged in.");
          setLoading(false);
          return;
        }
        setUser(authUser);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(
            `
            id,
            username,
            first_name,
            last_name,
            email,
            avatar,
            shift_id,
            department_id,
            departments(name),
            shifts(name)
          `
          )
          .eq("id", authUser.id)
          .single();
        if (profileError) throw profileError;
        setProfile(profileData);
        const { data: activityData, error: activityError } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", authUser.id)
          .order("time_in", { ascending: false })
          .limit(10);
        if (activityError) throw activityError;
        const processedActivities = activityData.map((record) => {
          const today = new Date().toDateString();
          const recordDate = new Date(record.time_in).toDateString();
          const dateLabel = recordDate === today ? "Today" : "Previous";
          let action = "Checked In";
          let type = "check_in";
          let displayTime = record.time_in
            ? new Date(record.time_in).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--";
          if (record.time_out) {
            action = "Checked Out";
            type = "check_out";
            displayTime = new Date(record.time_out).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else if (record.break_end) {
            action = "Break Ended";
            type = "break_end";
            displayTime = new Date(record.break_end).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else if (record.break_start) {
            action = "Break Started";
            type = "break_start";
            displayTime = new Date(record.break_start).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          }
          return {
            id: record.id,
            time: displayTime,
            action: action,
            date: dateLabel,
            type: type,
          };
        });
        setRecentActivities(processedActivities);
        if (activityData && activityData.length > 0) {
          const latestRecord = activityData[0];
          if (latestRecord.time_in && !latestRecord.time_out) {
            setIsCheckedIn(true);
            setCheckInTime(new Date(latestRecord.time_in));
            if (latestRecord.break_start && !latestRecord.break_end) {
              setIsOnBreak(true);
              setBreakStartTime(new Date(latestRecord.break_start));
            }
          }
        }
        setTasks({ completed: 5, inProgress: 2, pending: 3 });
        setWeeklyStats({
          totalHours: 32.75,
          overtime: 2.25,
          daysPresent: 4,
          totalDays: 5,
        });
      } catch (error) {
        console.error("Error fetching user ", error);
        setError(error.message || "Failed to load user data.");
      } finally {
        setLoading(false);
        setStatusLoading(false);
      }
    };
    getUserAndProfile();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isCheckedIn && checkInTime && !isOnBreak) {
      const timer = setInterval(() => {
        const now = new Date();
        const workedMs = now - checkInTime;
        const workedHours = workedMs / (1000 * 60 * 60);
        setTotalWorkedTime(workedHours);
        if (workedHours > 8) {
          setOvertimeAlert(true);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCheckedIn, checkInTime, isOnBreak]);

  useEffect(() => {
    let timer;
    if (isOnBreak && breakStartTime) {
      const initialBreakMs = Date.now() - breakStartTime.getTime();
      const initialBreakHours = initialBreakMs / (1000 * 60 * 60);
      setTotalBreakTime(initialBreakHours);
      timer = setInterval(() => {
        setTotalBreakTime((prev) => prev + 1 / (60 * 60));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOnBreak, breakStartTime]);

  const handleClockIn = async () => {
    try {
      const now = new Date();
      const { data, error } = await supabase
        .from("attendance")
        .insert([
          {
            user_id: user.id,
            time_in: now.toISOString(),
          },
        ])
        .select();
      if (error) throw error;
      setIsCheckedIn(true);
      setCheckInTime(now);
      setTotalWorkedTime(0);
      setTotalBreakTime(0);
      setOvertimeAlert(false);
      setIsOnBreak(false);
      const newActivity = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "Checked In",
        date: "Today",
        type: "check_in",
      };
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Error clocking in:", error);
      alert("Failed to clock in. Please try again.");
    }
  };

  const handleClockOut = async () => {
    try {
      const { data: openRecord, error: fetchError } = await supabase
        .from("attendance")
        .select("id")
        .eq("user_id", user.id)
        .is("time_out", null)
        .order("time_in", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (fetchError) throw fetchError;
      if (!openRecord) {
        alert("No active check-in found to clock out from.");
        return;
      }
      const now = new Date();
      const { data, error: updateError } = await supabase
        .from("attendance")
        .update({ time_out: now.toISOString() })
        .eq("id", openRecord.id)
        .select();
      if (updateError) throw updateError;
      setIsCheckedIn(false);
      setIsOnBreak(false);
      setCheckInTime(null);
      setBreakStartTime(null);
      setTotalWorkedTime(0);
      setTotalBreakTime(0);
      const newActivity = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "Checked Out",
        date: "Today",
        type: "check_out",
      };
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Error clocking out:", error);
      alert("Failed to clock out. Please try again.");
    }
  };

  const handleStartBreak = async () => {
    try {
      const { data: openRecord, error: fetchError } = await supabase
        .from("attendance")
        .select("id")
        .eq("user_id", user.id)
        .is("time_out", null)
        .order("time_in", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (fetchError) throw fetchError;
      if (!openRecord) {
        alert("No active session found to start break.");
        return;
      }
      const now = new Date();
      const { data, error: updateError } = await supabase
        .from("attendance")
        .update({ break_start: now.toISOString() })
        .eq("id", openRecord.id)
        .select();
      if (updateError) throw updateError;
      setIsOnBreak(true);
      setBreakStartTime(now);
      const newActivity = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "Break Started",
        date: "Today",
        type: "break_start",
      };
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Error starting break:", error);
      alert("Failed to start break. Please try again.");
    }
  };

  const handleEndBreak = async () => {
    try {
      const { data: openRecord, error: fetchError } = await supabase
        .from("attendance")
        .select("id, break_start")
        .eq("user_id", user.id)
        .is("time_out", null)
        .order("time_in", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (fetchError) throw fetchError;
      if (!openRecord || !openRecord.break_start) {
        alert("No active break found to end.");
        return;
      }
      const now = new Date();
      const { data, error: updateError } = await supabase
        .from("attendance")
        .update({ break_end: now.toISOString() })
        .eq("id", openRecord.id)
        .select();
      if (updateError) throw updateError;
      setIsOnBreak(false);
      setBreakStartTime(null);
      const newActivity = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "Break Ended",
        date: "Today",
        type: "break_end",
      };
      setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Error ending break:", error);
      alert("Failed to end break. Please try again.");
    }
  };

  const savePreferences = () => {
    localStorage.setItem("clientPreferences", JSON.stringify(clientPreferences));
    setShowPreferences(false);
  };

  const formatTime = (hours) => {
    if (isNaN(hours) || hours < 0) return "0h 0m";
    const totalMinutes = Math.floor(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  const getStatusColor = () => {
    if (!isCheckedIn) return "text-slate-500";
    if (isOnBreak) return "text-amber-500";
    return "text-emerald-500";
  };

  const getStatusText = () => {
    if (!isCheckedIn) return "Not Checked In";
    if (isOnBreak) return "On Break";
    return "Working";
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getGreetingIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return Sun;
    if (hour < 17) return CloudSun;
    return Moon;
  };

  const GreetingIcon = getGreetingIcon();

  const getActivityIcon = (type) => {
    switch (type) {
      case "check_in":
        return <LogIn className="w-4 h-4 text-emerald-500" />;
      case "check_out":
        return <LogOut className="w-4 h-4 text-red-500" />;
      case "break_start":
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case "break_end":
        return <Zap className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const progressPercentage = Math.min((totalWorkedTime / 8) * 100, 100);

  // Apply blue/purple theme colors to loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="relative inline-flex">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-indigo-600"></div>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="h-4 bg-indigo-200 rounded-full animate-pulse mx-auto max-w-xs"></div>
            <div className="h-4 bg-indigo-200 rounded-full animate-pulse mx-auto max-w-md"></div>
          </div>
          <div className="mt-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-4 border border-indigo-100"
                >
                  <div className="space-y-3">
                    <div className="h-3 bg-indigo-100 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-indigo-200 rounded-full animate-pulse"></div>
                    <div className="h-3 bg-indigo-100 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-100">
              <div className="space-y-4">
                <div className="h-4 bg-indigo-200 rounded-full animate-pulse w-1/4"></div>
                <div className="h-2 bg-indigo-100 rounded-full animate-pulse"></div>
                <div className="h-2 bg-indigo-100 rounded-full animate-pulse w-5/6"></div>
                <div className="h-2 bg-indigo-100 rounded-full animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>
          <p className="mt-8 text-gray-600 font-medium">
            Preparing your workspace
          </p>
          <div className="mt-2 flex justify-center">
            <div className="h-1.5 bg-indigo-200 rounded-full w-32 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes progress {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          .animate-progress {
            animation: progress 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Apply blue/purple theme colors to error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold">Client Preferences</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "web", label: "Web", icon: Monitor },
                    { value: "mobile", label: "Mobile", icon: Smartphone },
                    { value: "tablet", label: "Tablet", icon: Tablet },
                  ].map((platform) => (
                    <button
                      key={platform.value}
                      className={`p-3 rounded-lg border flex flex-col items-center ${
                        clientPreferences.platform === platform.value
                          ? "border-indigo-500 bg-indigo-50" // Use indigo theme
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        setClientPreferences({
                          ...clientPreferences,
                          platform: platform.value,
                        })
                      }
                    >
                      <platform.icon className="w-5 h-5 mb-1" />
                      <span className="text-xs">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-gray-500">
                    Receive alerts and updates
                  </div>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    clientPreferences.notifications
                      ? "bg-indigo-600" // Use indigo theme
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    setClientPreferences({
                      ...clientPreferences,
                      notifications: !clientPreferences.notifications,
                    })
                  }
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      clientPreferences.notifications
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto Break</div>
                  <div className="text-sm text-gray-500">
                    Automatically start breaks
                  </div>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    clientPreferences.autoBreak
                      ? "bg-indigo-600" // Use indigo theme
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    setClientPreferences({
                      ...clientPreferences,
                      autoBreak: !clientPreferences.autoBreak,
                    })
                  }
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      clientPreferences.autoBreak
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowPreferences(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" // Use indigo theme
                onClick={savePreferences}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome Section - Simplified without gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white"> {/* Retained gradient */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <GreetingIcon className="w-6 h-6" />
                <h1 className="text-2xl font-bold">{getGreeting()}!</h1>
              </div>
              <p className="text-white/90">
                Ready to make today productive?
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-white/80 text-sm">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <button
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                onClick={() => setShowPreferences(true)}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Calendar and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section with Tabs and Notifications */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" /> {/* Use indigo theme icon color */}
                <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
              </div>
              {/* Notifications Section */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MessageCircle className="w-5 h-5 text-gray-500 hover:text-indigo-600 cursor-pointer" />
                  {notificationCounts.chat > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCounts.chat}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-500 hover:text-indigo-600 cursor-pointer" />
                  {notificationCounts.email > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCounts.email}
                    </span>
                  )}
                </div>
                <Bell className="w-5 h-5 text-gray-500 hover:text-indigo-600 cursor-pointer" />
              </div>
            </div>
            <div className="flex justify-center mb-4">
              {/* Custom Calendar Component */}
              <CustomCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                className="rounded-md border w-full"
                // The theme is handled by your custom Calendar component's CSS/Tailwind
              />
            </div>
            <div className="mt-2 text-center text-sm text-gray-600 mb-4">
              Selected Date: {selectedDate.toLocaleDateString()}
            </div>

            {/* Tabs Section */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {[
                  { id: "task", label: "Tasks" },
                  { id: "project", label: "Projects" },
                  { id: "leave", label: "Leave Requests" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content Placeholder */}
            <div className="mt-4">
              {activeTab === "task" && (
                <div className="text-gray-700">
                  <h3 className="font-medium text-lg mb-2">Tasks for {selectedDate.toLocaleDateString()}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Review project proposal</li>
                    <li>Update team status report</li>
                    <li className="text-gray-500 line-through">Schedule meeting with client</li>
                  </ul>
                </div>
              )}
              {activeTab === "project" && (
                <div className="text-gray-700">
                  <h3 className="font-medium text-lg mb-2">Projects Due {selectedDate.toLocaleDateString()}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li className="text-blue-600">Website Redesign (Due: 2024-06-20)</li>
                    <li>Mobile App Launch (Due: 2024-07-15)</li>
                  </ul>
                </div>
              )}
              {activeTab === "leave" && (
                <div className="text-gray-700">
                  <h3 className="font-medium text-lg mb-2">Leave Requests for {selectedDate.toLocaleDateString()}</h3>
                  <p className="text-gray-500">No leave requests found for this date.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats and Controls Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      !isCheckedIn
                        ? "bg-gray-100"
                        : isOnBreak
                        ? "bg-amber-100"
                        : "bg-emerald-100"
                    }`}
                  >
                    <Clock className={`w-5 h-5 ${getStatusColor()}`} />
                  </div>
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      !isCheckedIn
                        ? "bg-gray-100 text-gray-700"
                        : isOnBreak
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {getStatusText()}
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {isCheckedIn ? formatTime(totalWorkedTime) : "0h 0m"}
                </div>
                <div className="text-sm text-gray-600">Hours Today</div>
                {isCheckedIn && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          progressPercentage >= 100
                            ? "bg-amber-500"
                            : "bg-indigo-500" // Use indigo theme for progress
                        }`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(progressPercentage)}% of 8 hours
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg"> {/* Use blue theme */}
                    <TrendingUp className="w-5 h-5 text-blue-600" /> {/* Use blue theme */}
                  </div>
                  <div className="text-xs text-gray-500">This Week</div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {formatTime(weeklyStats.totalHours)}
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
                <div className="mt-1 text-xs">
                  <span className="text-amber-600 font-medium">
                    +{formatTime(weeklyStats.overtime)} overtime
                  </span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg"> {/* Use purple theme */}
                    <Target className="w-5 h-5 text-purple-600" /> {/* Use purple theme */}
                  </div>
                  <div className="text-xs text-gray-500">Tasks</div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {tasks.completed}/
                  {tasks.completed + tasks.inProgress + tasks.pending}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-purple-500 transition-all duration-300" // Use purple theme
                      style={{
                        width: `${
                          (tasks.completed /
                            (tasks.completed + tasks.inProgress + tasks.pending)) *
                            100 || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg"> {/* Use indigo theme */}
                    <Award className="w-5 h-5 text-indigo-600" /> {/* Use indigo theme */}
                  </div>
                  <div className="text-xs text-gray-500">Attendance</div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {weeklyStats.daysPresent}/{weeklyStats.totalDays}
                </div>
                <div className="text-sm text-gray-600">Days Present</div>
                <div className="mt-1 text-xs text-indigo-600 font-medium"> {/* Use indigo theme */}
                  {weeklyStats.totalDays
                    ? Math.round(
                        (weeklyStats.daysPresent / weeklyStats.totalDays) * 100
                      )
                    : 0}
                  % attendance
                </div>
              </div>
            </div>

            {/* Time Tracking Section */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-5 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Time Tracking</h2>
                <p className="text-gray-600 text-sm">Manage your work hours and breaks</p>
              </div>
              <div className="p-5">
                {overtimeAlert && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-amber-900">Overtime Alert</h3>
                        <p className="text-sm text-amber-700 mt-1">
                          You've worked over 8 hours today. Consider taking a break or clocking out.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-100"> {/* Use indigo theme */}
                    <Clock className="w-6 h-6 mx-auto mb-2 text-indigo-600" /> {/* Use indigo theme */}
                    <div className="text-lg font-bold text-gray-900">
                      {currentTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-xs text-gray-600">Current Time</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-100"> {/* Keep amber for break */}
                    <Coffee className="w-6 h-6 mx-auto mb-2 text-amber-600" /> {/* Keep amber for break */}
                    <div className="text-lg font-bold text-gray-900">
                      {formatTime(totalBreakTime)}
                    </div>
                    <div className="text-xs text-gray-600">Break Time</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100"> {/* Keep emerald for check-in */}
                    <Timer className="w-6 h-6 mx-auto mb-2 text-emerald-600" /> {/* Keep emerald for check-in */}
                    <div className="text-lg font-bold text-gray-900">
                      {checkInTime
                        ? checkInTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </div>
                    <div className="text-xs text-gray-600">Checked In At</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {!isCheckedIn ? (
                    <button
                      onClick={handleClockIn}
                      className="col-span-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition shadow-sm" // Use emerald theme
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Clock In
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={isOnBreak ? handleEndBreak : handleStartBreak}
                        disabled={!isCheckedIn}
                        className={`py-3 px-4 rounded-lg font-medium flex items-center justify-center transition shadow-sm ${
                          isOnBreak
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" // Use blue theme
                        } ${!isCheckedIn ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Coffee className="w-4 h-4 mr-2" />
                        {isOnBreak ? "End Break" : "Start Break"}
                      </button>
                      <div className="flex items-center justify-center px-4 py-3 bg-emerald-50 rounded-lg border border-emerald-200"> {/* Keep emerald for location */}
                        <MapPin className="w-4 h-4 text-emerald-600 mr-2" /> {/* Keep emerald for location */}
                        <span className="text-sm text-emerald-700 font-medium">
                          Location Verified
                        </span>
                      </div>
                      <button
                        onClick={handleClockOut}
                        disabled={!isCheckedIn}
                        className={`py-3 px-4 rounded-lg font-medium flex items-center justify-center transition shadow-sm ${
                          !isCheckedIn
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white" // Keep red for clock out
                        }`}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Clock Out
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Grid - Activities and Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-5 border-b flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                  <Activity className="w-5 h-5 text-indigo-400" /> {/* Use indigo theme icon color */}
                </div>
                <div className="p-5">
                  <div className="space-y-3">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-indigo-50 transition" // Use indigo theme hover
                        >
                          <div className="flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                          <div className="text-sm font-medium text-gray-600">
                            {activity.time}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No recent activity found.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-5 border-b flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Quick Overview</h2>
                  <BarChart3 className="w-5 h-5 text-indigo-400" /> {/* Use indigo theme icon color */}
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"> {/* Keep emerald for tasks */}
                          <CheckCircle className="w-5 h-5 text-emerald-600" /> {/* Keep emerald for tasks */}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Tasks Completed</p>
                          <p className="text-xs text-gray-600">This week</p>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-emerald-600"> {/* Keep emerald for tasks */}
                        {tasks.completed}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"> {/* Use blue theme */}
                          <Timer className="w-5 h-5 text-blue-600" /> {/* Use blue theme */}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Avg. Daily Hours</p>
                          <p className="text-xs text-gray-600">This week</p>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-blue-600"> {/* Use blue theme */}
                        {weeklyStats.daysPresent > 0
                          ? formatTime(
                              weeklyStats.totalHours / weeklyStats.daysPresent
                            )
                          : "0h 0m"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"> {/* Use purple theme */}
                          <Award className="w-5 h-5 text-purple-600" /> {/* Use purple theme */}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Punctuality Score</p>
                          <p className="text-xs text-gray-600">This month</p>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-purple-600"> {/* Use purple theme */}
                        95%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
