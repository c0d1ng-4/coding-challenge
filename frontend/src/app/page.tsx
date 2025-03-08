import PatientForm from "@/components/care-portal/PatientForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="max-w-3xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">CarePortal Beta</h1>
          <p className="text-slate-600">Find the right care facility for your needs</p>
        </div>

        <PatientForm />

        <div className="text-center text-sm text-slate-500 mt-8">
          <p>© 2023 CareMates. All rights reserved.</p>
          <p className="mt-1">For support, contact: help@caremateshc.com</p>
        </div>
      </div>
    </main>
  );
}