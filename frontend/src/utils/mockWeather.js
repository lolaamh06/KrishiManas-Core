/**
 * Mock weather service for Hassan district, Karnataka.
 * Replace `getMockWeather` call with a real OWM API call when the key is available.
 * The structure returned is identical to what the real integration will return.
 */

const TALUK_WEATHER = {
  Hassan:         { temp: 29, humidity: 64, rainfall14d: 12, soilMoisture: 'Moderate', forecast: 'Clear skies this week' },
  Alur:           { temp: 27, humidity: 78, rainfall14d: 48, soilMoisture: 'Saturated', forecast: 'Unseasonal heavy rain expected Thursday' },
  Sakleshpur:     { temp: 22, humidity: 88, rainfall14d: 92, soilMoisture: 'Waterlogged', forecast: 'Continued rain — risk of landslide in western slopes' },
  Arsikere:       { temp: 31, humidity: 52, rainfall14d: 4,  soilMoisture: 'Dry', forecast: 'No rain this week — irrigation advisory issued' },
  Belur:          { temp: 26, humidity: 71, rainfall14d: 28, soilMoisture: 'Moist', forecast: 'Light showers mid-week' },
  Channarayapatna:{ temp: 33, humidity: 48, rainfall14d: 2,  soilMoisture: 'Very Dry', forecast: 'Heatwave advisory — temperatures 3°C above normal' },
  Holenarasipur:  { temp: 30, humidity: 60, rainfall14d: 9,  soilMoisture: 'Low', forecast: 'Partly cloudy with low chance of rain' },
  Arakalagudu:    { temp: 28, humidity: 73, rainfall14d: 22, soilMoisture: 'Moderate', forecast: 'Evening showers possible' },
};

const DEFAULT_WEATHER = { temp: 29, humidity: 65, rainfall14d: 18, soilMoisture: 'Moderate', forecast: 'Normal conditions' };

/**
 * Returns weather data for a taluk.
 * @param {string} taluk - Name of the taluk
 * @returns {object} Weather object
 */
export function getMockWeather(taluk = 'Hassan') {
  const base = TALUK_WEATHER[taluk] || DEFAULT_WEATHER;
  // Add a tiny bit of variation so it feels "live" on refresh (±2 units)
  const jitter = (n) => n + Math.round((Math.random() - 0.5) * 4);
  return {
    taluk,
    temp: `${jitter(base.temp)}°C`,
    humidity: `${jitter(base.humidity)}%`,
    rainfall14d: `${jitter(base.rainfall14d)}mm`,
    soilMoisture: base.soilMoisture,
    forecast: base.forecast,
    // Score impact: extreme rainfall, heatwave, or very dry all increase distress
    scoreImpact: base.rainfall14d > 60 || base.rainfall14d < 5 || base.temp > 32 ? '+8 pts (Weather Risk)' : null,
    alert: base.rainfall14d > 60 ? '⚠️ Flood risk' : base.temp > 32 ? '⚠️ Heatwave advisory' : base.rainfall14d < 5 ? '⚠️ Drought risk' : null,
  };
}
