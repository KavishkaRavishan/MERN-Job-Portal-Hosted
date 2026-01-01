import React from "react";

const InputField = ({ handleChange, value, title, name }) => {
  return (
    <label className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-secondary-50 cursor-pointer transition-colors duration-200 group">
      <div className="relative">
        <input 
          type="radio" 
          name={name} 
          value={value} 
          onChange={handleChange}
          className="sr-only peer"
        />
        <div className="w-4 h-4 border-2 border-secondary-300 rounded-full peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-1 transition-all duration-200 group-hover:border-primary-400">
          <div className="w-full h-full rounded-full bg-white scale-0 peer-checked:scale-50 transition-transform duration-200"></div>
        </div>
      </div>
      <span className="text-sm text-secondary-700 peer-checked:text-primary-700 peer-checked:font-medium transition-colors duration-200">
        {title}
      </span>
    </label>
  );
};

export default InputField;
