let lat, lon, apiCall, country;
const toggle = document.querySelector('#openclose')
const updateTemp = document.querySelector('#temperature')
const summary = document.querySelector('#summary')
const icon = document.querySelector('#icon')
const updatePlace = document.querySelector('#city')
const updateDay = document.querySelector('#day')
const minmaxT = document.querySelector('#minmaxT')
const searchAtrribute = document.querySelector('[placesearch]')

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
            let iconID = data.current.weather[0].icon;
            let iconURL = `http://openweathermap.org/img/w/${iconID}.png`
            updateTemp.textContent = Math.round(data.current.temp);
            updatePlace.textContent = `${city}, ${country}`;
            minmaxT.innerHTML = `L <strong class="text-lg">${Math.round(data.daily[0].temp.min)}º</strong> / H <strong class="text-lg">${Math.round(data.daily[0].temp.max)}º</strong>`
            updateDay.textContent = getDay(data.current.dt);
            summary.textContent = data.current.weather[0].main;
            icon.innerHTML = getIcon(data);
        })
}

function getIcon(data) {
    let weatherIconID;
    const date = new Date();
    const sunrise = new Date(data.current.sunrise * 1000);
    const sunset = new Date(data.current.sunset * 1000);

    /* Get suitable icon for weather */
    if (date.getHours() >= sunrise.getHours() && date.getHours() < sunset.getHours()) {
        weatherIconID = `wi wi-owm-day-${data.current.weather[0].id}`;
    } else {
        weatherIconID = `wi wi-owm-night-${data.current.weather[0].id}`;
    }
    return `<i class="${weatherIconID}"></i>`
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