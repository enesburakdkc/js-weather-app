// Import variables from other files
import { apiKey, timeFrames24Hours, timeFrames5Days, currentContainer, todayContainer, upcomingContainer, cookieBanner, locationInformationContainer, loadingScreen } from './data.js';
import { requestAPI, initializeCookieBanner, getUserLocation, displayCurrentWeather, displayTodayWeather, displayUpcomingWeather } from './functions.js';

document.addEventListener('DOMContentLoaded', initializeCookieBanner);

// Check the user's cookie preference
const cookiePreference = localStorage.getItem('cookie-preference');
if (cookiePreference == 'accepted') {
    
    const userLocation = await getUserLocation();
    
    // Fetch data from the API
    const data = await requestAPI(userLocation[0], userLocation[1]);
    // Define city and country
    const location = {
        country: data.city.country,
        city: data.city.name,
    };
    const weatherData = {};
    // Fetch and save weather data for every 3 hours
    timeFrames24Hours.forEach((frame, index) => {
        // Add weather data for each time frame to the weatherData object
        weatherData[frame] = {
            date: {
                date: data.list[index].dt_txt,
            },
            main: {
                temp: data.list[index].main.temp,
                feelsLike: data.list[index].main.feels_like,
                humidity: data.list[index].main.humidity,
                tempMax: data.list[index].main.temp_max,
                tempMin: data.list[index].main.temp_min,
            },
            weather: {
                main: data.list[index].weather[0].main,
                description: data.list[index].weather[0].description,
                icon: data.list[index].weather[0].icon,
            },
            wind: {
                speed: data.list[index].wind.speed,
                degree: data.list[index].wind.deg,
            },
        };
    });
    // Get the current hour from the API's response
    const now = data.list[0].dt_txt.split(' ')[1].split(':')[0];
    // Calculate the extraIndex to ensure data starts at 12:00 for the following days
    console.log(now);
    let extraIndex = (12 - now) / 3 + 8;
    // Fetch and save weather data for the next 5 days
    timeFrames5Days.forEach((frame, index) => {
        // Calculate the correct index to retrieve data at 12:00
        const dayIndex = index * 8 + extraIndex;
        // Add weather data for each day to the weatherData object
        weatherData[frame] = {
            date: {
                date: data.list[dayIndex].dt_txt,
            },
            main: {
                temp: data.list[dayIndex].main.temp,
                feelsLike: data.list[dayIndex].main.feels_like,
                humidity: data.list[dayIndex].main.humidity,
                tempMax: data.list[dayIndex].main.temp_max,
                tempMin: data.list[dayIndex].main.temp_min,
            },
            weather: {
                main: data.list[dayIndex].weather[0].main,
                description: data.list[dayIndex].weather[0].description,
                icon: data.list[dayIndex].weather[0].icon,
            },
            wind: {
                speed: data.list[dayIndex].wind.speed,
                degree: data.list[index * 8].wind.deg,
            },
        };
    });
    
    // Display the weather data in the console
    console.log(`City: ${location.city}, Country: ${location.country}`);
    console.log(`Current Temperature: ${weatherData["now"].main.temp}°C`);
    console.log(`Temperature in 3 hours: ${weatherData["3hLater"].main.temp}°C`);
    console.log(`Temperature in 6 hours: ${weatherData["6hLater"].main.temp}°C`);
    console.log(`Temperature in 9 hours: ${weatherData["9hLater"].main.temp}°C`);
    console.log(`Temperature in 12 hours: ${weatherData["12hLater"].main.temp}°C`);
    console.log(`Temperature in 15 hours: ${weatherData["15hLater"].main.temp}°C`);
    console.log(`Temperature in 18 hours: ${weatherData["18hLater"].main.temp}°C`);
    console.log(`Temperature in 21 hours: ${weatherData["21hLater"].main.temp}°C`);
    console.log(`Temperature in 24 hours: ${weatherData["24hLater"].main.temp}°C`);
    console.log(`Date in 1 day: ${weatherData["1dLater"].date.date}`);
    console.log(`Date in 2 days: ${weatherData["2dLater"].date.date}`);
    console.log(`Date in 3 days: ${weatherData["3dLater"].date.date}`);
    console.log(`Date in 4 days: ${weatherData["4dLater"].date.date}`);
    
    displayCurrentWeather(weatherData, location);
    displayTodayWeather(weatherData);
    displayUpcomingWeather(weatherData);
    loadingScreen.style.display = 'none'
}
else { console.error('User did not accept cookies')};