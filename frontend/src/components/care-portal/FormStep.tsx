import { ReactNode } from "react";

interface FormStepProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormStep({ title, description, children }: FormStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">{title}</h2>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}