"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Logic to determine if dark mode is active
  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div
      className="relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer bg-gradient-to-r from-indigo-300 to-violet-700 shadow-md hover:shadow-lg transition-shadow duration-300"
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleTheme();
        }
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="flex justify-between items-center w-full px-1 z-10">
        <Sun className="h-4 w-4 text-indigo-600 transition-transform duration-300" />
        <Moon className="h-4 w-4 text-violet-100 transition-transform duration-300" />
      </div>
      <div
        className={`absolute left-1 transform transition-transform duration-300 ease-in-out w-6 h-6 rounded-full bg-white shadow-lg ${isDark ? "translate-x-8" : "translate-x-0"
          }`}
      />
    </div>
  );
}