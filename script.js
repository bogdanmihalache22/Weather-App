document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    const apiKey = '6e4910e1b553fdf4586faeda39529899'; 
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cityName').textContent = data.name;
            document.getElementById('temperatureValue').textContent = data.main.temp.toFixed(2);
            document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
            document.querySelector('.weather').style.opacity = 1; 

            const temperature = data.main.temp;

            if (temperature > 10) {
                document.body.style.backgroundImage = 'url("sun.jpg")'; 
            } else if (temperature <= 0) {
                document.body.style.backgroundImage = 'url("snow.jpg")';
            } else {
                document.body.style.backgroundImage = 'none';
            }
        })
        .catch(error => console.log('Error:', error));

    // Fetch five-day forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastItems = data.list;

            const forecastContainer = document.querySelector('.forecast-items');
            forecastContainer.innerHTML = '';

            const uniqueDates = new Set();

            forecastItems.forEach(item => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('en', { weekday: 'short' });

                if (!uniqueDates.has(day) && uniqueDates.size < 5) {
                    uniqueDates.add(day);

                    const temperature = item.main.temp.toFixed(2);
                    const description = item.weather[0].description;

                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');
                    forecastItem.innerHTML = `
                        <p>${day}</p>
                        <p>${temperature}°C</p>
                        <p>${description}</p>
                    `;

                    forecastContainer.appendChild(forecastItem);
                }
            });

            document.querySelector('.forecast').style.opacity = 1; 
        })
        .catch(error => console.log('Error:', error));
});
