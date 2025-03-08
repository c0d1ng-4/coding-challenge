"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FacilityForm } from "@/components/admin/FacilityForm";
import { FacilityList } from "@/components/admin/FacilityList";

// Use dynamic import for code splitting
const PatientForm = dynamic(() => import("@/components/care-portal/PatientForm"), {
  loading: () => (
    <div className="w-full max-w-md mx-auto p-6 border rounded-lg shadow animate-pulse">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-3/4"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6 w-1/2"></div>
      <div className="space-y-4">
        <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-1/3 ml-auto"></div>
      </div>
    </div>
  ),
  ssr: false // Disable server-side rendering for this component
});

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Admin controls positioned absolute at top right */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <FacilityList />
        <FacilityForm />
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center justify-between p-4 md:p-24 max-w-6xl mx-auto">
        <div className="w-full space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              CarePortal Beta
            </h1>
            <p className="text-lg text-muted-foreground">
              Find the right care facility for your needs
            </p>
          </div>

          <Suspense fallback={
            <div className="w-full flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          }>
            <PatientForm hideTitle={true} />
          </Suspense>

          <div className="text-center text-sm text-muted-foreground mt-12 pt-8 border-t border-muted">
            <p>© 2025. All rights reserved.</p>
            <p className="mt-1">For support, contact: hi@hi.com</p>
          </div>
        </div>
      </div>
    </main>
  );
}