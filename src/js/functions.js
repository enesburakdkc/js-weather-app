// Import variables from other files
import { apiKey, timeFrames24Hours, timeFrames5Days, currentContainer, todayContainer, upcomingContainer, cookieBanner, locationInformationContainer, loadingScreen } from './data.js';
// Function to retrieve the user's current location
export async function getUserLocation() {
    return new Promise((resolve, reject) => {
        // Check if the browser supports Geolocation API
        if (navigator.geolocation) {
            // Request the user's current position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Extract latitude and longitude from the position object
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;

                    // Resolve the latitude and longitude
                    resolve([userLat, userLon]);
                },
                (error) => {
                    // Handle errors that occur when retrieving the position
                    reject(error);

                    const locationInformationContainerElement = locationInformationContainer[0];
                    locationInformationContainerElement.innerHTML = '';
                    const locationInformation = document.createElement('div');
                    locationInformation.classList.add('location-information');
                    locationInformation.innerHTML = `
                    <p>This website must access your device's location to run.</p>
                    <p>Allow access to your location to continue using the site.</p>
                    <button id="reload-page">Reload Page</button>
                    `;
                    locationInformationContainerElement.appendChild(locationInformation);
                    loadingScreen.style.display = 'none'
                    locationInformationContainerElement.style.display = 'flex';
                    document.getElementById('reload-page').addEventListener('click', () => { window.location.reload(); });
                }
            );
        } else {
            // Inform the user that their browser does not support Geolocation
            reject(new Error("Geolocation is not supported by this browser."));

            const locationInformationContainerElement = locationInformationContainer[0];
            locationInformationContainerElement.innerHTML = '';
            const locationInformation = document.createElement('div');
            locationInformation.classList.add('location-information');
            locationInformation.innerHTML = `
            <p>Geolocation is not supported by this browser.</p>
            `;
            locationInformationContainerElement.appendChild(locationInformation);
            loadingScreen.style.display = 'none'
            locationInformationContainerElement.style.display = 'flex';
        }
    });
}
// Function to send a request to the API and fetch data
export async function requestAPI(lat, lon) {
    try {
        // Make an API request
        const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric');
        // Check if the API response is not successful
        if (!response.ok) {
            console.error('API request is not true');
        }
        // Parse the response data as JSON
        const data = await response.json();
        // Watch the data
        console.log(data);
        // Return the parsed data
        return data;
    }
    catch(error) {
        // Log any errors that occur during the request
        console.error(error);
    }
}
// Function to display current weather data in index.html
export function displayCurrentWeather(weatherData, location) {
    // Get the container element where the current weather data will be displayed
    const currentContainerElement = currentContainer[0]; // Assuming currentContainer is a valid DOM element

    currentContainerElement.style.display = 'flex';
    // Clear any existing content
    currentContainerElement.innerHTML = '';
    // Populate the element with current weather data
    currentContainerElement.innerHTML = `
        <div class="current-location"><p>${location.city}</p><p>/${location.country}</p></div>
        <img class="current-weather-image" src="http://openweathermap.org/img/wn/${weatherData["now"].weather.icon}@4x.png" alt="${weatherData["now"].weather.description}">
        <p class="current-weather-main">${weatherData["now"].weather.main}</p>
        <p class="current-weather-description">${weatherData["now"].weather.description.charAt(0).toUpperCase() + weatherData["now"].weather.description.slice(1)}</p>
        <div class="current-weather-degree"><img class="icon" src="src/assets/images/temperature.png"><p>${weatherData["now"].main.temp}°C</p></div>
        <div class="current-weather-feels-like"><img class="icon" src="src/assets/images/feels-like.png"><p>${weatherData["now"].main.feelsLike}°C</p></div>
        <div class="current-weather-humidity"><img class="icon" src="src/assets/images/humidity.png"><p>${weatherData["now"].main.humidity}%</p></div>
        <div class="current-weather-wind"><img class="icon" src="src/assets/images/wind.png"><p>${weatherData["now"].wind.speed}m/s</p></div>
    `;
}
// Function to display today's weather data in index.html
export function displayTodayWeather(weatherData) {
    // Get the container element where the weather data will be displayed
    const todayContainerElement = todayContainer[0]; // Assuming you want to use the first element
    // Clear any existing content
    todayContainerElement.innerHTML = '';
    // Create and append elements for each time frame
    for (const frame of Object.keys(weatherData).slice(0, 9)) {
        // Create a new div for each time frame
        const weatherDiv = document.createElement('div');
        weatherDiv.classList.add('today');
        // Populate the div with weather data
        weatherDiv.innerHTML = `
            <p class="today-time">${weatherData[frame].date.date.split(' ')[1].slice(0, -3)}</p>
            <img class="today-weather-image" src="http://openweathermap.org/img/wn/${weatherData[frame].weather.icon}@4x.png" alt="${weatherData[frame].weather.description}">
            <div class="today-weather-degree"><img class="icon" src="src/assets/images/temperature.png"><p>${weatherData[frame].main.temp}°C</p></div>
            <div class="today-weather-feels-like"><img class="icon" src="src/assets/images/feels-like.png"><p>${weatherData[frame].main.feelsLike}°C</p></div>
            <div class="today-weather-humidity"><img class="icon" src="src/assets/images/humidity.png"><p>${weatherData[frame].main.humidity}%</p></div>
            <div class="today-weather-wind"><img class="icon" src="src/assets/images/wind.png"><p>${weatherData[frame].wind.speed}m/s</p></div>
        `;
        // Append the weather div to the container
        todayContainerElement.appendChild(weatherDiv);
    }
}
// Function to display upcoming weather data in index.html
export function displayUpcomingWeather(weatherData) {
    // Get the container element where the upcoming weather data will be displayed
    const upcomingContainerElement = upcomingContainer[0]; // Assuming you want to use the first element
    // Clear any existing content
    upcomingContainerElement.innerHTML = '';
    // Create and append elements for each time frame in the next 5 days
    for (const frame of Object.keys(weatherData).slice(9, 14)) { // Adjusted to get the next 5 days
        // Create a new div for each time frame
        const weatherDiv = document.createElement('div');
        weatherDiv.classList.add('upcoming');
        // Populate the div with weather data
        weatherDiv.innerHTML = `
            <p class="upcoming-day">${new Date(weatherData[frame].date.date.split(' ')[0]).toLocaleDateString('en-US', { weekday: 'long' })}</p>
            <div class="upcoming-lower-container">
                <div class="upcoming-weather-degree"><img class="icon" src="src/assets/images/temperature.png"><p>${weatherData[frame].main.temp}°C</p></div>
                <div class="upcoming-weather-humidity"><img class="icon" src="src/assets/images/humidity.png"><p>${weatherData[frame].main.humidity}%</p></div>
                <div class="upcoming-weather-wind"><img class="icon" src="src/assets/images/wind.png"><p>${weatherData[frame].wind.speed}m/s</p></div>
            </div>
            <img class="upcoming-weather-image" src="http://openweathermap.org/img/wn/${weatherData[frame].weather.icon}@4x.png" alt="${weatherData[frame].weather.description}">
        `;
        // Append the weather div to the container
        upcomingContainerElement.appendChild(weatherDiv);
    }
}

export function initializeCookieBanner() {

    const cookieBannerElement = cookieBanner[0];

    cookieBannerElement.innerHTML = '';

    const cookieContent = document.createElement('div');
    cookieContent.classList.add('cookie-content');
    cookieContent.innerHTML = `
    <p>This website accesses your device's location.</p>
    <p>By continuing to use the site, you agree to this.</p>
    <button id="accept-cookies">Okay</button>
    `;
    
    cookieBannerElement.appendChild(cookieContent);
    
    // Check the user's cookie preference
    const cookiePreference = localStorage.getItem('cookie-preference');
    if (!cookiePreference) {
        loadingScreen.style.display = 'none'
        cookieBannerElement.style.display = 'flex';
    }
  
    // Pressed the accept button
    function acceptCookies() {
        localStorage.setItem('cookie-preference', 'accepted');
        cookieBannerElement.style.display = 'none';
        window.location.reload();
    }
  
    // Add event listener
    document.getElementById('accept-cookies').addEventListener('click', acceptCookies);
  }