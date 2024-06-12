const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const cloudOutput = document.querySelector(".cloud");
const icon = document.querySelector(".icon");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationinput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

let cityInput = "London";

cities.forEach((city) => {
    city.addEventListener("click", (e) => {
        cityInput = e.target.innerHTML;
        app.style.opacity = '0';
        fetchWeatherData(cityInput);
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (search.value.length === 0) {
        alert("Please enter a city");
    } else {
        cityInput = search.value;
        app.style.opacity = '0';
        fetchWeatherData(cityInput);
        search.value = "";
    }
});

function dayOfWeek(day, month, year) {
    if (isNaN(day) || isNaN(month) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error('Invalid date input');
    }
    month--;
    const date = new Date(year, month, day);
    const dayIndex = date.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[dayIndex];
}

async function fetchWeatherData(cityName) {
    const apiKey = '2368b1817263447db8972529241206'; // Consider securing this
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        temp.innerHTML = `${data.current.temp_c}&#176;C`;
        conditionOutput.innerHTML = data.current.condition.text;

        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        dateOutput.innerHTML = `${dayOfWeek(d, m, y)} ${d}, ${m}, ${y}`;
        timeOutput.innerHTML = time;
        nameOutput.innerHTML = data.location.name;
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64".length);
        icon.src = `https://cdn.weatherapi.com/weather/64x64/${iconId}.png`;

        cloudOutput.innerHTML = `${data.current.cloud}%`;
        humidityOutput.innerHTML = `${data.current.humidity}%`;
        windOutput.innerHTML = `${data.current.wind_kph} km/h`;

        let timeOfDay = data.current.is_day ? 'day' : 'night';
        let weatherConditionCode = data.current.condition.code;

        if (weatherConditionCode == 1000) {
            app.style.backgroundImage = `url(../images/${timeOfDay}/clear.jpg)`;
            btn.style.background = timeOfDay === "night" ? "#181e27" : "#e5ba92";
        } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(weatherConditionCode)) {
            app.style.backgroundImage = `url(../images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = timeOfDay === "night" ? "#181e27" : "#fa6d1b";
        } else if ([1063, 1072, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(weatherConditionCode)) {
            app.style.backgroundImage = `url(../images/${timeOfDay}/rainy.jpg)`;
            btn.style.background = timeOfDay === "night" ? "#325c80" : "#647d75";
        } else {
            app.style.backgroundImage = `url(../images/${timeOfDay}/snowy.jpg)`;
            btn.style.background = timeOfDay === "night" ? "#1b1b1b" : "#4d72aa";
        }

        app.style.opacity = '1';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load weather data.');
        app.style.opacity = '1';
    }
}

fetchWeatherData(cityInput);


