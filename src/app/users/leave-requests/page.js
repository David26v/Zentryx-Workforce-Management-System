"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileText,
  Plane,
  Stethoscope,
  GraduationCap,
  Baby,
  Home,
  CalendarDaysIcon,
  PlusIcon,
  Clock3Icon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  FilterIcon, // For Filter Trigger Button
  FilterXIcon, // For Clearing All Filters
  LayoutGrid, // Icon for Card View Tab
  Table as TableIcon, // Icon for Table View Tab
  Mail, // For Employee Info Card
  Phone, // For Employee Info Card
  Paperclip, // For Attachments
  Upload, // For Attachments
  X, // For removing attachments
  Send, // For Submit button
  Tag, // For Leave Type in Modal
  Info, // For the Info Icon
} from "lucide-react";
import { format } from "date-fns";
// --- Shadcn/UI Components ---
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
// --- Import Drawer Components ---
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Hardcoded current employee data ---
// In a real app, this would come from authentication/context
const currentEmployee = {
  id: 1,
  name: "Juan Dela Cruz",
  position: "Senior Software Engineer",
  department: "Engineering",
  email: "juan.delacruz@company.com",
  phone: "+63 (912) 345-6789",
  avatar: "/api/placeholder/40/40", // Placeholder, replace with actual avatar URL
  availableLeave: 15, // Example data
};

