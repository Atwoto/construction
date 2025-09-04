import React from "react";
import { clsx } from "clsx";
import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  illustration?: "default" | "search" | "error" | "success" | "construction";
}

const illustrations = {
  default: (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
      <svg
        className="h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
  ),
  search: (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
      <svg
        className="h-6 w-6 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  ),
  error: (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
      <svg
        className="h-6 w-6 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>
  ),
  success: (
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
      <svg
        className="h-6 w-6 text-green-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  ),
  construction: (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
      <span className="text-2xl">🏗️</span>
    </div>
  ),
};

const sizeClasses = {
  sm: {
    container: "py-8",
    title: "text-lg",
    description: "text-sm",
  },
  md: {
    container: "py-12",
    title: "text-xl",
    description: "text-base",
  },
  lg: {
    container: "py-16",
    title: "text-2xl",
    description: "text-lg",
  },
};

function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = "md",
  illustration = "default",
}: EmptyStateProps) {
  const sizeConfig = sizeClasses[size];

  return (
    <div className={clsx("text-center", sizeConfig.container, className)}>
      <div className="animate-fade-in">
        {icon || illustrations[illustration]}

        <h3
          className={clsx("mt-4 font-semibold text-gray-900", sizeConfig.title)}
        >
          {title}
        </h3>

        {description && (
          <p
            className={clsx(
              "mt-2 text-gray-500 max-w-sm mx-auto",
              sizeConfig.description
            )}
          >
            {description}
          </p>
        )}

        {(action || secondaryAction) && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {action && (
              <Button
                variant={action.variant || "primary"}
                onClick={action.onClick}
                className="animate-slide-up stagger-1"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="animate-slide-up stagger-2"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
