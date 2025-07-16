"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  UserCog,
  User2,
  CalendarDays,
  Wallet,
  Briefcase,
  BarChart,
  Activity,
  Settings,
  FileClock,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  Users,
  Building2,
  UserCheck,
  TrendingUp,
  Shield,
  Bell,
  HelpCircle,
  CalendarCog,
} from "lucide-react";
import { useLoading } from "../providers/LoadingProvider";

// Custom Logo
const ZentryxLogo = ({ size = "w-16 h-16" }) => (
  <div className={`relative inline-flex items-center justify-center ${size} bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg overflow-hidden`}>
    <div className="absolute inset-2 bg-white rounded-full shadow-inner">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-0.5 h-3 bg-slate-700 rounded-full transform -rotate-45 origin-bottom"></div>
        <div className="absolute w-0.5 h-4 bg-blue-600 rounded-full transform rotate-12 origin-bottom"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-slate-800 rounded-full"></div>
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-slate-400"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-slate-400"></div>
      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-slate-400"></div>
      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-0.5 bg-slate-400"></div>
    </div>
    <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl"></div>
  </div>
);

const Sidebar = ({ isOpen, role }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [expandedGroups, setExpandedGroups] = useState({});
  const router = useRouter();
  const { show, hide } = useLoading();

  const handleItemClick = async (item) => {
    setActiveItem(item.label);
    show("fetch");
    try {
      await new Promise(res => setTimeout(res, 600)); 
      router.push(item.path);
    } finally {
      hide();
    }
  };

  

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const activeStyle = "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105";
  const inactiveStyle = "text-gray-600 hover:text-gray-800";
  const groupStyle = "text-gray-700 hover:bg-gray-100";

  const admin = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", type: "single" },
    {
      label: "User Management", icon: Users, type: "group", children: [
        { label: "Employees", icon: Briefcase, path: "/admin/employees" },
        { label: "Users", icon: UserCog, path: "/admin/users" },
        { label: "Roles", icon: User2, path: "/admin/roles" },
        { label: "Department", icon: Building2, path: "/admin/department" },
        { label: "Shift", icon: CalendarCog, path: "/admin/shift" },
      ]
    },
    {
      label: "Project & Tasks", icon: ClipboardCheck, type: "group", children: [
        { label: "Projects", icon: ClipboardCheck, path: "/admin/projects" },
        { label: "Task Management", icon: Activity, path: "/admin/task-management" },
      ]
    },
    {
      label: "HR Management", icon: UserCheck, type: "group", children: [
        { label: "Attendance Logs", icon: CalendarDays, path: "/admin/attendance" },
        { label: "Leave Requests", icon: FileClock, path: "/admin/leave-request" },
        { label: "Payroll", icon: Wallet, path: "/admin/payroll" },
      ]
    },
    {
      label: "Analytics & Reports", icon: TrendingUp, type: "group", children: [
        { label: "Reports", icon: BarChart, path: "/admin/reports" },
        { label: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
        { label: "Audit Trail", icon: Shield, path: "/admin/audit-trail" },
      ]
    },
    { label: "Settings", icon: Settings, path: "/admin/profile", type: "single" },
  ];

  const employee = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/user/dashboard", type: "single" },
    {
      label: "Work Management", icon: ClipboardCheck, type: "group", children: [
        { label: "My Tasks", icon: ClipboardCheck, path: "/user/tasks" },
        { label: "Projects", icon: Briefcase, path: "/user/projects" },
      ]
    },
    {
      label: "Personal", icon: User2, type: "group", children: [
        { label: "Attendance", icon: CalendarDays, path: "/user/attendance" },
        { label: "Leave Requests", icon: FileClock, path: "/user/leave-requests" },
        { label: "My Payroll", icon: Wallet, path: "/user/payroll" },
      ]
    },
    { label: "Notifications", icon: Bell, path: "/user/notifications", type: "single" },
    { label: "Help & Support", icon: HelpCircle, path: "/user/support", type: "single" },
    { label: "Settings", icon: Settings, path: "/user/settings", type: "single" },
  ];

  const sidebarItems = role === "admin" ? admin : employee;

  const renderMenuItem = (item) => {
    if (item.type === "single") {
      return (
        <div
          key={item.label}
          onClick={() => handleItemClick(item)}
          className={`flex items-center space-x-3 h-12 px-4 rounded-xl cursor-pointer transition-all duration-200 ${
            activeItem === item.label
              ? activeStyle
              : `${inactiveStyle} hover:bg-gray-50 hover:shadow-sm`
          }`}
        >
          <div className="flex items-center justify-center w-8">
            <item.icon className={`w-5 h-5 ${activeItem === item.label ? 'text-white' : 'text-gray-600'}`} />
          </div>
          {isOpen && <span className="text-sm font-medium">{item.label}</span>}
        </div>
      );
    }

    if (item.type === "group") {
      const isExpanded = expandedGroups[item.label];
      return (
        <div key={item.label} className="mb-1">
          <div
            className={`flex items-center justify-between space-x-3 h-12 px-4 rounded-xl cursor-pointer transition-all duration-200 ${groupStyle}`}
            onClick={() => toggleGroup(item.label)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8">
                <item.icon className="w-5 h-5 text-gray-600" />
              </div>
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </div>
            {isOpen && (
              <div className="transition-transform duration-200">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            )}
          </div>

          {isOpen && isExpanded && (
            <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
              {item.children.map((child) => (
                <div
                  key={child.label}
                  onClick={() => handleItemClick(child)}
                  className={`flex items-center space-x-3 h-10 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activeItem === child.label
                      ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <child.icon className="w-4 h-4" />
                  <span className="text-sm">{child.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <nav className="h-full bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className={`flex items-center gap-3 p-6 border-b border-gray-100 transition-all duration-300 ${isOpen ? "justify-start" : "justify-center"}`}>
          <ZentryxLogo size={isOpen ? "w-12 h-12" : "w-10 h-10"} />
          {isOpen && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800">Zentryx</span>
              <span className="text-xs text-gray-500 capitalize">{role} Panel</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {sidebarItems.map((item) => renderMenuItem(item))}
          </div>
        </div>

        {isOpen && (
          <div className="p-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 text-center">
              © 2024 Zentryx
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
