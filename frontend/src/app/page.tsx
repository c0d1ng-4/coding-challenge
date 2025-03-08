import PatientForm from "@/components/care-portal/PatientForm";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-3xl w-full space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold">CarePortal Beta</h1>
            <p className="text-muted-foreground">Facility matcher</p>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <PatientForm hideTitle={true} />

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p>© 2025. All rights reserved.</p>
          <p className="mt-1">For support, contact: hi@hi.com</p>
        </div>
      </div>
    </main>
  );
}