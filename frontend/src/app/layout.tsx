import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: "CarePortal Beta",
  description: "Find the right care facility for your needs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={GeistSans.className}>
        <ThemeProvider>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}