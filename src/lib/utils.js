import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getStatusBadge = (status) => {
  const baseClasses = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium";
  
  switch (status) {
    case 'present':
      return `${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200`;
    case 'late':
      return `${baseClasses} bg-amber-50 text-amber-700 border border-amber-200`;
    case 'absent':
      return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
    default:
      return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
  }
};

export  const getStatusIcon = (status) => {
  switch (status) {
    case 'present':
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    case 'late':
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    case 'absent':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};
