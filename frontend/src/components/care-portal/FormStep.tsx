import { ReactNode } from "react";

interface FormStepProps {
  children: ReactNode;
  description?: string;
}

export default function FormStep({ children, description }: FormStepProps) {
  return (
    <div className="space-y-4">
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}