"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Lock,
  Clock,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import ZentryxLogo from "@/components/ui/Zentrix";
import CurrentTimeDisplay from "@/components/ui/timeDisplay";
import { useLoading } from "@/components/providers/LoadingProvider";
import { useAlert } from "@/components/providers/AlertProvider";
import { useRouter } from "next/navigation";
import AnimatedBackground from "@/components/landing-page-components/AnimateBackGround";
import supabase from "@/lib/helper";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [remember, setRemember] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { show, hide, isLoading } = useLoading();
  const { showAlert } = useAlert();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = "Employee ID or Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    show("Logging in...");
  
    if (!validateForm()) return;
  
    try {
      show("Authenticating...", "Verifying credentials");
  
      let emailToUse = formData.usernameOrEmail;
  
      // ✅ Handle username login
      if (!formData.usernameOrEmail.includes("@")) {
        const { data: profileLookup, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", formData.usernameOrEmail)
          .single();
  
        if (error || !profileLookup?.email) {
          show("Login Failed", "Invalid username or account not found.");
          console.error("Username lookup error:", error);
          return;
        }
  
        emailToUse = profileLookup.email;
      }
  
      // ✅ Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: formData.password,
      });
  
  
      if (error || !data?.session?.user) {
        show("Login Failed", error?.message || "No session returned.");
        return;
      }
  
      const user = data.session.user;
  
      // ✅ Fetch profile role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
  
      if (profileError || !profile?.role) {
        show("Login Failed", "User role not found.");
        console.error("Profile fetch error:", profileError);
        return;
      }
  
      const role = profile.role;
      console.log("Logged-in user role:", role);
  
      show("Success", "Logged in successfully!");
  

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "employee") {
        router.push("/employees/dashboard");
      } else {
        show("Login Failed", `Unknown role: ${role}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      show("Unexpected error", err.message || "Something went wrong.");
    } finally {
      hide();
    }
  };
  

  const handleForgotPassword = () =>{
    router.push('/forgotPassword')
  }
  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <AnimatedBackground mousePosition={mousePosition} />

      {/* Current Time Display */}
      <CurrentTimeDisplay />

      {/* Login Card */}
      <div className="relative w-[60vh] max-w-xlg z-10 min-h-auto">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative">
          {/* System features accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-orange-500 rounded-t-3xl"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <ZentryxLogo />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Zentryx
            </h1>
            <p className="text-slate-600 text-sm font-medium">
              Workforce Management System
            </p>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-sm text-slate-700 mb-3">
                <span className="font-semibold text-blue-600">
                  Welcome back!
                </span>
                <br />
                Track time, manage projects, handle payroll
              </p>

              {/* Feature icons */}
              <div className="flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-slate-600">Time Tracking</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs text-slate-600">Team Mgmt</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-slate-600">Payroll</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs text-slate-600">Inventory</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Employee ID/Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                Employee ID or Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="usernameOrEmail"
                  value={formData.usernameOrEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your employee ID or email"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.usernameOrEmail
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 hover:border-slate-300"
                  }`}
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full opacity-0 transition-opacity duration-200 animate-pulse"
                    style={{ opacity: formData.usernameOrEmail ? 1 : 0 }}
                  ></div>
                </div>
              </div>
              {errors.usernameOrEmail && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.usernameOrEmail}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-slate-200 focus:border-blue-500 hover:border-slate-300"
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={isLoading}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                    disabled={isLoading}
                  />
                  {remember && (
                    <div className="absolute inset-0 bg-blue-500 rounded animate-pulse opacity-20"></div>
                  )}
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
                disabled={isLoading}
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-blue-600/50 animate-pulse z-0 rounded-xl" />
              )}
              <span className="flex items-center space-x-2 z-10">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5" />
                    <span>Clock In to Zentryx</span>
                  </>
                )}
              </span>
            </button>

            {/* Role Information */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Access Levels:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>• Employee Portal</div>
                <div>• Project Coordinator</div>
                <div>• HR Manager</div>
                <div>• System Admin</div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600">
                New to Zentryx?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
                  disabled={isLoading}
                  onClick={() => router.push("/register")}
                >
                  Create new account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
