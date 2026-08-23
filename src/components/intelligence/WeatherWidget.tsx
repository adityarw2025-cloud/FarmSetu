import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Thermometer, 
  Wind, 
  Droplets, 
  RefreshCw, 
  MapPin, 
  Navigation, 
  Search, 
  AlertCircle,
  Sun,
  Cloud,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { fetchRealWeatherData, getWeatherEmoji, extractCityName } from '../../services/weatherService';
import type { RealWeatherData } from '../../services/weatherService';
import type { UserProfile } from '../../types';

interface WeatherWidgetProps {
  currentUser: UserProfile | null;
}

const POPULAR_CITIES = ['Nashik', 'Indore', 'Ratnagiri', 'Mumbai', 'Pune', 'Delhi', 'Bengaluru', 'Nagpur', 'Jaipur', 'Ahmedabad'];

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ currentUser }) => {
  const [weatherData, setWeatherData] = useState<RealWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Active location selection state
  const [activeLocation, setActiveLocation] = useState<string>(
    currentUser?.location ? extractCityName(currentUser.location) : 'Nashik'
  );

  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Synchronize when currentUser's location changes in profile
  useEffect(() => {
    if (currentUser?.location) {
      const city = extractCityName(currentUser.location);
      if (city) {
        setActiveLocation(city);
      }
    }
  }, [currentUser?.location]);

  // Fetch weather data whenever activeLocation changes
  const loadWeather = async (locQuery?: string | { lat: number; lon: number }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRealWeatherData(locQuery || activeLocation);
      setWeatherData(data);
      if (data.locationName) {
        setActiveLocation(data.locationName);
      }
    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'Unable to load real-time weather data for this location.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, [activeLocation]);

  // Browser Geolocation request handler
  const handleUseGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Browser Geolocation is not supported by your device. Please enter a city manually.');
      return;
    }

    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        loadWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        setLoading(false);
        setError('Location access was denied or unavailable. Please select or search a city manually.');
      },
      { timeout: 10000 }
    );
  };

  // Handle city search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveLocation(searchInput.trim());
    setSearchInput('');
    setIsSearching(false);
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Controls: Location Selector + GPS + Refresh */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ☀️ REAL-TIME OPENWEATHER RADAR
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
              Weather Center
            </h3>
            {weatherData && (
              <span style={{ fontSize: '0.75rem', background: '#DCFCE7', color: '#14532D', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                Live API Connected
              </span>
            )}
          </div>
        </div>

        {/* Location Switcher & Refresh Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {/* Quick Popular City Pill Selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }} className="hidden md:flex">
            {POPULAR_CITIES.slice(0, 4).map((city) => (
              <button
                key={city}
                onClick={() => setActiveLocation(city)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: activeLocation.toLowerCase() === city.toLowerCase() ? 700 : 500,
                  background: activeLocation.toLowerCase() === city.toLowerCase() ? 'var(--emerald)' : 'var(--surface-hover)',
                  color: activeLocation.toLowerCase() === city.toLowerCase() ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--surface-border)',
                  cursor: 'pointer'
                }}
              >
                {city}
              </button>
            ))}
          </div>

          {/* GPS Button */}
          <button 
            onClick={handleUseGeolocation}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '20px' }}
            title="Use current GPS location"
          >
            <Navigation size={14} />
            <span className="hidden sm:inline">Use GPS</span>
          </button>

          {/* Search Toggle Button */}
          <button 
            onClick={() => setIsSearching(!isSearching)}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '20px' }}
          >
            <Search size={14} />
            <span>Search City</span>
          </button>

          {/* Refresh Button */}
          <button 
            onClick={() => loadWeather()}
            disabled={loading}
            className="btn btn-emerald btn-sm"
            style={{ borderRadius: '20px' }}
            title="Refresh Weather API Data"
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Fetching...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* City Search Bar Drawer */}
      {isSearching && (
        <form onSubmit={handleSearchSubmit} className="animate-fade-in" style={{ display: 'flex', gap: '10px', background: 'var(--surface-hover)', padding: '12px', borderRadius: '12px' }}>
          <input 
            type="text" 
            placeholder="Enter city name (e.g. Nashik, Mumbai, Indore, London)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="form-input"
            style={{ flex: 1 }}
            autoFocus
          />
          <button type="submit" className="btn btn-emerald">
            Get Weather
          </button>
        </form>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={36} className="spin" color="var(--primary)" style={{ margin: '0 auto 12px auto' }} />
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>Fetching Live OpenWeather Telemetry...</div>
          <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Querying location: {activeLocation}</div>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          textAlign: 'center'
        }}>
          <AlertCircle size={32} color="#991B1B" style={{ margin: '0 auto 10px auto' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991B1B', marginBottom: '6px' }}>
            Weather API Error
          </h4>
          <p style={{ color: '#7F1D1D', fontSize: '0.875rem', maxWidth: '520px', margin: '0 auto 16px auto' }}>
            {error}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => loadWeather()} className="btn btn-emerald btn-sm">
              <RefreshCw size={14} /> Try Again
            </button>

            {/* Quick Fallback Cities */}
            {POPULAR_CITIES.slice(0, 3).map(c => (
              <button key={c} onClick={() => setActiveLocation(c)} className="btn btn-outline btn-sm">
                Try {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SUCCESS WEATHER DISPLAY */}
      {!loading && !error && weatherData && (
        <>
          {/* Main Weather Card Summary Grid */}
          <div style={{
            background: 'linear-gradient(135deg, #0F4C3A 0%, #16A34A 100%)',
            color: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.25)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '24px',
            alignItems: 'center'
          }} className="grid-2">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                <MapPin size={18} />
                <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.02em' }}>
                  {weatherData.locationName}{weatherData.country ? `, ${weatherData.country}` : ''}
                </span>
                <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>
                  (Updated {weatherData.fetchedAt})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '14px 0' }}>
                <div style={{ fontSize: '3.8rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {weatherData.temp}°C
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{getWeatherEmoji(weatherData.iconCode, weatherData.condition)}</span>
                    <span>{weatherData.condition}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.85, marginTop: '2px' }}>
                    Feels like <strong>{weatherData.feelsLike}°C</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', opacity: 0.9, paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <div>Today's High: <strong>{weatherData.tempMax}°C</strong></div>
                <div>•</div>
                <div>Today's Low: <strong>{weatherData.tempMin}°C</strong></div>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px'
            }}>
              <div>
                <div style={{ fontSize: '0.725rem', opacity: 0.8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Droplets size={14} /> HUMIDITY
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
                  {weatherData.humidity}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', opacity: 0.8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Wind size={14} /> WIND SPEED
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
                  {weatherData.windSpeed} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>km/h</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', opacity: 0.8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CloudRain size={14} /> RAIN PROBABILITY
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
                  {weatherData.rainChance}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.725rem', opacity: 0.8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Thermometer size={14} /> TEMP SPREAD
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
                  {weatherData.tempMax - weatherData.tempMin}°C
                </div>
              </div>
            </div>
          </div>

          {/* 5-DAY FORECAST SECTION */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={18} /> 5-Day Regional Forecast
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Powered by OpenWeatherMap API
              </span>
            </div>

            <div className="forecast-grid">
              {weatherData.forecast.map((f, idx) => (
                <div key={idx} className="forecast-card" style={{
                  background: 'var(--surface-hover)',
                  padding: '16px 12px',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  border: '1px solid var(--surface-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {f.dayName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {f.date.split(', ')[1]}
                  </div>

                  <div style={{ fontSize: '2.2rem', margin: '8px 0' }}>
                    {getWeatherEmoji(f.iconCode, f.condition)}
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {f.tempMax}° <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {f.tempMin}°</span>
                  </div>

                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'capitalize' }}>
                    {f.condition}
                  </div>

                  {f.rainChance > 0 && (
                    <div style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700, marginTop: '6px', background: '#E0F2FE', padding: '2px 8px', borderRadius: '10px' }}>
                      🌧️ {f.rainChance}% rain
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
