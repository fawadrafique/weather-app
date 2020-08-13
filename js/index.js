let lat, lon, apiCall, country;
const toggle = document.querySelector('#openclose')
const updateTemp = document.querySelector('#temperature')
const summary = document.querySelector('#summary')
const updatePlace = document.querySelector('#city')
const updateDay = document.querySelector('#day')
const minmaxT = document.querySelector('#minmaxT')
const searchAtrribute = document.querySelector('[placesearch]')


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
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    apiCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`
    display(apiCall)
    fetch(apiCall)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            display(data);
            updateTemp.textContent = Math.round(data.current.temp);
            updatePlace.textContent = `${city}, ${country}`;
        })
}

function getDay() {
    let today = new Date();
    let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    updateDay.textContent = today.toLocaleString(
        "en-GB",
        options
    );
}



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError)
    } else {
        alert('Geolocation not supported by the browser')
    }
}

function getPosition(position) {
    lat = position.coords.latitude;
    display(lat);
    lon = position.coords.longitude;
    display(lon);

}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}

function display(message) {
    console.log(message);
}