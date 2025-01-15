import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-md">
      <AlertCircle className="h-5 w-5" />
      <p>{message}</p>
    </div>
  );
}