const LeaveRequestPage = () => {
  // State for main search bar
  const [searchTerm, setSearchTerm] = useState("");
  // State for filter dialog
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  // State for "My Requests" list filter
  const [myRequestsFilterStatus, setMyRequestsFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // --- Mock leave request data (filtered by currentEmployee.id) ---
  const allLeaveRequests = [
    {
      id: 1,
      employeeId: 1, // Matches currentEmployee.id
      employee: {
        name: "Juan Dela Cruz",
        position: "Senior Software Engineer",
        department: "Engineering",
      },
      type: "vacation",
      startDate: "2024-07-25",
      endDate: "2024-07-29",
      totalDays: 5,
      reason: "Family vacation to Boracay to celebrate anniversary.",
      status: "pending",
      submittedDate: "2024-07-16",
      approvedBy: null,
      approvedDate: null,
      comments: "Planning a relaxing trip with family.",
      attachments: ["itinerary.pdf"],
      emergencyContact: {
        name: "Maria Dela Cruz",
        relationship: "Spouse",
        phone: "+63 (987) 654-3210",
      },
    },
    {
      id: 2,
      employeeId: 1, // Matches currentEmployee.id
      employee: {
        name: "Juan Dela Cruz",
        position: "Senior Software Engineer",
        department: "Engineering",
      },
      type: "sick",
      startDate: "2024-07-18",
      endDate: "2024-07-19",
      totalDays: 2,
      reason: "Doctor consultation and rest due to flu.",
      status: "approved",
      submittedDate: "2024-07-17",
      approvedBy: "HR Department",
      approvedDate: "2024-07-17",
      comments: "Medical certificate attached.",
      attachments: ["medical-certificate.pdf"],
      emergencyContact: {
        name: "Jose Santos",
        relationship: "Brother",
        phone: "+63 (987) 123-4567",
      },
    },
    {
      id: 3,
      employeeId: 1, // Matches currentEmployee.id
      employee: {
        name: "Juan Dela Cruz",
        position: "Senior Software Engineer",
        department: "Engineering",
      },
      type: "personal",
      startDate: "2024-08-01",
      endDate: "2024-08-01",
      totalDays: 1,
      reason: "Attending a close relative's wedding.",
      status: "rejected",
      submittedDate: "2024-07-15",
      approvedBy: "Department Head",
      approvedDate: "2024-07-16",
      comments: "Conflict with critical project deadline.",
      attachments: [],
      rejectionReason: "Cannot approve due to overlapping project milestones.",
      emergencyContact: {
        name: "Ana Lopez",
        relationship: "Sister",
        phone: "+63 (987) 987-6543",
      },
    },
  ];

  // Filter requests to show only the current employee's
  const userRequests = allLeaveRequests.filter(
    (req) => req.employeeId === currentEmployee.id
  );

  // Apply status filter for "My Requests" list
  const filteredUserRequests = userRequests.filter(
    (req) =>
      myRequestsFilterStatus === "all" || req.status === myRequestsFilterStatus
  );

  const leaveTypes = [
    {
      value: "vacation",
      label: "Vacation",
      icon: Plane,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      value: "sick",
      label: "Sick Leave",
      icon: Stethoscope,
      color: "bg-red-100 text-red-700 border-red-200",
    },
    {
      value: "personal",
      label: "Personal",
      icon: User,
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      value: "maternity",
      label: "Maternity",
      icon: Baby,
      color: "bg-pink-100 text-pink-700 border-pink-200",
    },
    {
      value: "paternity",
      label: "Paternity",
      icon: Home,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      value: "study",
      label: "Study Leave",
      icon: GraduationCap,
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    {
      value: "emergency",
      label: "Emergency",
      icon: AlertCircle,
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    {
      value: "bereavement",
      label: "Bereavement",
      icon: Home,
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    {
      value: "approved",
      label: "Approved",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    {
      value: "rejected",
      label: "Rejected",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
  ];

  const getLeaveTypeConfig = (type) => {
    return leaveTypes.find((t) => t.value === type) || leaveTypes[0];
  };

  const getStatusConfig = (status) => {
    if (!status || status === "all")
      return (
        statuses[1] || {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Clock,
        }
      );
    return statuses.find((s) => s.value === status) || statuses[1];
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start.toDateString() === end.toDateString()) {
      return format(start, "MMM d, yyyy");
    }
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const filteredRequests = userRequests.filter((request) => {
    const matchesSearch =
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;
    // Date filtering logic
    let matchesDate = true; // If no dates are selected, it matches by default
    const requestStartDate = new Date(request.startDate);
    const requestEndDate = new Date(request.endDate);
    if (filterStartDate) {
      const filterStart = new Date(filterStartDate);
      // Request's end date must be on or after the filter start date
      matchesDate = matchesDate && requestEndDate >= filterStart;
    }
    if (filterEndDate) {
      const filterEnd = new Date(filterEndDate);
      // Request's start date must be on or before the filter end date
      matchesDate = matchesDate && requestStartDate <= filterEnd;
    }
    return matchesSearch && matchesStatus && matchesDate;
  });

  const EmployeeInfoCard = () => (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {currentEmployee.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <span className="block font-semibold text-gray-800">
              {currentEmployee.name}
            </span>
            <span className="block text-sm text-gray-600">
              {currentEmployee.position}
            </span>
            <span className="block text-xs text-gray-500">
              {currentEmployee.department}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">
              {currentEmployee.availableLeave} days
            </span>{" "}
            available
          </div>
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-500" />
            {currentEmployee.email}
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-500" />
            {currentEmployee.phone}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // --- Modal Content Component ---
  const NewRequestModalContent = () => {
    const [modalStartDate, setModalStartDate] = useState("");
    const [modalEndDate, setModalEndDate] = useState("");
    const [modalLeaveType, setModalLeaveType] = useState("");
    const [modalReason, setModalReason] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isModalSubmitting, setIsModalSubmitting] = useState(false);

    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...files.map((f) => f.name)]);
    };

    const removeAttachment = (fileName) => {
      setAttachments((prev) => prev.filter((name) => name !== fileName));
    };

    const calculateModalDays = () => {
      if (!modalStartDate || !modalEndDate) return 0;
      const start = new Date(modalStartDate);
      const end = new Date(modalEndDate);
      if (end < start) return 0;
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleModalSubmit = (e) => {
      e.preventDefault();
      if (!modalStartDate || !modalEndDate || !modalLeaveType || !modalReason) {
        alert("Please fill in all required fields.");
        return;
      }
      setIsModalSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        alert("Leave request submitted successfully!");
        setIsModalSubmitting(false);
        // Reset form
        setModalStartDate("");
        setModalEndDate("");
        setModalLeaveType("");
        setModalReason("");
        setAttachments([]);
        // In a real app, you'd close the dialog and potentially refresh the request list
        // This requires managing the dialog's open state, often done by the parent Dialog component
        // For simplicity here, just alert and reset. The dialog will close when the trigger is clicked again or via DialogClose.
      }, 1500);
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <CalendarDaysIcon className="w-5 h-5" />
            </div>
            New Leave Request
          </DialogTitle>
          <DialogDescription>
            Please fill in the details for your leave request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleModalSubmit} className="space-y-5 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="modalStartDate"
                className="text-sm font-medium flex items-center"
              >
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                Start Date *
              </Label>
              <Input
                id="modalStartDate"
                type="date"
                value={modalStartDate}
                onChange={(e) => setModalStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="modalEndDate"
                className="text-sm font-medium flex items-center"
              >
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                End Date *
              </Label>
              <Input
                id="modalEndDate"
                type="date"
                value={modalEndDate}
                onChange={(e) => setModalEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
                min={modalStartDate || undefined}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="modalLeaveType"
                className="text-sm font-medium flex items-center"
              >
                <Tag className="w-4 h-4 mr-2 text-gray-500" />
                Leave Type *
              </Label>
              <Select value={modalLeaveType} onValueChange={setModalLeaveType}>
                <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="flex items-center"
                    >
                      <div
                        className={`flex items-center px-2 py-1 rounded ${type.color}`}
                      >
                        {React.createElement(type.icon, {
                          className: "w-4 h-4 mr-2",
                        })}
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                Duration
              </Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-sm">
                  {calculateModalDays() || 0} day
                  {calculateModalDays() !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="modalReason"
              className="text-sm font-medium flex items-center"
            >
              <FileText className="w-4 h-4 mr-2 text-gray-500" />
              Reason for Leave *
            </Label>
            <Textarea
              id="modalReason"
              value={modalReason}
              onChange={(e) => setModalReason(e.target.value)}
              placeholder="Please provide a brief reason for your leave request..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>
          {/* Attachment Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
              Attachments (Optional)
            </Label>
            <div className="border border-gray-300 rounded-md p-3">
              <Input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <Label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-6 h-6 text-gray-500 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOC, JPG up to 10MB
                </span>
              </Label>
              {/* Display selected files */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-700">
                    Selected Files:
                  </p>
                  <ul className="space-y-1">
                    {attachments.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border"
                      >
                        <div className="flex items-center truncate">
                          <FileText className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{file}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(file)}
                          className="text-gray-500 hover:text-red-500 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isModalSubmitting}>
              {isModalSubmitting ? (
                <>
                  <Clock3Icon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </>
    );
  };

  // Simplified Card View for My Requests (no employee info, colored types)
  const LeaveRequestCard = ({ request }) => {
    const typeConfig = getLeaveTypeConfig(request.type);
    const statusConfig = getStatusConfig(request.status);
    const TypeIcon = typeConfig.icon;
    const StatusIcon = statusConfig.icon;
    return (
      <Card className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${typeConfig.color}`}
            >
              <TypeIcon className="w-3 h-3 mr-1.5" />
              {typeConfig.label}
            </div>
            <Badge
              variant="outline"
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}
            >
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3 flex-grow">
          <p className="text-base font-medium text-gray-800 line-clamp-2 mb-3">
            {request.reason}
          </p>
          <div className="flex items-center text-xs text-gray-600 mb-2">
            <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>{formatDateRange(request.startDate, request.endDate)}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>
              {request.totalDays} day{request.totalDays !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
        <CardFooter className="pt-3">
          <div className="flex items-center justify-between w-full text-xs text-gray-500">
            <span>
              Submitted: {format(new Date(request.submittedDate), "MMM d")}
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <RequestDetailsDialogContent request={request} />
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    );
  };

  // Table View for My Requests (colored types)
  const LeaveRequestTable = () => (
    <div className="rounded-md border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[150px]">Type</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-center">Days</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const typeConfig = getLeaveTypeConfig(request.type);
              const statusConfig = getStatusConfig(request.status);
              const TypeIcon = typeConfig.icon;
              const StatusIcon = statusConfig.icon;
              return (
                <TableRow key={request.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeConfig.color}`}
                    >
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {typeConfig.label}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDateRange(request.startDate, request.endDate)}
                  </TableCell>
                  <TableCell className="text-center">
                    {request.totalDays}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <RequestDetailsDialogContent request={request} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No requests found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  // Separate component for the Dialog content for better structure
  const RequestDetailsDialogContent = ({ request }) => {
    const typeConfig = getLeaveTypeConfig(request.type);
    const statusConfig = getStatusConfig(request.status);
    const TypeIcon = typeConfig.icon;
    const StatusIcon = statusConfig.icon;
    return (
      <>
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className={`p-2 rounded-lg ${typeConfig.color}`}>
              <TypeIcon className="w-5 h-5" />
            </div>
            {typeConfig.label} Request
          </DialogTitle>
          <DialogDescription>
            Submitted on{" "}
            {format(new Date(request.submittedDate), "MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-2">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className={`px-3 py-1.5 rounded-full text-base font-medium border ${statusConfig.color}`}
            >
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.label}
            </Badge>
          </div>
          {/* Dates & Duration */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 text-base">
              Leave Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600 text-xs">Start Date</p>
                <p className="font-medium">
                  {format(new Date(request.startDate), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">End Date</p>
                <p className="font-medium">
                  {format(new Date(request.endDate), "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Duration</p>
                <p className="font-medium">
                  {request.totalDays} day{request.totalDays !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
          {/* Reason */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Reason</p>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
              {request.reason}
            </p>
          </div>
          {/* Comments (if any) */}
          {request.comments && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Comments
              </p>
              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md border border-blue-200">
                {request.comments}
              </p>
            </div>
          )}
          {/* Attachments (if any) */}
          {request.attachments.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Attachments
              </p>
              <ul className="space-y-1.5">
                {request.attachments.map((attachment, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded border border-blue-200"
                  >
                    <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate hover:underline cursor-pointer">
                      {attachment}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Approval/Rejection Info */}
          {request.status !== "pending" && (
            <div
              className={`p-4 rounded-lg border ${
                request.status === "approved"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-sm font-semibold">
                {request.status === "approved" ? "Approved" : "Rejected"} by{" "}
                {request.approvedBy || "Unknown"}
              </p>
              {request.approvedDate && (
                <p className="text-xs text-gray-600 mt-1">
                  on {format(new Date(request.approvedDate), "MMMM d, yyyy")}
                </p>
              )}
              {request.rejectionReason && (
                <p className="text-sm text-red-700 mt-3 p-2 bg-white rounded border border-red-300">
                  {request.rejectionReason}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  };

  // --- Filter Drawer Content Component ---
  const FilterDrawerContent = () => (
    <>
      <DrawerHeader className="text-left">
        <DrawerTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
            <FilterIcon className="w-5 h-5" />
          </div>
          Advanced Filters
        </DrawerTitle>
        <DrawerDescription>
          Refine your search for filtered requests.
        </DrawerDescription>
      </DrawerHeader>
      <div className="space-y-5 py-2 px-4">
        <div className="space-y-2">
          <Label htmlFor="filterStatus" className="text-sm font-medium">
            Status
          </Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem
                  key={status.value}
                  value={status.value}
                  className="flex items-center"
                >
                  <div className="flex items-center">
                    {status.icon &&
                      React.createElement(status.icon, {
                        className: "w-4 h-4 mr-2",
                      })}
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="filterStartDate" className="text-sm font-medium">
              Start Date
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                id="filterStartDate"
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterEndDate" className="text-sm font-medium">
              End Date
            </Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                id="filterEndDate"
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                min={filterStartDate || undefined}
              />
            </div>
          </div>
        </div>
      </div>
      <DrawerFooter className="px-4"> {/* Added px-4 for padding inside drawer footer */}
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFilterStatus("all");
                setFilterStartDate("");
                setFilterEndDate("");
              }}
            >
              <FilterXIcon className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button type="button">Apply Filters</Button>
          </DrawerClose>
        </div>
      </DrawerFooter>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Leave Requests
          </h1>
          <p className="text-gray-600 mt-1">
            Submit new requests and track the status of your existing ones.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Employee Info & My Requests List (Cards) */}
          <div className="lg:col-span-1 space-y-6">
            <EmployeeInfoCard />
            {/* My Requests Header & List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    My Requests
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Showing your latest requests.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {filteredUserRequests.length} request
                    {filteredUserRequests.length !== 1 ? "s" : ""}
                  </span>
                  {/* Status Filter for My Requests List */}
                  <Select
                    value={myRequestsFilterStatus}
                    onValueChange={setMyRequestsFilterStatus}
                  >
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                          className="text-xs"
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* My Requests Cards List */}
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {" "}
                {/* Added scroll */}
                {filteredUserRequests.length > 0 ? (
                  filteredUserRequests.map((request) => (
                    <LeaveRequestCard key={request.id} request={request} />
                  ))
                ) : (
                  <Card className="shadow-sm border border-gray-200 text-center py-6">
                    <CardContent className="pb-0">
                      <CalendarDaysIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-sm">
                        No requests found with the selected status.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
          {/* Right Column - New Request Button, Filters, My Requests (Tabs) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters - Main Search and New Request Button */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-4">
                {/* Grid for Search, Filter Button, and New Request Button */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search reasons or types..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    {/* Filter Drawer Trigger Button */}
                    {/* --- Replaced Dialog with Drawer --- */}
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center text-sm"
                        >
                          <FilterIcon className="w-4 h-4 mr-2" />
                          Filters
                        </Button>
                      </DrawerTrigger>
                      {/* --- Drawer Content --- */}
                      <DrawerContent className="max-h-[100vh] overflow-y-auto">
                        <FilterDrawerContent />
                      </DrawerContent>
                    </Drawer>
                  </div>
                  <div className="flex items-center justify-end">
                    {/* New Request Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center transition-all duration-200 shadow hover:shadow-md">
                          <Plus className="w-4 h-4 mr-2" />
                          New Leave Request
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
                        <NewRequestModalContent />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* My Requests Header with Tabs (for Card/Table view of filtered results) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Over All Request 
                </h2>
                <span className="text-sm text-gray-600">
                  {filteredRequests.length} request
                  {filteredRequests.length !== 1 ? "s" : ""}
                </span>
              </div>
              {/* Tabs for Card/Table View */}
              <Tabs defaultValue="cards" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="cards"
                    className="flex items-center justify-center"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    Card View
                  </TabsTrigger>
                  <TabsTrigger
                    value="table"
                    className="flex items-center justify-center"
                  >
                    <TableIcon className="w-4 h-4 mr-2" />
                    Table View
                  </TabsTrigger>
                </TabsList>
                {/* Cards View Content (Filtered) - Updated with type colors */}
                <TabsContent value="cards" className="mt-0">
                  <div className="grid grid-cols-1 gap-5">
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <LeaveRequestCard
                          key={`filtered-${request.id}`}
                          request={request}
                        />
                      ))
                    ) : (
                      <div className="col-span-full">
                        <Card className="shadow-sm border border-gray-200 text-center py-10">
                          <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-medium text-gray-800">
                              No requests found
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <p className="text-gray-600 mb-4 text-sm">
                              No leave requests match your current filters.
                            </p>
                          </CardContent>
                          <CardFooter className="justify-center">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSearchTerm("");
                                setFilterStatus("all");
                                setFilterStartDate("");
                                setFilterEndDate("");
                              }}
                              className="text-sm"
                            >
                              Clear Filters
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    )}
                  </div>
                </TabsContent>
                {/* Table View Content (Filtered) - Updated with type colors */}
                <TabsContent value="table" className="mt-0">
                  <LeaveRequestTable />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
