import React, { useEffect } from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";
  const icon =
    type === "success" ? (
      <CheckCircleIcon className="h-6 w-6 text-white" />
    ) : null; // Add other icons as needed

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor}`}
      role="alert"
    >
      {icon && <div className="mr-2">{icon}</div>}
      <span className="font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto p-1 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors duration-150"
      >
        <XMarkIcon className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};
