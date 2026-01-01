import React from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { FiDollarSign } from "react-icons/fi";

const Salary = ({ handleChange, handleClick }) => {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-4">
        <FiDollarSign className="w-4 h-4 text-primary-600" />
        <h4 className="text-base font-semibold text-secondary-900">Salary</h4>
      </div>
      
      {/* Salary Type Buttons */}
      <div className="mb-6">
        <p className="text-xs text-secondary-600 mb-3 uppercase tracking-wide font-medium">Salary Type</p>
        <div className="flex flex-wrap gap-2">
          <Button onClickHandler={handleClick} value="Hourly" title="Hourly" />
          <Button onClickHandler={handleClick} value="Monthly" title="Monthly" />
          <Button onClickHandler={handleClick} value="Yearly" title="Yearly" />
        </div>
      </div>
      
      {/* Salary Range Options */}
      <div>
        <p className="text-xs text-secondary-600 mb-3 uppercase tracking-wide font-medium">Salary Range</p>
        <div className="space-y-1">
          {/* All Salaries Option */}
          <label className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors duration-200 group">
            <div className="relative">
              <input
                type="radio"
                name="salary"
                id="all-salary"
                value=""
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-4 h-4 border-2 border-secondary-300 rounded-full peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-1 transition-all duration-200 group-hover:border-primary-400">
                <div className="w-full h-full rounded-full bg-white scale-0 peer-checked:scale-50 transition-transform duration-200"></div>
              </div>
            </div>
            <span className="text-sm text-secondary-700 peer-checked:text-primary-700 peer-checked:font-medium transition-colors duration-200">
              Any Salary
            </span>
          </label>

          <InputField
            handleChange={handleChange}
            value={30}
            title="< $30k"
            name="salary"
          />
          <InputField
            handleChange={handleChange}
            value={50}
            title="< $50k"
            name="salary"
          />
          <InputField
            handleChange={handleChange}
            value={80}
            title="< $80k"
            name="salary"
          />
          <InputField
            handleChange={handleChange}
            value={100}
            title="< $100k"
            name="salary"
          />
          <InputField
            handleChange={handleChange}
            value={150}
            title="$100k+"
            name="salary"
          />
        </div>
      </div>
    </div>
  );
};

export default Salary;
