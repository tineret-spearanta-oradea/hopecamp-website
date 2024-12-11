import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "@/hooks/use-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showErrorToast = (message: string, description?: string) => {
  toast({
    variant: "destructive",
    title: message,
    description: description,
  });
};

export const showSuccessToast = (message: string, description?: string) => {
  toast({
    title: message,
    description: description,
  });
};
