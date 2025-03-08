"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    // Apply the default theme on mount to avoid flashing
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'light');
    }, []);

    return (
        <NextThemesProvider
            attribute="data-theme"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange={false}
            forcedTheme={undefined}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
}