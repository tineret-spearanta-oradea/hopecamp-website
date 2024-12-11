import { PropsWithChildren } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface StepWrapperProps extends PropsWithChildren {
  title: string;
  isLoading?: boolean;
}

export function StepWrapper({ title, children, isLoading }: StepWrapperProps) {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-secondary border-t-transparent"></div>
        </div>
      )}
      <h2 className="text-xl font-black text-center mb-4 py-4">{title}</h2>
      {children}
    </div>
  );
}
