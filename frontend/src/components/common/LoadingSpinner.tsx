import React from "react";
import { clsx } from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "primary" | "secondary" | "white" | "success" | "warning" | "danger";
  variant?: "spinner" | "dots" | "pulse" | "bars";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const colorClasses = {
  primary: "border-primary-600",
  secondary: "border-secondary-600",
  white: "border-white",
  success: "border-success-600",
  warning: "border-warning-600",
  danger: "border-danger-600",
};

const bgColorClasses = {
  primary: "bg-primary-600",
  secondary: "bg-secondary-600",
  white: "bg-white",
  success: "bg-success-600",
  warning: "bg-warning-600",
  danger: "bg-danger-600",
};

function LoadingSpinner({
  size = "md",
  className,
  color = "primary",
  variant = "spinner",
}: LoadingSpinnerProps) {
  if (variant === "dots") {
    return (
      <div
        className={clsx("flex space-x-1", className)}
        role="status"
        aria-label="Loading"
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              "rounded-full animate-pulse",
              size === "sm"
                ? "h-1.5 w-1.5"
                : size === "md"
                  ? "h-2 w-2"
                  : size === "lg"
                    ? "h-3 w-3"
                    : "h-4 w-4",
              bgColorClasses[color]
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1.4s",
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={clsx(
          "rounded-full animate-pulse-soft",
          sizeClasses[size],
          bgColorClasses[color],
          className
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div
        className={clsx("flex items-end space-x-1", className)}
        role="status"
        aria-label="Loading"
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={clsx(
              "animate-bounce-soft",
              size === "sm"
                ? "w-1 h-3"
                : size === "md"
                  ? "w-1.5 h-4"
                  : size === "lg"
                    ? "w-2 h-6"
                    : "w-3 h-8",
              bgColorClasses[color]
            )}
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: "0.6s",
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-2 border-t-transparent",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;
