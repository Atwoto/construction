import React from "react";

interface DataPoint {
  value: number;
  label?: string;
}

interface MiniChartProps {
  data: DataPoint[];
  type?: "line" | "bar" | "area";
  color?: string;
  height?: number;
  width?: number;
  showDots?: boolean;
  animated?: boolean;
}

const MiniChart: React.FC<MiniChartProps> = ({
  data,
  type = "line",
  color = "#3b82f6",
  height = 60,
  width = 200,
  showDots = false,
  animated = true,
}) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((point.value - minValue) / range) * height,
    value: point.value,
  }));

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L";
    return `${path} ${command} ${point.x} ${point.y}`;
  }, "");

  const areaPath =
    type === "area" ? `${pathData} L ${width} ${height} L 0 ${height} Z` : "";

  return (
    <div className="relative mini-chart">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

        {/* Area fill */}
        {type === "area" && (
          <path
            d={areaPath}
            fill={color}
            fillOpacity="0.1"
            className={animated ? "animate-fade-in" : ""}
          />
        )}

        {/* Bars */}
        {type === "bar" &&
          points.map((point, index) => (
            <rect
              key={index}
              x={point.x - 2}
              y={point.y}
              width="4"
              height={height - point.y}
              fill={color}
              className={`
              transition-all duration-500 hover:opacity-80
              ${animated ? "animate-slide-up" : ""}
            `}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}

        {/* Line */}
        {(type === "line" || type === "area") && (
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`
              transition-all duration-1000
              ${animated ? "animate-fade-in" : ""}
            `}
            style={{
              strokeDasharray: animated ? "1000" : "none",
              strokeDashoffset: animated ? "1000" : "0",
              animation: animated ? "drawLine 2s ease-out forwards" : "none",
            }}
          />
        )}

        {/* Dots */}
        {showDots &&
          points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill={color}
              className={`
              transition-all duration-300 hover:r-4 cursor-pointer
              ${animated ? "animate-scale-in" : ""}
            `}
              style={{ animationDelay: `${index * 100 + 500}ms` }}
            >
              <title>{`Value: ${point.value}`}</title>
            </circle>
          ))}

        {/* Hover line */}
        <line
          x1="0"
          y1="0"
          x2="0"
          y2={height}
          stroke="#6b7280"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity="0"
          className="hover-line pointer-events-none"
        />
      </svg>

      {/* Trend indicator */}
      <div className="absolute top-1 right-1">
        {data.length > 1 && (
          <div
            className={`
            flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium
            ${
              data[data.length - 1].value > data[0].value
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
          >
            <span>
              {data[data.length - 1].value > data[0].value ? "↗" : "↘"}
            </span>
            <span>
              {Math.abs(
                ((data[data.length - 1].value - data[0].value) /
                  data[0].value) *
                  100
              ).toFixed(1)}
              %
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Sparkline component for inline charts
export const Sparkline: React.FC<{
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}> = ({ data, color = "#3b82f6", height = 30, width = 100 }) => {
  const chartData = data.map((value) => ({ value }));

  return (
    <MiniChart
      data={chartData}
      type="line"
      color={color}
      height={height}
      width={width}
      showDots={false}
      animated={false}
    />
  );
};

export default MiniChart;
