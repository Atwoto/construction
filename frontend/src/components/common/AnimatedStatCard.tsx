import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AnimatedStatCardProps {
  title: string;
  value: number | string;
  icon: string | React.ReactNode;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  link?: string;
  trend?: {
    value: number;
    direction: "up" | "down";
    label: string;
  };
  prefix?: string;
  suffix?: string;
  animationDelay?: number;
  formatValue?: (value: number) => string;
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  icon,
  color = "primary",
  link,
  trend,
  prefix = "",
  suffix = "",
  animationDelay = 0,
  formatValue,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const numericValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.-]/g, "")) || 0
      : value;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);

      if (typeof numericValue === "number" && numericValue > 0) {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = numericValue / steps;
        let current = 0;

        const counter = setInterval(() => {
          current += increment;
          if (current >= numericValue) {
            setDisplayValue(numericValue);
            clearInterval(counter);
          } else {
            setDisplayValue(Math.floor(current));
          }
        }, duration / steps);

        return () => clearInterval(counter);
      } else {
        setDisplayValue(numericValue);
      }
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [numericValue, animationDelay]);

  const colorClasses = {
    primary:
      "from-primary-50 to-primary-100 text-primary-600 border-primary-200",
    success:
      "from-success-50 to-success-100 text-success-600 border-success-200",
    warning:
      "from-warning-50 to-warning-100 text-warning-600 border-warning-200",
    danger: "from-danger-50 to-danger-100 text-danger-600 border-danger-200",
    info: "from-blue-50 to-blue-100 text-blue-600 border-blue-200",
  };

  const hoverColors = {
    primary: "hover:shadow-primary-500/20",
    success: "hover:shadow-success-500/20",
    warning: "hover:shadow-warning-500/20",
    danger: "hover:shadow-danger-500/20",
    info: "hover:shadow-blue-500/20",
  };

  const formattedValue = formatValue
    ? formatValue(displayValue)
    : `${prefix}${displayValue.toLocaleString()}${suffix}`;

  const CardContent = () => (
    <div
      className={`
      group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-white/40 
      p-6 shadow-soft hover:shadow-xl ${hoverColors[color]} hover:-translate-y-2 
      transition-all duration-300 cursor-pointer
      ${isVisible ? "animate-slide-up" : "opacity-0 translate-y-4"}
    `}
    >
      {/* Gradient background overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      {/* Content */}
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-2 group-hover:text-gray-600 transition-colors">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3
              className={`text-3xl font-bold text-gray-900 group-hover:text-${color}-600 transition-colors duration-300`}
            >
              {formattedValue}
            </h3>
            {trend && (
              <div
                className={`flex items-center space-x-1 text-sm font-medium ${
                  trend.direction === "up"
                    ? "text-success-600"
                    : "text-danger-600"
                }`}
              >
                {trend.direction === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          {trend && <p className="text-xs text-gray-500 mt-1">{trend.label}</p>}
        </div>

        {/* Icon container */}
        <div
          className={`
          p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} 
          group-hover:scale-110 transition-transform duration-300
          shadow-inner border
        `}
        >
          {typeof icon === "string" ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <div className="h-6 w-6">{icon}</div>
          )}
        </div>
      </div>

      {/* View details link */}
      {link && (
        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-all">
            View details
            <svg
              className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Pulse dot for urgent items */}
      {trend && trend.direction === "down" && trend.value > 10 && (
        <div className="absolute top-3 right-3">
          <div className="h-3 w-3 bg-danger-500 rounded-full animate-ping" />
          <div className="absolute top-0 h-3 w-3 bg-danger-500 rounded-full" />
        </div>
      )}
    </div>
  );

  return link ? (
    <Link to={link}>
      <CardContent />
    </Link>
  ) : (
    <CardContent />
  );
};

export default AnimatedStatCard;
