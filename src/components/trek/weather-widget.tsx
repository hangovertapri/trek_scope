'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
  uvIndex: number;
}

interface WeatherWidgetProps {
  coordinates: [number, number]; // [latitude, longitude]
  trekName: string;
}

export default function WeatherWidget({
  coordinates,
  trekName,
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const [lat, lng] = coordinates;

        // Validate and format coordinates
        const latitude = parseFloat(String(lat));
        const longitude = parseFloat(String(lng));

        if (isNaN(latitude) || isNaN(longitude)) {
          throw new Error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
        }

        // Ensure coordinates are within valid ranges
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          throw new Error(`Coordinates out of range: lat=${latitude}, lng=${longitude}`);
        }

        // Using Open-Meteo API (free, no API key needed, CORS enabled)
        // Only request fields that are available in the current weather endpoint
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,uv_index&temperature_unit=celsius&wind_speed_unit=kmh`;

        console.log('Fetching weather from:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Weather API error response:', errorText);
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.current) {
          throw new Error('No current weather data in response');
        }

        const current = data.current;

        setWeather({
          temperature: Math.round(current.temperature_2m || 0),
          condition: getWeatherCondition(current.weather_code || 0),
          humidity: current.relative_humidity_2m || 0,
          windSpeed: Math.round(current.wind_speed_10m || 0),
          visibility: 10, // Default visibility when not available
          feelsLike: Math.round(current.temperature_2m || 0), // Use actual temperature as fallback
          uvIndex: Math.round((current.uv_index || 0) * 10) / 10,
        });
        setError(null);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to load real-time weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [coordinates]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 animate-pulse">
        <div className="h-6 bg-blue-200 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-blue-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 bg-blue-200 rounded"></div>
          <div className="h-16 bg-blue-200 rounded"></div>
          <div className="h-16 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
        <p className="text-sm text-amber-800 mb-2">⚠️ Unable to load real-time weather data</p>
        <p className="text-xs text-amber-700">
          Weather information may not be available at this moment. Please check the trek operator's website for current conditions before departure.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-amber-400 mb-2">Current Weather</h3>
        <p className="text-sm text-slate-300">{trekName} Area</p>
      </div>

      {/* Main weather display */}
      <div className="flex items-start gap-6 mb-6 pb-6 border-b border-slate-700">
        <div className="flex-1">
          <div className="flex items-end gap-2 mb-2">
            <div className="text-5xl font-bold text-amber-400">{weather.temperature}°C</div>
            <div className="text-sm text-slate-300 mb-1">
              {weather.condition}
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Feels like <strong>{weather.feelsLike}°C</strong>
          </p>
        </div>

        {/* Weather icon */}
        <div className="flex-shrink-0">
          {getWeatherIcon(weather.condition)}
        </div>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Humidity */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-5 w-5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-400">Humidity</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{weather.humidity}%</p>
        </div>

        {/* Wind Speed */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="h-5 w-5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-400">Wind Speed</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{weather.windSpeed} km/h</p>
        </div>

        {/* Visibility */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-5 w-5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-400">Visibility</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{weather.visibility} km</p>
        </div>

        {/* UV Index */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-5 w-5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-400">UV Index</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{weather.uvIndex}</p>
          <p className="text-xs text-slate-400 mt-1">{getUVRisk(weather.uvIndex)}</p>
        </div>
      </div>

      {/* Weather alert */}
      {shouldShowWeatherAlert(weather) && (
        <div className="mt-6 p-4 bg-slate-800 border border-amber-500 rounded-lg">
          <p className="text-sm text-amber-400">
            ⚠️ <strong>Weather Advisory:</strong> High UV index detected. Bring
            sunscreen and protective gear for high-altitude trekking.
          </p>
        </div>
      )}

      {/* Forecast note */}
      <div className="mt-4 p-3 bg-slate-800 rounded-lg text-xs text-slate-300 border border-slate-700">
        <p>
          💡 <strong>Tip:</strong> Weather conditions can change rapidly at high altitude. Always check local forecasts before departure.
        </p>
      </div>
    </div>
  );
}

function getWeatherIcon(condition: string) {
  switch (condition) {
    case 'Sunny':
      return <Sun className="h-16 w-16 text-yellow-400" />;
    case 'Cloudy':
      return <Cloud className="h-16 w-16 text-slate-400" />;
    case 'Rainy':
      return <CloudRain className="h-16 w-16 text-blue-400" />;
    case 'Snowy':
      return <Cloud className="h-16 w-16 text-blue-200" />;
    default:
      return <Sun className="h-16 w-16 text-gray-400" />;
  }
}

function getWeatherCondition(code: number): string {
  // WMO Weather interpretation codes
  if (code === 0 || code === 1) return 'Sunny';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Cloudy';
  if (code === 45 || code === 48) return 'Foggy';
  if (code === 51 || code === 53 || code === 55) return 'Light Rain';
  if (code === 61 || code === 63 || code === 65) return 'Rainy';
  if (code === 71 || code === 73 || code === 75) return 'Snowy';
  if (code === 80 || code === 81 || code === 82) return 'Heavy Rain';
  if (code === 85 || code === 86) return 'Heavy Snow';
  if (code === 95 || code === 96 || code === 99) return 'Thunderstorm';
  return 'Unknown';
}

function getUVRisk(uvIndex: number): string {
  if (uvIndex < 3) return 'Low';
  if (uvIndex < 6) return 'Moderate';
  if (uvIndex < 8) return 'High';
  if (uvIndex < 11) return 'Very High';
  return 'Extreme';
}

function shouldShowWeatherAlert(weather: WeatherData): boolean {
  return weather.uvIndex >= 6 || weather.windSpeed > 30 || weather.visibility < 5;
}
