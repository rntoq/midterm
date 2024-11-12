const apiKey = '1b20f86f8281c2079ce9b6443a4abac8';
const apiUrl = 'https://api.openweathermap.org/data/2.5';
let currentUnit = 'metric'; // Default unit set to Celsius

// Function to fetch weather by city name
async function fetchWeather(city) {
  try {
    // Fetch current weather
    const currentWeatherResponse = await fetch(`${apiUrl}/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`);
    const currentWeatherData = await currentWeatherResponse.json();
    displayCurrentWeather(currentWeatherData);

    // Fetch 5-day forecast
    const forecastResponse = await fetch(`${apiUrl}/forecast?q=${city}&units=${currentUnit}&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();
    displayForecast(forecastData);
  } catch (error) {
    console.error(error);
    alert('Could not fetch weather data. Please try again later.');
  }
}

// Toggle between Celsius and Fahrenheit and refresh data
function toggleUnit(unit) {
  currentUnit = unit;

  // Refresh data with updated units
  const query = document.getElementById('searchInput').value;
  if (query) {
    fetchWeather(query); // Fetch weather with the new unit
  }
}

// Display current weather
// Display current weather
function displayCurrentWeather(data) {
  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'; // Set unit symbol based on current unit

  const currentWeatherContainer = document.getElementById('currentWeather');
  currentWeatherContainer.innerHTML = `
    <div class="weather_card">
      <h2>${data.name}</h2>
      <p>Temperature: ${data.main.temp}${unitSymbol}</p> <!-- Updated to dynamically show unit symbol -->
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</p>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
      <p>${data.weather[0].description}</p>
    </div>
  `;
}

// Display 5-day forecast
// Display 5-day forecast
function displayForecast(data) {
  const unitSymbol = currentUnit === 'metric' ? '°C' : '°F'; // Set unit symbol for forecast

  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '<h3>5-Day Forecast</h3>';

  // Group forecasts by day
  const days = {};
  data.list.forEach(entry => {
    const date = entry.dt_txt.split(' ')[0];
    if (!days[date]) days[date] = [];
    days[date].push(entry);
  });

  // Convert days object to array of daily weather and slice to 5 days
  const dailyEntries = Object.entries(days).slice(0, 5);

  dailyEntries.forEach(([date, entries]) => {
    const dailyWeather = entries[0]; // Pick the first entry for each day as representative

    forecastContainer.innerHTML += `
      <div class="weather_card">
        <h4>${new Date(date).toLocaleDateString()}</h4>
        <img src="https://openweathermap.org/img/wn/${dailyWeather.weather[0].icon}@2x.png" alt="${dailyWeather.weather[0].description}">
        <p>High: ${Math.max(...entries.map(e => e.main.temp_max))}${unitSymbol}</p>
        <p>Low: ${Math.min(...entries.map(e => e.main.temp_min))}${unitSymbol}</p>
      </div>
    `;
  });
}



// Auto-suggest functionality for city names
async function autoSuggest() {
  const query = document.getElementById('searchInput').value;
  if (query.length > 2) {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
    const suggestions = await response.json();
    displaySuggestions(suggestions);
  }
}

function displaySuggestions(suggestions) {
  const suggestionsList = document.getElementById('suggestions');
  suggestionsList.innerHTML = '';
  suggestions.forEach(city => {
    const li = document.createElement('li');
    li.textContent = `${city.name}, ${city.country}`;
    li.onclick = () => {
      fetchWeather(city.name);
      document.getElementById('suggestions').innerHTML = '';
    };
    suggestionsList.appendChild(li);
  });
}

// Get weather by user's current location
document.getElementById('locationBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`${apiUrl}/weather?lat=${latitude}&lon=${longitude}&units=${currentUnit}&appid=${apiKey}`);
        const data = await response.json();
        displayCurrentWeather(data);
      } catch (error) {
        console.error(error);
        alert('Could not fetch weather for your location.');
      }
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

// Add event listener for search
document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  if (query) {
    fetchWeather(query);
  }
});

// Add event listener for auto-suggest as the user types
document.getElementById('searchInput').addEventListener('input', autoSuggest);
