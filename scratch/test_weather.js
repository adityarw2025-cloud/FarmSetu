const https = require('https');
const API_KEY = 'ab8d8771c004842ef014304160e8b2c0';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  try {
    const weather = await get(`https://api.openweathermap.org/data/2.5/weather?q=Nashik&units=metric&appid=${API_KEY}`);
    console.log('Current Weather:', weather.name, weather.main, weather.weather);
    const forecast = await get(`https://api.openweathermap.org/data/2.5/forecast?q=Nashik&units=metric&appid=${API_KEY}`);
    console.log('Forecast count:', forecast.list?.length);
    if (forecast.list && forecast.list.length > 0) {
      console.log('Sample forecast item:', forecast.list[0]);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
main();
