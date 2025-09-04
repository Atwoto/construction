import React, { useState, useEffect } from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  MapPin,
  Thermometer,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy";
  location: string;
  humidity: number;
  windSpeed: number;
}

interface LiveClockWidgetProps {
  showWeather?: boolean;
  location?: string;
  format24Hour?: boolean;
  showSeconds?: boolean;
}

const LiveClockWidget: React.FC<LiveClockWidgetProps> = ({
  showWeather = true,
  location = "Construction Site",
  format24Hour = false,
  showSeconds = true,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: "sunny",
    location: location,
    humidity: 65,
    windSpeed: 8,
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate weather updates
  useEffect(() => {
    if (!showWeather) return;

    const weatherTimer = setInterval(() => {
      // Simulate weather changes
      const conditions: WeatherData["condition"][] = [
        "sunny",
        "cloudy",
        "rainy",
        "snowy",
      ];
      const randomCondition =
        conditions[Math.floor(Math.random() * conditions.length)];

      setWeather((prev) => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2, // Small temperature fluctuation
        condition: Math.random() > 0.9 ? randomCondition : prev.condition, // 10% chance to change condition
        humidity: Math.max(
          30,
          Math.min(90, prev.humidity + (Math.random() - 0.5) * 10)
        ),
        windSpeed: Math.max(
          0,
          Math.min(25, prev.windSpeed + (Math.random() - 0.5) * 5)
        ),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(weatherTimer);
  }, [showWeather]);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      ...(showSeconds && { second: "2-digit" }),
      hour12: !format24Hour,
    };
    return date.toLocaleTimeString("en-US", options);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWeatherIcon = (condition: WeatherData["condition"]) => {
    const iconClass = "h-6 w-6";
    switch (condition) {
      case "sunny":
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case "cloudy":
        return <Cloud className={`${iconClass} text-gray-500`} />;
      case "rainy":
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      case "snowy":
        return <CloudSnow className={`${iconClass} text-blue-300`} />;
      default:
        return <Sun className={`${iconClass} text-yellow-500`} />;
    }
  };

  const getWeatherGradient = (condition: WeatherData["condition"]) => {
    switch (condition) {
      case "sunny":
        return "from-yellow-400 to-orange-500";
      case "cloudy":
        return "from-gray-400 to-gray-600";
      case "rainy":
        return "from-blue-400 to-blue-600";
      case "snowy":
        return "from-blue-300 to-blue-500";
      default:
        return "from-yellow-400 to-orange-500";
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/40 hover:shadow-xl transition-all duration-300">
      {/* Time Display */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-900 mb-2 font-mono tracking-tight">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-600">{formatDate(currentTime)}</div>
      </div>

      {/* Weather Section */}
      {showWeather && (
        <div
          className={`
          relative overflow-hidden rounded-xl p-4 text-white
          bg-gradient-to-br ${getWeatherGradient(weather.condition)}
        `}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 -mt-2 -mr-2 h-16 w-16 rounded-full bg-white/10 animate-pulse-soft" />

          <div className="relative">
            {/* Location */}
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{weather.location}</span>
            </div>

            {/* Main weather info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(weather.condition)}
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round(weather.temperature)}°C
                  </div>
                  <div className="text-xs opacity-90 capitalize">
                    {weather.condition}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-1 text-xs opacity-90">
                  <Thermometer className="h-3 w-3" />
                  <span>
                    Feels like {Math.round(weather.temperature + 2)}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Additional weather details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="opacity-90">Humidity</span>
                <span className="font-medium">
                  {Math.round(weather.humidity)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="opacity-90">Wind</span>
                <span className="font-medium">
                  {Math.round(weather.windSpeed)} km/h
                </span>
              </div>
            </div>

            {/* Weather alert for construction */}
            {(weather.condition === "rainy" ||
              weather.condition === "snowy" ||
              weather.windSpeed > 20) && (
              <div className="mt-3 p-2 bg-white/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-yellow-300 rounded-full animate-ping" />
                  <span className="text-xs font-medium">
                    Weather Alert: Check site conditions
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Time zones (optional) */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div className="text-center">
            <div className="font-medium">UTC</div>
            <div>{new Date().toUTCString().slice(17, 25)}</div>
          </div>
          <div className="text-center">
            <div className="font-medium">Local</div>
            <div>{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClockWidget;
