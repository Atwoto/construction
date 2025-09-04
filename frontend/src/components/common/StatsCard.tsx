import React from "react";
import { clsx } from "clsx";
import { Link } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down" | "neutral";
  };
  color?: "primary" | "success" | "warning" | "danger" | "info";
  link?: string;
  loading?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const colorClasses = {
  primary: {
    bg: "from-primary-50 to-primary-100",
    icon: "text-primary-600",
    trend: "text-primary-600",
  },
  success: {
    bg: "from-success-50 to-success-100",
    icon: "text-success-600",
    trend: "text-success-600",
  },
  warning: {
    bg: "from-warning-50 to-warning-100",
    icon: "text-warning-600",
    trend: "text-warning-600",
  },
  danger: {
    bg: "from-danger-50 to-danger-100",
    icon: "text-danger-600",
    trend: "text-danger-600",
  },
  info: {
    bg: "from-blue-50 to-blue-100",
    icon: "text-blue-600",
    trend: "text-blue-600",
  },
};

const sizeClasses = {
  sm: {
    container: "p-4",
    title: "text-xs",
    value: "text-lg",
    icon: "h-8 w-8 text-lg",
  },
  md: {
    container: "p-6",
    title: "text-sm",
    value: "text-2xl",
    icon: "h-10 w-10 text-xl",
  },
  lg: {
    container: "p-8",
    title: "text-base",
    value: "text-3xl",
    icon: "h-12 w-12 text-2xl",
  },
};

function StatsCard({
  title,
  value,
  icon,
  trend,
  color = "primary",
  link,
  loading = false,
  className,
  size = "md",
}: StatsCardProps) {
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  const getTrendIcon = () => {
    if (!trend) return null;

    switch (trend.direction) {
      case "up":
        return <span className="text-success-500">↗️</span>;
      case "down":
        return <span className="text-danger-500">↘️</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const content = (
    <div
      className={clsx(
        "bg-white rounded-2xl shadow-soft border border-gray-100 hover-lift hover-glow transition-all duration-300 group",
        sizes.container,
        className
      )}
    >
      {loading ? (
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3
              className={clsx(
                "font-medium text-gray-500 uppercase tracking-wide",
                sizes.title
              )}
            >
              {title}
            </h3>
            {icon && (
              <div
                className={clsx(
                  "rounded-2xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform",
                  colors.bg,
                  colors.icon,
                  sizes.icon
                )}
              >
                {icon}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p
                className={clsx(
                  "font-bold text-gray-900 group-hover:text-primary-600 transition-colors",
                  sizes.value
                )}
              >
                {value}
              </p>

              {trend && (
                <div className="flex items-center mt-2 text-xs">
                  {getTrendIcon()}
                  <span
                    className={clsx(
                      "ml-1 font-medium",
                      trend.direction === "up"
                        ? "text-success-600"
                        : trend.direction === "down"
                          ? "text-danger-600"
                          : "text-gray-500"
                    )}
                  >
                    {trend.value > 0 ? "+" : ""}
                    {trend.value}%
                  </span>
                  <span className="ml-1 text-gray-500">{trend.label}</span>
                </div>
              )}
            </div>

            {link && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="h-5 w-5 text-primary-600 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (link && !loading) {
    return (
      <Link to={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export default StatsCard;
