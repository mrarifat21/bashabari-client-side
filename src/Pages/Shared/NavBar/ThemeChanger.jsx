import React, { useEffect, useState, useRef } from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

const ThemeChanger = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "system";
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    if (themeValue === "light") {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else if (themeValue === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.removeItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setTheme(value);
    setIsOpen(false);
  };

  const themeOptions = [
    { label: "Light", value: "light", icon: <FaSun className="text-yellow-500" /> },
    { label: "Dark", value: "dark", icon: <FaMoon className="text-blue-400" /> },
    { label: "System", value: "system", icon: <FaDesktop className="text-gray-400" /> },
  ];

  const selectedIcon = themeOptions.find((t) => t.value === theme)?.icon;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        title={`Current Theme: ${theme}`}
      >
        {selectedIcon}
      </button>

      <div
        className={`origin-top-right absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/10 z-50
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <ul className="py-1">
          {themeOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => handleSelect(option.value)}
                className={`flex items-center w-full px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  theme === option.value
                    ? "font-semibold text-primary"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThemeChanger;
