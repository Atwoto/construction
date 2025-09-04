import React, { useEffect, useState } from "react";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  label?: string;
  animated?: boolean;
  animationDelay?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  color = "#3b82f6",
  backgroundColor = "#e5e7eb",
  showValue = true,
  label,
  animated = true,
  animationDelay = 0,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);

      if (animated) {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const counter = setInterval(() => {
          current += increment;
          if (current >= value) {
            setAnimatedValue(value);
            clearInterval(counter);
          } else {
            setAnimatedValue(current);
          }
        }, duration / steps);

        return () => clearInterval(counter);
      } else {
        setAnimatedValue(value);
      }
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [value, animated, animationDelay]);

  const getColorByValue = (val: number) => {
    if (val >= 80) return "#22c55e"; // green
    if (val >= 60) return "#3b82f6"; // blue
    if (val >= 40) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const progressColor =
    color === "#3b82f6" ? getColorByValue(animatedValue) : color;

  return (
    <div
      className={`
      relative inline-flex items-center justify-center transition-all duration-500
      ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
    `}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold text-gray-900">
            {Math.round(animatedValue)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-500 mt-1 text-center max-w-16">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default CircularProgress;
