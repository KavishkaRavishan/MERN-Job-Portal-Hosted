import React from "react";

const Button = ({ onClickHandler, value, title, isActive = false }) => {
  return (
    <button
      onClick={onClickHandler}
      value={value}
      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
        isActive
          ? 'bg-primary-600 text-white border-primary-600 shadow-md focus:ring-primary-500'
          : 'bg-white text-secondary-700 border-secondary-300 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 focus:ring-primary-500'
      }`}
    >
      {title}
    </button>
  );
};

export default Button;
