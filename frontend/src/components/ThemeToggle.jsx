import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // Make sure you have lucide-react installed for these icons

const ThemeToggle = () => {
  // Initialize theme from localStorage or default to user's system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      return true;
    }
    if (savedTheme === "light") {
      return false;
    }
    // If no theme is saved, check user's system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme to the HTML element and save to localStorage
  useEffect(() => {
    const html = document.documentElement; // This refers to the <html> tag

    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]); // Re-run effect whenever isDarkMode changes

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-center"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
 