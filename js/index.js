let lat, lon, apiCall, country;
const submit = document.querySelector('#submit')
const getPlace = document.querySelector('#place')
const updateTemp = document.querySelector('#currentTemperature')
const updateSummary = document.querySelector('#currentSummary')
const updatePlace = document.querySelector('#currentCity')
const updateDay = document.querySelector('#currentDay')

const searchAtrribute = document.querySelector('[citysearch]')
const searchBox = new google.maps.places.SearchBox(searchAtrribute)
searchBox.addListener('places_changed', () => {
    const place = searchBox.getPlaces()[0]
    let city = place.vicinity
    place.address_components.forEach((component) => {
        if (component.types[0] == "country") {
            country = component.short_name;
        }
    });
    if (place == null) return
    let latitude = place.geometry.location.lat()
    let longitude = place.geometry.location.lng()
    init(latitude, longitude, city, country);
    display(latitude)
})


submit.addEventListener('click', (e) => {
    e.preventDefault();
    city = getPlace.value;
    display(city);
    init(city);
});

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