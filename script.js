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
            document.getElementById('humidityValue').textContent = data.main.humidity;
            document.getElementById('windValue').textContent = data.wind.speed;

            const temperature = data.main.temp;

            if (temperature > 10) {
                const unsplashApiKey = 'TO1CieiXi8xBwCctL7tR6_eZcTeDT5eOd-22uqsga6A';
                const query = encodeURIComponent(data.name); 
                const unsplashUrl = `https://api.unsplash.com/photos/random?query=${query}&client_id=${unsplashApiKey}`;

                fetch(unsplashUrl)
                    .then(response => response.json())
                    .then(imageData => {
                        const imageUrl = imageData.urls.regular; 
                        document.body.style.backgroundImage = `url(${imageUrl})`;
                    })
                    .catch(error => console.log('Error fetching location image:', error));
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

// Add an event listener to the toggle switch
document.getElementById('unitToggle').addEventListener('change', function() {
    // Get the temperature element
    const temperatureValue = document.getElementById('temperatureValue');
    
    // Get the current temperature and unit
    const temperature = parseFloat(temperatureValue.textContent);
    const currentUnit = temperatureValue.getAttribute('data-unit');
    
    // Define the units and the conversion factor
    const units = {
        'C': '°C',
        'F': '°F'
    };
    
    if (currentUnit === 'C') {
        // Convert to Fahrenheit
        const temperatureFahrenheit = (temperature * 9/5) + 32;
        temperatureValue.textContent = temperatureFahrenheit.toFixed(2);
        temperatureValue.setAttribute('data-unit', 'F');
    } else {
        // Convert to Celsius
        const temperatureCelsius = (temperature - 32) * 5/9;
        temperatureValue.textContent = temperatureCelsius.toFixed(2);
        temperatureValue.setAttribute('data-unit', 'C');
    }

    // Update the temperature unit label
    temperatureValue.innerHTML += units[temperatureValue.getAttribute('data-unit')];
});