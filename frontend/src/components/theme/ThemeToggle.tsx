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
      className="relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer bg-gradient-to-r from-amber-300 to-violet-800"
      onClick={toggleTheme}
    >
      <div className="flex justify-between items-center w-full px-1 z-10">
        <Sun className="h-4 w-4 text-amber-600" />
        <Moon className="h-4 w-4 text-violet-100" />
      </div>
      <div
        className={`absolute left-1 transform transition-transform duration-300 ease-in-out w-6 h-6 rounded-full bg-white shadow-md ${isDark ? "translate-x-8" : "translate-x-0"
          }`}
      />
    </div>
  );
}