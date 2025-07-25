"use client";

import React from "react";
import { Input } from "./input";
import { Label } from "./label";

const ToggleSwitch = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
    <div className="flex-1">
      {label && <h4 className="font-medium text-gray-900">{label}</h4>}
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
    <Label className="relative inline-flex items-center cursor-pointer">
      <Input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500"></div>
    </Label>
  </div>
);

export default ToggleSwitch;
