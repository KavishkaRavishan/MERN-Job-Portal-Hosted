import React from "react";
import Salary from "./Salary";
import WorkExperience from "./WorkExperience";
import { FiFilter } from "react-icons/fi";

const Sidebar = ({ handleChange, handleClick }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-4 border-b border-secondary-200">
        <FiFilter className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-secondary-900">Filters</h3>
      </div>
      
      {/* Filter Sections */}
      <div className="space-y-6">
        <Salary handleChange={handleChange} handleClick={handleClick} />
        <div className="border-t border-secondary-200 pt-6">
          <WorkExperience handleChange={handleChange} />
        </div>
      </div>
      
      {/* Clear Filters Button */}
      <div className="pt-6 border-t border-secondary-200">
        <button 
          onClick={() => {
            // Reset all filters
            const event = { target: { value: '' } };
            handleChange(event);
          }}
          className="w-full btn btn-secondary text-sm py-2 flex items-center justify-center space-x-2"
        >
          <FiFilter className="w-4 h-4" />
          <span>Clear All Filters</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
