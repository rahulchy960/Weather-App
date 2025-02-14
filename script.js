const city = document.querySelector('.city');
const search = document.querySelector('.search');
const apiKey = 'dd0690beb0928055f0d87db2d2aab570';

const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');

const cityName = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityTxt = document.querySelector('.humidity-value-txt');
const windSpeedTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDate = document.querySelector('.current-date');

const forecastItemsContainer = document.querySelector('.forecast-items-container');

search.addEventListener('click', ()=>{
    if(city.value.trim() != ''){
        updateWeatherInfo(city.value);
        console.log(city.value.trim());
        city.value = '';
    }
})

city.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter' && city.value.trim() != ''){
        updateWeatherInfo(city.value);
        console.log(city.value.trim());
        city.value = '';
    }
})

function getWeatherIcon(id){
    // console.log(id);
    if(id==800) return 'clear';
    if(id>800) return 'clouds';
    if(id>700) return 'atmosphere';
    if(id>600) return 'snow';
    if(id>500) return 'rain';
    if(id>300) return 'drizzle';
    if(id>200) return 'thunderstorm';
}

function getCurrentDate(){
    const date = new Date();
    const option = {
        weekday:'short',
        day:'2-digit',
        month:'short',
        timeZone: 'Asia/Kolkata'
    }
    return date.toLocaleDateString('en-GB',option);
}

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    try{
        const response = await fetch(apiUrl);
        if(!response.ok){
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return await response.json();
    }
    catch(error){
        console.error('Error fetching data ',error);
        return null;
    }
}

async function updateForecastInfo(city){
    const forecastData = await getFetchData('forecast', city);
    const timeTaken = '12:00:00';
    const todayDate = new Date().toISOString().split('T')[0];
    forecastItemsContainer.innerHTML = '';
    forecastData.list.forEach((forecastWeather)=>{
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            // console.log(forecastWeather);
            updateForecastItems(forecastWeather)
        }
        
    })
    console.log(todayDate);
}

function updateForecastItems(weatherItemData){
    console.log(weatherItemData);
    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp}
    } = weatherItemData;

    const dateTaken = new Date(date);
    const option = {
        day:'2-digit',
        month:'short',
        timeZone: 'Asia/Kolkata'
    }
    dateResult = dateTaken.toLocaleDateString('en-GB',option);
    const nextForecastItems = `
                    <div class="forecast-items">
                        <h5 class="forecast-item-data regular-txt">${dateResult}</h5>
                        <img src="weather/${getWeatherIcon(id)}.svg" class="forecast-item-img">
                        <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
                    </div>
                    ` ;
    forecastItemsContainer.insertAdjacentHTML('beforeend', nextForecastItems)
}

function updateWeatherInfo(city){
    getFetchData('weather',city)
    .then((weatherData)=>{
        if(weatherData){
            const {
                name:city,
                main:{temp, humidity},
                weather:[{id, main}],
                wind:{speed},
            } = weatherData;

            cityName.textContent = city;
            tempTxt.textContent = Math.round(temp) + ' °C';
            conditionTxt.textContent = main;
            humidityTxt.textContent = humidity + ' %';
            windSpeedTxt.textContent = speed + ' M/s';
            weatherSummaryImg.src = `weather/${getWeatherIcon(id)}.svg`;
            currentDate.textContent = getCurrentDate();

            updateForecastInfo(city)
            showDisplaySection(weatherInfoSection);
            
            // console.log(weatherData);
        }
        else{
            showDisplaySection(notFoundSection);
        }
    })
    .catch((error)=>{
        // showDisplaySection(notFoundSection);
        console.log("Error Finding Weather Info: ",error);
    })
}

function showDisplaySection(notFound){
    [weatherInfoSection, searchCitySection, notFoundSection].forEach((sec)=>{
        sec.style.display = 'none';
    }) 
    notFound.style.display = 'flex';
}