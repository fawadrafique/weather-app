let lat, lon, apiCall, country;
const toggle = document.querySelector('#openclose')
const updateTemp = document.querySelector('#temperature')
const summary = document.querySelector('#summary')
const icon = document.querySelector('#icon')
const updatePlace = document.querySelector('#city')
const updateDay = document.querySelector('#day')
const minmaxT = document.querySelector('#minmaxT')
const searchAtrribute = document.querySelector('[placesearch]')
const windSpeed = document.querySelector('#windSpeed')
const humidity = document.querySelector('#humidityPercent')
const rain = document.querySelector('#rainPercent')
const feelT = document.querySelector('#feelslike')

window.onload = () => {
    init(50.85, 4.35, 'Brussels', 'BE');
}


const searchPlaces = new google.maps.places.SearchBox(searchAtrribute)
searchPlaces.addListener('places_changed', () => {
    const place = searchPlaces.getPlaces()[0]
    let city = place.vicinity
    place.address_components.forEach((component) => {
        if (component.types[0] == "country") {
            country = component.short_name;
        }
    });
    if (place == null) return
    let latitude = place.geometry.location.lat()
    let longitude = place.geometry.location.lng()
    display(place)
    init(latitude, longitude, city, country);
    getDay();
})

function init(lat, lon, city, country) {
    // let city = name;
    const apiKey = `94bc76131465087810a5fcee2f66defe`;
    apiCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`
    //display(apiCall)
    fetch(apiCall)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            display(data);
            updateTemp.textContent = Math.round(data.current.temp);
            updatePlace.textContent = `${city}, ${country}`;
            minmaxT.innerHTML = `L <strong class="text-lg">${Math.round(data.daily[0].temp.min)}º</strong> - H <strong class="text-lg">${Math.round(data.daily[0].temp.max)}º</strong>`
            updateDay.textContent = getDay(data.current.dt);
            summary.textContent = data.current.weather[0].main;
            windSpeed.textContent = `${Math.round(data.current.wind_speed*3.5997)} km/h`
            humidity.textContent = `${data.current.humidity} %`
            rain.textContent = `${data.daily[0].pop * 100} %`
            feelT.textContent = `${Math.round(data.current.feels_like)}º`
            icon.innerHTML = getIcon(data);
            updateForecast(data);
            updateBackground(city);
        })
}

function updateBackground(city) {
    //const apiKey = `jRPGWBPEGuRHvLEve0t7QHqzx0a7NsWSv_FY-atuTWs`
    const apiKey = `fcd34269b5505a2c7ddc58b68e7ddb8b`
    const apiCall = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${city}&format=json&nojsoncallback=1`
    //const apiCall = `https://api.unsplash.com/search/photos?page=1&query=${city} landscape&order_by=popular&orientation=landscape&client_id=${apiKey}`
    display(apiCall)

    fetch(apiCall)
        .then((response) => {
            display(response)
            return response.json()
        })
        .then((data) => {
            let path = data.photos.photo[0]
            let image = `http://farm${path.farm}.staticflickr.com/${path.server}/${path.id}_${path.secret}.jpg`
            //document.body.style.backgroundSize = "cover";
            //document.body.style.backgroundImage = `url('${data.results[0].urls.regular}')`;

            display(image)
        })

}

function updateForecast(data) {
    let style, d, day, iconID, weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 1; i < 7; i++) {
        d = new Date(data.daily[i].dt * 1000);
        day = weekdays[d.getDay()];
        iconID = data.daily[i].weather[0].id;
        minT = Math.round(data.daily[i].temp.min);
        maxT = Math.round(data.daily[i].temp.max);
        style = `<span class="font-normal block">${day}</span>
    <span class="flex justify-center text-3xl">
      <i class="wi wi-owm-${iconID}"></i>
    </span>
    <span class="block">
      <span class="text-xs">L </span><span class="text-sm">${minT}º - </span><span class="text-xs">H</span>
      <span class="text-sm">${maxT}º</span>
    </span>`
        document.querySelector(`#day${i}`).innerHTML = style;
    }


}

function getIcon(data) {
    let iconID;
    const date = new Date();
    const sunrise = new Date(data.current.sunrise * 1000);
    const sunset = new Date(data.current.sunset * 1000);
    if (date.getHours() >= sunrise.getHours() && date.getHours() < sunset.getHours()) {
        iconID = `wi wi-owm-day-${data.current.weather[0].id}`;
    } else {
        iconID = `wi wi-owm-night-${data.current.weather[0].id}`;
    }
    return `<i class="${iconID}"></i>`
}

function getDay(ms) {
    let today = new Date(ms * 1000);
    let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    return today.toLocaleString(
        "en-GB",
        options
    );
}

function display(message) {
    console.log(message);
}