'use client'
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, User, Lock, Clock, Users, DollarSign, Calendar, Mail, UserPlus, Shield } from 'lucide-react';
import ZentryxLogo from '@/components/ui/Zentrix';
import CurrentTimeDisplay from '@/components/ui/timeDisplay';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/providers/LoadingProvider';
import supabase, { api } from '@/lib/helper';
import { useAlert } from '@/components/providers/AlertProvider';
import { useDialog } from '@/components/providers/DialogProvider';


const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  const [errors, setErrors] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const {show, hide , isLoading  } = useLoading();
  const {showAlert} = useAlert();
  const { showSuccess, showError } = useDialog();

  const router = useRouter();


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the privacy policy & terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    show('Registering account...');
  
    if (!validateForm()) return;
  
    try {
      show('On Process...', 'Creating Admin Account...');
  
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
  
      if (signUpError) {
        showError(signUpError.message);
        return;
      }
  
      if (!authData.user && !authData.session) {
        showSuccess(
          "We've sent a confirmation email to your inbox. Please verify your email before logging in.",
          "Confirm Your Email"
        );
        return;
      }
  
      const user = authData.user;
      if (!user) {
        showError("No user returned from Supabase.");
        return;
      }
  
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          email: formData.email,
          username: formData.username,
          first_name: formData.firstName,
          last_name: formData.lastName,
        },
      ]);
  
      if (profileError) {
        showError(profileError.message, "Profile Error");
        return;
      }
  
      showSuccess(
        "Admin account registered successfully. Redirecting you to login...",
        "Success",
      );

      setTimeout(() => {
        router.push("/login");
      }, 3000);


    } catch (err) {
      console.error(err);
      showError(err.message || "Something went wrong", "Unexpected Error");
    } finally {
      hide();
    }
  };
  
  


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Time pattern in background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="timeGrid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="30" fill="none" stroke="#2d99ff" strokeWidth="1"/>
              <line x1="60" y1="40" x2="60" y2="50" stroke="#2d99ff" strokeWidth="2"/>
              <line x1="60" y1="70" x2="60" y2="80" stroke="#2d99ff" strokeWidth="2"/>
              <line x1="40" y1="60" x2="50" y2="60" stroke="#2d99ff" strokeWidth="2"/>
              <line x1="70" y1="60" x2="80" y2="60" stroke="#2d99ff" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#timeGrid)"/>
        </svg>
      </div>

      {/* Current Time Display */}
       <CurrentTimeDisplay/>

      {/* Registration Card */}
      <div className="relative w-auto max-w-xlg z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 relative">
          {/* System features accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-t-3xl"></div>
          
          {/* Header */}
          <div className="text-center mb-8">
            <ZentryxLogo />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Zentryx Admin Registration
            </h1>
            <p className="text-slate-600 text-sm font-medium mb-4">
              Workforce Management System - Admin Setup
            </p>
            
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
              <p className="text-sm text-slate-700 mb-3">
                <span className="font-semibold text-red-600">🔐 Admin Access Only!</span>
                <br />
                Create a new administrator account for Zentryx
              </p>
              
              {/* Admin feature icons */}
              <div className="flex justify-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mb-1">
                    <Shield className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-xs text-slate-600">Full Access</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-xs text-slate-600">User Mgmt</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mb-1">
                    <Lock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-xs text-slate-600">Security</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-1">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-xs text-slate-600">System Config</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.firstName 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter last name"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                    errors.lastName 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-slate-500" />
                Admin Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter admin username"
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                  errors.username 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
                }`}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter admin email address"
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter secure password"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Confirm password"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-slate-200 focus:border-blue-500 hover:border-slate-300'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    disabled={isLoading}
                  >
                    {confirmPasswordVisible ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Role Display (Read-only) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                Role
              </label>
              <div className="w-full px-4 py-3 border-2 rounded-xl bg-red-50 border-red-200 flex items-center justify-between">
                <span className="text-slate-700 font-medium">System Administrator</span>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-600" />
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-3 py-4">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500 focus:ring-2"
                  disabled={isLoading}
                />
                {agreedToTerms && (
                  <div className="absolute inset-0 bg-red-500 rounded animate-pulse opacity-20"></div>
                )}
              </div>
              <label className="text-sm text-slate-600 leading-relaxed">
                I agree to the{' '}
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 hover:underline transition-colors font-medium"
                  disabled={isLoading}
                >
                  admin privacy policy & terms
                </button>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.terms}
              </p>
            )}

            {/* Register Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/50 to-red-600/50 animate-pulse"></div>
              )}
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Admin Account...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Create Admin Account</span>
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-6 border-t border-slate-200">
              <p className="text-slate-600">
                Already have an admin account?{' '}
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 font-semibold hover:underline transition-colors"
                  disabled={isLoading}
                  onClick={() => router.push('/login')}
                >
                  Login as Admin
                </button>
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Register;