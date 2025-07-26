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
  CalendarCog,
  Tv,
  TvMinimalPlayIcon,
  Users2,
  Megaphone, 
  MessageCircle, 
  Mail, 
  FileText as FileTextDoc,
  BookOpen, 
  Newspaper, 
  Settings2, 
  Timer, 
  ListTodo, 
  Plug, 
  DatabaseBackup, 
  Award, 
  Target, 
  UserPlus, 
  NotebookPen, 
  CalendarCheck2, 
  ArrowRightToLine,
  Receipt, 
  WalletCards,
  Scale, 
  Calendar,
  MonitorCogIcon, 
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

const AdminSidebar = ({ isOpen, role }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [expandedGroups, setExpandedGroups] = useState({});
  const router = useRouter();
  const { show, hide } = useLoading();

  const handleItemClick = async (item) => {
    setActiveItem(item.label);
    show("Loading module...");
    await new Promise(res => setTimeout(res, 300));
    router.push(item.path);
    setTimeout(() => {
      hide();
    }, 300);
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

  // --- UPDATED ADMIN SIDEBAR WITH NEW ITEMS ---
  const adminMenu = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", type: "single" },
    {
      label: "Live Monitoring", icon: Tv, type: "group", children: [
        { label: "Monitor", icon: TvMinimalPlayIcon, path: "/admin/live-monitoring/live-monitor" },
        { label: "Monitoring Settings", icon: MonitorCogIcon, path: "/admin/live-monitoring/monitoring-settings" },
      ]
    },
    {
      label: "User Management", icon: Users, type: "group", children: [
        { label: "Employees", icon: Briefcase, path: "/admin/user-management/employees" },
        { label: "Users", icon: UserCog, path: "/admin/user-management/users" },
        { label: "Roles", icon: User2, path: "/admin/user-management/roles" },
        { label: "Department", icon: Building2, path: "/admin/user-management/department" },
        { label: "Shift", icon: CalendarCog, path: "/admin/user-management/shift" },
      ]
    }, 
    {
      label: "Project & Tasks", icon: ClipboardCheck, type: "group", children: [
        { label: "Projects", icon: ClipboardCheck, path: "/admin/project-management/projects" },
        { label: "Task Management", icon: Activity, path: "/admin/project-management/task-management" },
      ]
    },
    {
      label: "HR Management", icon: UserCheck, type: "group", children: [
        { label: "Attendance Logs", icon: CalendarDays, path: "/admin/hr-management/attendance" },
        { label: "Leave Requests", icon: FileClock, path: "/admin/hr-management/leave-request" },
        { label: "Payroll", icon: Wallet, path: "/admin/hr-management/payroll" },
        { label: "Performance Reviews", icon: Award, path: "/admin/hr-management/performance-reviews" },
        { label: "Goals", icon: Target, path: "/admin/hr-management/goals" },
        { label: "Leave Balances", icon: Scale, path: "/admin/hr-management/leave-balances" }, 
        { label: "Leave Calendar", icon: Calendar, path: "/admin/hr-management/leave-calendar" }, 
        { label: "Expense Claims", icon: Receipt, path: "/admin/hr-management/expenses" },
        { label: "Reimbursements", icon: WalletCards, path: "/admin/hr-management/reimbursements" },
      ]
    },
    // --- NEW RECRUITMENT GROUP ---
    {
      label: "Recruitment", icon: UserPlus, type: "group", children: [
        { label: "Job Postings", icon: NotebookPen, path: "/admin/recruitment-management/recruitment/jobs" },
        { label: "Applicants", icon: Users2, path: "/admin/recruitment-management/applicants" },
        { label: "Interviews", icon: CalendarCheck2, path: "/admin/recruitment-management/interviews" },
        { label: "Onboarding", icon: ArrowRightToLine, path: "/admin/recruitment-management/onboarding" },
      ]
    },
    // --- NEW COMMUNICATION GROUP ---
    {
      label: "Communication", icon: MessageCircle, type: "group", children: [
        { label: "Announcements", icon: Megaphone, path: "/admin/communication/announcements" },
        { label: "Messaging", icon: MessageCircle, path: "/admin//communicationmessages" },
        { label: "Email Templates", icon: Mail, path: "/admin/communication/email-templates" },
      ]
    },
    // --- NEW CONTENT MANAGEMENT GROUP ---
    {
      label: "Content Library", icon: BookOpen, type: "group", children: [
        { label: "Company Docs", icon: FileTextDoc, path: "/admin/documents" },
        { label: "Knowledge Base", icon: BookOpen, path: "/admin/knowledge-base" },
        { label: "News/Blog", icon: Newspaper, path: "/admin/news" },
      ]
    },
    {
      label: "Analytics & Reports", icon: TrendingUp, type: "group", children: [
        { label: "Reports", icon: BarChart, path: "/admin/analytics-report-management/reports" },
        { label: "Analytics", icon: TrendingUp, path: "/admin/analytics-report-management/analytics" },
        { label: "Audit Trail", icon: Shield, path: "/admin/analytics-report-management/audit-trail" },
      ]
    },
    // --- NEW SYSTEM SETTINGS GROUP ---
    {
      label: "System Settings", icon: Settings2, type: "group", children: [
        { label: "General Settings", icon: Settings, path: "/admin/system-settings/general" },
        { label: "Leave Types", icon: Timer, path: "/admin/system-settings/leave-types" },
        { label: "Leave Statuses", icon: ListTodo, path: "/admin/system-settings/leave-statuses" },
        { label: "Integrations", icon: Plug, path: "/admin/system-settings/integrations" },
        { label: "Backup & Restore", icon: DatabaseBackup, path: "/admin/system-settings/backup" },
      ]
    },
    { label: "Profile Settings", icon: Settings, path: "/admin/profile", type: "single" },
  ];
  // --- END UPDATED ADMIN SIDEBAR ---

  // Only show the admin menu if the role is 'admin'
  const sidebarItems = role === "admin" ? adminMenu : [];

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
    return null; 
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
              © 2025 Zentryx - Your Work Force Management System
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminSidebar;
