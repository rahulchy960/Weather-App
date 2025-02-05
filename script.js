const city = document.querySelector('.city');
const search = document.querySelector('.search');
const apiKey = 'dd0690beb0928055f0d87db2d2aab570';

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

function getFetchData(){

}

function updateWeatherInfo(city){
    const weatherData = getFetchData();
}