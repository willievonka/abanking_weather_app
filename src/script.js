const WEATHER_API_KEY = 'b8102f5fa19b4d04825190213242911';

async function getWeather() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    if (!latitude || !longitude) {
        alert('Пожалуйста, введите широту и долготу');
        return;
    }

    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}&lang=ru`);
        if (!response.ok) {
            throw new Error('Местоположение не найдено');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        alert(error.message);
    }
}

function displayWeather(data) {
    const weatherContainer = document.getElementById('weather-container');
    const widget = createWeatherWidget(data, weatherContainer);
    weatherContainer.appendChild(widget);
}

function createWeatherWidget(data, weatherContainer) {
    const widget = document.createElement('div');
    widget.className = 'weather-widget';

    const weatherImage = getWeatherImage(data);
    widget.appendChild(weatherImage);

    const widgetDescription = getWidgetDescription(data);
    widget.appendChild(widgetDescription);

    const mapContainer = getMapContainer(data);
    widget.appendChild(mapContainer);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Скрыть';
    deleteButton.onclick = () => {
        weatherContainer.removeChild(widget);
    };
    widget.appendChild(deleteButton);

    return widget;
}

function getWeatherImage(data) {
    const weatherImage = document.createElement('img');
    weatherImage.src = `https:${data.current.condition.icon.replace('64x64', '128x128')}`;
    return weatherImage;
}

function getWidgetDescription(data) {
    const widgetDescription = document.createElement('div');
    widgetDescription.className = 'widget-description';

    const location = document.createElement('h2');
    location.textContent = data.location.name;
    widgetDescription.appendChild(location);

    const temperature = document.createElement('p');
    temperature.textContent = `Температура: ${data.current.temp_c}°C`;
    widgetDescription.appendChild(temperature);

    const description = document.createElement('p');
    description.textContent = `Описание: ${data.current.condition.text}`;
    widgetDescription.appendChild(description);

    const wind = document.createElement('p');
    wind.textContent = `Скорость ветра: ${(data.current.wind_kph * 1000 / 3600).toFixed(1)} м/с`;
    widgetDescription.appendChild(wind);

    const humidity = document.createElement('p');
    humidity.textContent = `Влажность: ${data.current.humidity}%`;
    widgetDescription.appendChild(humidity);

    return widgetDescription;
}

function getMapContainer(data) {
    const mapContainer = document.createElement('div');
    mapContainer.style.width = '400px';
    mapContainer.style.height = '200px';

    const mapIframe = document.createElement('iframe');
    mapIframe.style.width = '100%';
    mapIframe.style.height = '100%';
    mapIframe.style.border = 'none';
    mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${data.location.lon-0.01},${data.location.lat-0.01},${data.location.lon+0.01},${data.location.lat+0.01}&layer=mapnik&marker=${data.location.lat},${data.location.lon}`;
    mapContainer.appendChild(mapIframe);

    return mapContainer;
}