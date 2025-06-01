import React from "react";

const Button = ({ children, type = "button", className = "", ...props }) => {
  return (
    <button
      type={type}
      className={`w-full px-5 py-2.5 text-white font-medium text-sm leading-tight rounded-full shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
