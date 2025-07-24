"use client";
import React, { useState, useEffect } from "react";
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
  Activity,
  Bell,
  Settings,
  BarChart3,
  Target,
  Award,
  Zap,
  Sun,
  Moon,
  CloudSun,
  X, // For closing the modal
} from "lucide-react";
import supabase from "@/lib/helper";
import ActionDialog from "./components/ActionDialog"; // Ensure correct path
import BreakInOutModal from "./components/BreakInOutModal"; // Ensure correct path
import OnBreakModal from "./components/OnbreakModal";

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

  // --- Modal State ---
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [breakOutModalOpen, setBreakOutModalOpen] = useState(false);
  const [breakInModalOpen, setBreakInModalOpen] = useState(false);
  const [onBreakModalOpen, setOnBreakModalOpen] = useState(false);
  const [breakThresholdHours, setBreakThresholdHours] = useState(1.0); 
  const [statusLoading, setStatusLoading] = useState(false);
  const [settings, setSettings] = useState(false);
  // --- End Modal State ---

  // --- Loading and Error States ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- End Loading and Error States ---

  // Fetch current user and their profile data
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

        // Fetch profile data
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

        // Fetch recent activities for this user
        const { data: activityData, error: activityError } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", authUser.id)
          .order("time_in", { ascending: false })
          .limit(10);

        if (activityError) throw activityError;

        // Process activity data
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

        // Determine initial check-in/break status
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

        // --- Mock Data ---
        setTasks({ completed: 5, inProgress: 2, pending: 3 });
        setWeeklyStats({
          totalHours: 32.75,
          overtime: 2.25,
          daysPresent: 4,
          totalDays: 5,
        });
        // --- End Mock Data ---
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message || "Failed to load user data.");
      } finally {
        setLoading(false);
        setStatusLoading(false); 
      }
    };

    getUserAndProfile();
    // Corrected dependency array - only run once or when supabase client changes
    // If supabase is a constant client, you can use [] as dependency
    // If it might change, keep [supabase] but ensure it's stable
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

  const handleClockIn = () => {
    setActionDialogOpen(true);
  };

  const confirmClockIn = async () => {
    setActionDialogOpen(false);
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
      console.log("Clocked in successfully");
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
      console.log("Clocked out successfully");
    } catch (error) {
      console.error("Error clocking out:", error);
      alert("Failed to clock out. Please try again.");
    }
  };


  const handleOpenSettings = () =>{
    setSettings(true);
  };

  
  const handleCloseSettings = () =>{
    setSettings(false);
  };

  // --- Break Handlers ---
  const handleStartBreak = () => {
    confirmBreakOut();
  };

  const handleEndBreak = () => {
    setBreakInModalOpen(true);
  };

  const confirmBreakOut = async () => {
    // Confirm Start Break
    setBreakOutModalOpen(false);
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
      setOnBreakModalOpen(true);

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
      console.log("Break started successfully");
    } catch (error) {
      console.error("Error starting break:", error);
      alert("Failed to start break. Please try again.");
    }
  };

  const confirmBreakIn = async () => {
    // Confirm End Break
    setBreakInModalOpen(false);
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
      setOnBreakModalOpen(false);


    // Inside confirmBreakIn, where you create newActivity
      const newActivity = {
        // Use a unique temporary ID
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
      console.log("Break ended successfully");
    } catch (error) {
      console.error("Error ending break:", error);
      alert("Failed to end break. Please try again.");
    }
  };
  // --- End Action Handlers ---

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Clock In/Out Confirmation Modal */}
      <ActionDialog
        key="clock-in-dialog" 
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        currentTime={currentTime}
        onConfirm={confirmClockIn}
        actionType="clockIn"
      />

      {/* Break Start Confirmation Modal */}
      <BreakInOutModal
        key="break-out-modal"
        open={breakOutModalOpen}
        onOpenChange={setBreakOutModalOpen}
        currentTime={currentTime}
        onConfirm={confirmBreakOut} 
        actionType="breakOut"
      />

      {/* Break End Confirmation Modal */}
      <BreakInOutModal
        key="break-in-modal"
        open={breakInModalOpen}
        onOpenChange={setBreakInModalOpen}
        currentTime={currentTime}
        onConfirm={confirmBreakIn} 
        actionType="breakIn"
      />
      <OnBreakModal
        open={onBreakModalOpen}
        totalBreakTime={totalBreakTime}
        breakStartTime={breakStartTime}
        breakThresholdHours={breakThresholdHours}
      />


      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <GreetingIcon className="w-8 h-8" />
                <h2 className="text-3xl font-bold">{getGreeting()}!</h2>
              </div>
              <p className="text-white/90 text-lg mb-4">
                Ready to make today productive?
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{profile?.departments?.name || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-white/80">
                {currentTime.toLocaleDateString("en-US", {
                  timeZoneName: "short",
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-2 rounded-lg ${
                  !isCheckedIn
                    ? "bg-gray-100"
                    : isOnBreak
                    ? "bg-amber-100"
                    : "bg-emerald-100"
                }`}
              >
                <Clock className={`w-6 h-6 ${getStatusColor()}`} />
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
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
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {isCheckedIn ? formatTime(totalWorkedTime) : "0h 0m"}
            </div>
            <div className="text-sm text-gray-600">Hours Today</div>
            {isCheckedIn && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progressPercentage >= 100
                        ? "bg-amber-500"
                        : "bg-emerald-500"
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatTime(weeklyStats.totalHours)}
            </div>
            <div className="text-sm text-gray-600">Total Hours</div>
            <div className="mt-2 text-xs">
              <span className="text-amber-600 font-medium">
                +{formatTime(weeklyStats.overtime)} overtime
              </span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-xs text-gray-500">Tasks</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {tasks.completed}/
              {tasks.completed + tasks.inProgress + tasks.pending}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-purple-500 transition-all duration-300"
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-xs text-gray-500">Attendance</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {weeklyStats.daysPresent}/{weeklyStats.totalDays}
            </div>
            <div className="text-sm text-gray-600">Days Present</div>
            <div className="mt-2 text-xs text-emerald-600 font-medium">
              {weeklyStats.totalDays
                ? Math.round(
                    (weeklyStats.daysPresent / weeklyStats.totalDays) * 100
                  )
                : 0}
              % attendance
            </div>
          </div>
        </div>

        {/* Clock In/Out Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Time Tracking
            </h3>
            <p className="text-gray-600">Manage your work hours and breaks</p>
          </div>
          <div className="p-6">
            {/* Overtime Alert */}
            {overtimeAlert && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900">
                      Overtime Alert
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      You've worked over 8 hours today. Consider taking a break
                      or clocking out.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Clock className="w-8 h-8 mx-auto mb-3 text-indigo-600" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-sm text-gray-600">Current Time</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Coffee className="w-8 h-8 mx-auto mb-3 text-amber-600" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatTime(totalBreakTime)}
                </div>
                <div className="text-sm text-gray-600">Break Time</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Timer className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {checkInTime
                    ? checkInTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </div>
                <div className="text-sm text-gray-600">Checked In At</div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {!isCheckedIn ? (
                <button
                  onClick={handleClockIn}
                  className="col-span-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Clock In to Start Your Day
                </button>
              ) : (
                <>
                  <button
                    onClick={isOnBreak ? handleEndBreak : handleStartBreak}
                    disabled={!isCheckedIn}
                    className={`py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      isOnBreak
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    } ${!isCheckedIn ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Coffee className="w-5 h-5 mr-2" />
                    {isOnBreak ? "End Break" : "Start Break"}
                  </button>
                  <div className="flex items-center justify-center px-4 py-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <MapPin className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-sm text-emerald-700 font-medium">
                      Location Verified
                    </span>
                  </div>
                  <button
                    onClick={handleClockOut}
                    disabled={!isCheckedIn}
                    className={`bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      !isCheckedIn ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Clock Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Quick Overview
                </h3>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Tasks Completed
                      </p>
                      <p className="text-sm text-gray-600">This week</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {tasks.completed}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Timer className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Avg. Daily Hours
                      </p>
                      <p className="text-sm text-gray-600">This week</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyStats.daysPresent > 0
                      ? formatTime(
                          weeklyStats.totalHours / weeklyStats.daysPresent
                        )
                      : "0h 0m"}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Punctuality Score
                      </p>
                      <p className="text-sm text-gray-600">This month</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">95%</div>
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
