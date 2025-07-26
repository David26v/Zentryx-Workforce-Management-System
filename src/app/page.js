"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Users,
  TrendingUp,
  Shield,
  Timer,
  Briefcase,
  Target,
  CheckCircle,
} from "lucide-react";
import Footer from "@/components/landing-page-components/Footer";
import NavBar from "@/components/landing-page-components/NavBar";
import FeaturesSection from "@/components/landing-page-components/FeaturesSection";
import ContactSection from "@/components/landing-page-components/ContactSection";
import { useTheme } from "@/components/providers/themeProvider";
import HeroSection from "@/components/landing-page-components/HeroSection";
import AnimatedBackground from "@/components/landing-page-components/AnimateBackGround";
import AboutUs from "@/components/landing-page-components/AboutUs";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigateToLogin = () => {
    router.push("/forms/login");
  };

  const stats = [
    { number: "🚀", label: "Solo Founder Built", icon: Users },
    { number: "⚙️ MVP", label: "In Early Access", icon: TrendingUp },
    { number: "👂 Open", label: "To Feedback", icon: Shield },
    { number: "10 min", label: "Setup Time", icon: Timer },
  ];
  

  // Floating icons data
  const floatingIcons = [
    { Icon: Briefcase, delay: 0, duration: 8 },
    { Icon: Users, delay: 2, duration: 10 },
    { Icon: Target, delay: 4, duration: 9 },
    { Icon: TrendingUp, delay: 1, duration: 11 },
    { Icon: Clock, delay: 3, duration: 7 },
    { Icon: CheckCircle, delay: 5, duration: 8 },
  ];

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      } relative overflow-hidden transition-all duration-500`}
    >
      {/* Animated Background */}
      <AnimatedBackground isDarkMode={isDarkMode} mousePosition={mousePosition} />

      {/* Time Display */}
      <div
        className={`fixed top-4 right-4 ${
          isDarkMode ? "bg-slate-800/20" : "bg-white/20"
        } backdrop-blur-md rounded-lg px-3 py-1 border ${
          isDarkMode ? "border-slate-700/30" : "border-white/30"
        } z-50`}
      >
        <div className="flex items-center space-x-2">
          <Clock
            className={`w-3 h-3 ${
              isDarkMode ? "text-white" : "text-slate-700"
            }`}
          />
          <span
            className={`${
              isDarkMode ? "text-white" : "text-slate-700"
            } font-medium text-xs`}
          >
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <NavBar
        isDarkMode={isDarkMode}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        toggleDarkMode={toggleDarkMode}
        navigateToLogin={navigateToLogin}
      />

     {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`fixed inset-0 z-40 ${
            isDarkMode ? "bg-slate-900/95" : "bg-white/95"
          } backdrop-blur-xl md:hidden`}
        >
          <div className="flex flex-col justify-center items-center h-full space-y-6">
            <a
              href="#features"
              className={`text-xl font-medium ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Features
            </a>
            <a
              href="#billing"
              className={`text-xl font-medium ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Billing
            </a>
            <a
              href="#contact"
              className={`text-xl font-medium ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Contact
            </a>
            <button
              onClick={navigateToLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Login
            </button>
          </div>
        </div>
      )}

        {/* Hero Section */}
        <HeroSection isDarkMode={isDarkMode} stats={stats} />
        

        {/* Features Section */}
        <FeaturesSection isDarkMode={isDarkMode} />
        
        <AboutUs isDarkMode={isDarkMode} />
        
        <ContactSection isDarkMode={isDarkMode} />

   
      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />

     

      
    </div>
  );
}