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
  const weather = await get(`https://api.openweathermap.org/data/2.5/weather?q=Nashik&units=metric&appid=${API_KEY}`);
  console.log('Raw weather response:', weather);
}
main();
