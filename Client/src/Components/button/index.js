import React from 'react';

const Button = ({
    label = "",
    type = "button",
    className = "", // Renamed to className
    disabled = false
}) => {
  return (
    <div>
      <button 
        className={`bg-green-700 w-full hover:bg-green-800 rounded-lg p-1 text-3xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${className}`} // Added focus styles
        type={type}
        disabled={disabled}
        aria-label={label} // Optional: Add aria-label for accessibility
      >
        {label}
      </button>
    </div>
  );
}

export default Button;