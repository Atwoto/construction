import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number;
  percentage?: number;
  showPercentage?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  percentage,
  showPercentage = true,
  className = "",
  size = "md",
}) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const getColorClasses = () => {
    if (isPositive) return "text-green-600 bg-green-50";
    if (isNegative) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getIcon = () => {
    if (isPositive) return <TrendingUp className={iconSizes[size]} />;
    if (isNegative) return <TrendingDown className={iconSizes[size]} />;
    return <Minus className={iconSizes[size]} />;
  };

  const displayValue = percentage !== undefined ? percentage : Math.abs(value);

  return (
    <div
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${getColorClasses()} ${sizeClasses[size]} font-medium ${className}`}
    >
      {getIcon()}
      {showPercentage && (
        <span>
          {isPositive && "+"}
          {displayValue.toFixed(1)}%
        </span>
      )}
    </div>
  );
};

export default TrendIndicator;
