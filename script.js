console.log('weather app');

const apiKey = '78d27b9c42d24cab4711a11603dd0d0f';
const tempElement = document.getElementById('temp');
const sunriseElement = document.getElementById('sunrise');
const sunsetElement = document.getElementById('sunset');
const cityElement = document.getElementById('city');
const todayWeatherIconContainer = document.querySelector('.today-weather-icon');
const forecastContainer = document.getElementById('forecast-list');

// Function to fetch weather data
const getWeatherData = (city) => {
  const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;

  return fetch(urlWeather).then((response) => response.json());
};

// Function to fetch forecast data
const getForecastData = (city) => {
  const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`;

  return fetch(urlForecast).then((response) => response.json());
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to update the UI with weather data ---------------------------------
const updateWeatherUI = (data) => {
  tempElement.textContent = `${capitalizeFirstLetter(
    data.weather[0].description
  )} | ${data.main.temp.toFixed(1)}°C`;

  // Format and set sunrise time
  const sunriseTime = new Date(data.sys.sunrise * 1000);
  sunriseElement.textContent = `Sunrise: ${formatTime(sunriseTime)}`;

  // Format and set sunset time
  const sunsetTime = new Date(data.sys.sunset * 1000);
  sunsetElement.textContent = `Sunset: ${formatTime(sunsetTime)}`;

  cityElement.textContent = `City: ${data.name}`;

  // Check if the weather data contains the necessary information to show icon
  if (data.weather && data.weather[0] && data.weather[0].icon) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    // Create an image element and set the source
    const iconImage = document.createElement('img');
    iconImage.src = iconUrl;

    // Append the image to the todayWeatherIconContainer
    todayWeatherIconContainer.innerHTML = ''; // Clear previous icon
    todayWeatherIconContainer.appendChild(iconImage);
  } else {
    // Handle the case when the necessary information is not available
    todayWeatherIconContainer.innerHTML = 'Icon not available';
  }
};

// Function to update the UI with forecast data --------------------------------
const updateForecastUI = (data) => {
  console.log('Forecast data:', data); // Log the data for inspection
  const forecastList = data.list;
  forecastContainer.innerHTML = ''; // Clear previous forecast data

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Display forecast for the next 7 days
  for (let i = 0; i < 7; i++) {
    const dayForecast = forecastList.find((item) => new Date(item.dt * 1000).getDay() === i);

    if (dayForecast) {
      const date = new Date(dayForecast.dt * 1000);
      const weekday = daysOfWeek[i]; // Adjust index to start from Sunday
      const temperature = dayForecast.main.temp.toFixed(1);

      const listItem = document.createElement('li');
      listItem.innerHTML = `<span>${weekday}</span><span class="weather-condition"><img class="weather-icon" src="https://openweathermap.org/img/wn/${dayForecast.weather[0].icon}@2x.png"></span> <span>${temperature}°C</span>`;
      forecastContainer.appendChild(listItem);
    }
  }
};
// Function to fetch and update data
const fetchAndUpdateData = (city) => {
  // Fetch and update UI with weather data
  getWeatherData(city)
    .then(updateWeatherUI)
    .catch((error) => {
      console.error('Error fetching current weather:', error);
    });

  // Fetch and update UI with forecast data
  getForecastData(city)
    .then(updateForecastUI)
    .catch((error) => {
      console.error('Error fetching forecast:', error);
    });
};

// Fetch and update data for Stockholm by default
fetchAndUpdateData('Stockholm');

// Event listener for the submit button
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () => {
  const cityInput = document.getElementById('city-input');
  const cityName = cityInput.value.trim();

  if (cityName) {
    // Fetch and update data for the entered city
    fetchAndUpdateData(cityName);
  } else {
    console.error('City name is empty');
  }
});
