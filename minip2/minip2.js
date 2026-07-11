

//  function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
//     document.body.appendChild(newPara);
//  }


//  async function fetchWeatherDetails(){
//     try{
//      let city= "goa";

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
//     const data = await response.json();

//     console.log("Weather data: ->data" , data);
  
//     renderWeatherInfo(data);
//     }
//     catch(err){
//        console.log("Invalid Input");
//     }   
//  }
//  async function getCustomWeatherDetails(){
//     try{
//        let latitude = 15.6333
//        let longitude = 18.3333
//        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`) 
//        let data = await result.json();
//        console.log(data);
//     }
//     catch(err){
//         console.log("Error Found",err)
//     }
//  }

// function switchTab(clickedTab){

//      apiErrorContainer.classList.remove("active");

//     if(clickedTab != currentTab){
//         currentTab.classList.remove("current-tab");
//         currentTab = clickedTab;
//         currentTab.classList.add("current-tab");
    
//     if(!searchForm.classList.contains("active")){
//         userInfoContainer.classList.remove("active");
//         grantAccessContainer.classList.remove("active");
//         searchForm.classList.add("active");
//     }
//     else{
//         searchForm.classList.remove("active");
//         userInfoContainer.classList.remove("active");
//         getFromSessionStorage();
//     }
// }
// }

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geoLocation Support")
//     }
// }

// function showPosition(position){
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;
//     console.log(lat);
//     console.log(longi);

// }

// //////


const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;

const apiKey = "611cca1ad7e9ce35853f0266c2f0e9d4";

currentTab.classList.add("current-tab");

getFromSessionStorage();

function switchTab(clickedTab) {

    if(clickedTab != currentTab) {

        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else {

            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getFromSessionStorage() {

    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates) {

        grantAccessContainer.classList.add("active");
    }

    else {

        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherByCoords(coordinates);
    }
}

async function fetchUserWeatherByCoords(coordinates) {

    const {lat, lon} = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }

    catch(err) {

        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo) {

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;

    countryIcon.src =
        `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;

    temp.innerText = `${weatherInfo?.main?.temp} °C`;

    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;

    humidity.innerText = `${weatherInfo?.main?.humidity}%`;

    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function geoLocation() {

    if(navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {

    const userCoordinates = {

        lat: position.coords.latitude,
        lon: position.coords.longitude
    };

    sessionStorage.setItem(
        "user-coordinates",
        JSON.stringify(userCoordinates)
    );

    fetchUserWeatherByCoords(userCoordinates);
}

const grantAccessButton =
    document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", geoLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {

    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === "")
        return;

    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");

    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }

    catch(err) {

        loadingScreen.classList.remove("active");
    }
}