export interface WeatherForecastDay {
  date: string; // e.g. "Wed, Aug 19"
  dayName: string; // e.g. "Wed"
  tempMax: number;
  tempMin: number;
  condition: string;
  iconCode: string;
  iconUrl: string;
  rainChance: number; // percentage 0-100
}

export interface RealWeatherData {
  locationName: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  windSpeed: number; // km/h
  condition: string;
  iconCode: string;
  iconUrl: string;
  rainChance: number; // percentage 0-100
  forecast: WeatherForecastDay[];
  isApiConnected: boolean;
  fetchedAt: string;
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';

/**
 * Maps OpenWeather condition codes to friendly weather emojis
 */
export function getWeatherEmoji(iconCode: string, conditionName: string): string {
  if (!iconCode) return '☀️';
  if (iconCode.startsWith('01')) return '☀️';
  if (iconCode.startsWith('02')) return '⛅';
  if (iconCode.startsWith('03') || iconCode.startsWith('04')) return '☁️';
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return '🌧️';
  if (iconCode.startsWith('11')) return '⛈️';
  if (iconCode.startsWith('13')) return '❄️';
  if (iconCode.startsWith('50')) return '🌫️';

  const cond = conditionName.toLowerCase();
  if (cond.includes('rain')) return '🌧️';
  if (cond.includes('cloud')) return '☁️';
  if (cond.includes('clear') || cond.includes('sun')) return '☀️';
  if (cond.includes('thunder')) return '⛈️';
  return '🌡️';
}

/**
 * Clean location query string (removes state/country suffixes e.g. "Nashik, Maharashtra" -> "Nashik")
 */
export function extractCityName(locationStr: string): string {
  if (!locationStr) return '';
  return locationStr.split(',')[0].trim();
}

/**
 * Fetch real-time weather and 5-day forecast from OpenWeatherMap API
 */
export async function fetchRealWeatherData(
  locationInput?: string | { lat: number; lon: number }
): Promise<RealWeatherData> {
  const key = API_KEY;

  let currentUrl = '';
  let forecastUrl = '';

  if (typeof locationInput === 'object' && locationInput.lat && locationInput.lon) {
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${locationInput.lat}&lon=${locationInput.lon}&units=metric&appid=${key}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${locationInput.lat}&lon=${locationInput.lon}&units=metric&appid=${key}`;
  } else {
    const city = extractCityName(typeof locationInput === 'string' && locationInput ? locationInput : 'Nashik');
    currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
    forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
  }

  // Fetch Current Weather & Forecast in parallel
  const [currentRes, forecastRes] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl)
  ]);

  if (!currentRes.ok) {
    if (currentRes.status === 401) {
      throw new Error('OpenWeather API Key (401 Unauthorized). The configured API key is either invalid or undergoing standard 10-30 minute activation on OpenWeatherMap servers.');
    }
    if (currentRes.status === 404) {
      throw new Error(`Location "${typeof locationInput === 'string' ? locationInput : 'specified city'}" not found in OpenWeather database. Please select another city.`);
    }
    throw new Error(`OpenWeather API returned error (${currentRes.status}: ${currentRes.statusText})`);
  }

  const currentData = await currentRes.json();
  const forecastData = forecastRes.ok ? await forecastRes.json() : null;

  // Process 5-day forecast from 3-hour list
  const forecastDays: WeatherForecastDay[] = [];
  let maxRainChance = 0;

  if (forecastData && Array.isArray(forecastData.list)) {
    const dayGroups: { [dateKey: string]: any[] } = {};

    forecastData.list.forEach((item: any) => {
      const dt = new Date(item.dt * 1000);
      const dateKey = dt.toISOString().split('T')[0];
      if (!dayGroups[dateKey]) {
        dayGroups[dateKey] = [];
      }
      dayGroups[dateKey].push(item);

      // Track max pop for today
      if (item.pop && item.pop > maxRainChance) {
        maxRainChance = item.pop;
      }
    });

    // Extract up to 5 days
    Object.keys(dayGroups).slice(0, 5).forEach((dateKey) => {
      const items = dayGroups[dateKey];
      const midItem = items[Math.floor(items.length / 2)] || items[0];
      const dt = new Date(dateKey);

      let maxT = -100;
      let minT = 100;
      let dayRain = 0;

      items.forEach((it) => {
        if (it.main.temp_max > maxT) maxT = it.main.temp_max;
        if (it.main.temp_min < minT) minT = it.main.temp_min;
        if (it.pop && it.pop > dayRain) dayRain = it.pop;
      });

      const dayName = dt.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDate = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      forecastDays.push({
        date: `${dayName}, ${fullDate}`,
        dayName,
        tempMax: Math.round(maxT),
        tempMin: Math.round(minT),
        condition: midItem.weather[0]?.description ? capitalize(midItem.weather[0].description) : 'Clear',
        iconCode: midItem.weather[0]?.icon || '01d',
        iconUrl: `https://openweathermap.org/img/wn/${midItem.weather[0]?.icon || '01d'}@2x.png`,
        rainChance: Math.round(dayRain * 100)
      });
    });
  }

  const mainWeather = currentData.weather[0] || {};
  const currentRainChance = Math.round(maxRainChance * 100);

  return {
    locationName: currentData.name || 'Farm Region',
    country: currentData.sys?.country || '',
    temp: Math.round(currentData.main.temp),
    feelsLike: Math.round(currentData.main.feels_like),
    tempMax: Math.round(currentData.main.temp_max),
    tempMin: Math.round(currentData.main.temp_min),
    humidity: currentData.main.humidity,
    windSpeed: Math.round((currentData.wind?.speed || 0) * 3.6), // convert m/s to km/h
    condition: mainWeather.description ? capitalize(mainWeather.description) : 'Clear',
    iconCode: mainWeather.icon || '01d',
    iconUrl: `https://openweathermap.org/img/wn/${mainWeather.icon || '01d'}@2x.png`,
    rainChance: currentRainChance,
    forecast: forecastDays,
    isApiConnected: true,
    fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
