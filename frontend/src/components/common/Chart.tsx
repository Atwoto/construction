import React from "react";
import { clsx } from "clsx";

interface ChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  type?: "bar" | "line" | "donut" | "area";
  height?: number;
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

// Simple bar chart component
export function BarChart({
  data,
  height = 200,
  className,
  showLabels = true,
  animated = true,
}: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className={clsx("w-full", className)}>
      <div
        className="flex items-end justify-between space-x-2"
        style={{ height }}
      >
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 40);
          const color = item.color || "#2563eb";

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex justify-center">
                {showLabels && (
                  <div className="absolute -top-6 text-xs font-medium text-gray-600">
                    {item.value}
                  </div>
                )}
                <div
                  className={clsx(
                    "w-full max-w-12 rounded-t-lg transition-all duration-700 ease-out",
                    animated && "animate-slide-up"
                  )}
                  style={{
                    height: barHeight,
                    backgroundColor: color,
                    animationDelay: animated ? `${index * 0.1}s` : "0s",
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center font-medium">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Simple donut chart component
export function DonutChart({
  data,
  className,
  size = 120,
}: ChartProps & { size?: number }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const radius = 45;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className={clsx("flex items-center space-x-6", className)}>
      <div className="relative">
        <svg height={size} width={size} className="transform -rotate-90">
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={size / 2}
            cy={size / 2}
          />
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
            const strokeDashoffset =
              (-cumulativePercentage * circumference) / 100;
            cumulativePercentage += percentage;

            return (
              <circle
                key={index}
                stroke={item.color || `hsl(${index * 137.5}, 70%, 50%)`}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={size / 2}
                cy={size / 2}
                className="transition-all duration-700 ease-out"
                style={{ animationDelay: `${index * 0.2}s` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor:
                  item.color || `hsl(${index * 137.5}, 70%, 50%)`,
              }}
            />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">
              {item.value} ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple area chart component
export function AreaChart({
  data,
  height = 200,
  className,
  animated = true,
}: ChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const width = 300;
  const padding = 20;

  const points = data
    .map((item, index) => {
      const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
      const y =
        height - padding - (item.value / maxValue) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className={clsx("w-full", className)}>
      <svg width={width} height={height} className="w-full">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area */}
        <polygon
          points={areaPoints}
          fill="url(#areaGradient)"
          className={clsx(animated && "animate-fade-in")}
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className={clsx(animated && "animate-fade-in")}
          style={{ animationDelay: "0.3s" }}
        />

        {/* Data points */}
        {data.map((item, index) => {
          const x =
            padding + (index * (width - 2 * padding)) / (data.length - 1);
          const y =
            height - padding - (item.value / maxValue) * (height - 2 * padding);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3b82f6"
              className={clsx(
                "hover:r-6 transition-all cursor-pointer",
                animated && "animate-scale-in"
              )}
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <title>
                {item.label}: {item.value}
              </title>
            </circle>
          );
        })}
      </svg>

      {/* Labels */}
      <div className="flex justify-between mt-2 px-5">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-500 text-center">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BarChart;
