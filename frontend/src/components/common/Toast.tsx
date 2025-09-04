import React from "react";
import { clsx } from "clsx";

interface ToastProps {
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

const toastStyles = {
  success: {
    container: "bg-white border-l-4 border-success-500 shadow-lg",
    icon: "✅",
    iconBg: "bg-success-100 text-success-600",
    titleColor: "text-success-800",
    messageColor: "text-success-700",
  },
  error: {
    container: "bg-white border-l-4 border-danger-500 shadow-lg",
    icon: "❌",
    iconBg: "bg-danger-100 text-danger-600",
    titleColor: "text-danger-800",
    messageColor: "text-danger-700",
  },
  warning: {
    container: "bg-white border-l-4 border-warning-500 shadow-lg",
    icon: "⚠️",
    iconBg: "bg-warning-100 text-warning-600",
    titleColor: "text-warning-800",
    messageColor: "text-warning-700",
  },
  info: {
    container: "bg-white border-l-4 border-primary-500 shadow-lg",
    icon: "ℹ️",
    iconBg: "bg-primary-100 text-primary-600",
    titleColor: "text-primary-800",
    messageColor: "text-primary-700",
  },
};

function Toast({
  type = "info",
  title,
  message,
  onClose,
  className,
}: ToastProps) {
  const styles = toastStyles[type];

  return (
    <div
      className={clsx(
        "max-w-sm w-full rounded-xl p-4 animate-slide-in-right",
        styles.container,
        className
      )}
    >
      <div className="flex items-start">
        <div
          className={clsx(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
            styles.iconBg
          )}
        >
          <span className="text-sm">{styles.icon}</span>
        </div>

        <div className="ml-3 flex-1">
          {title && (
            <h4
              className={clsx("text-sm font-semibold mb-1", styles.titleColor)}
            >
              {title}
            </h4>
          )}
          <p className={clsx("text-sm", styles.messageColor)}>{message}</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="text-lg">×</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;
