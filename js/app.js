const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-text"),
    inputField = inputPart.querySelector("input"),
    localtionBtn = inputPart.querySelector("button"),
    wIcons = document.querySelector(".weather-part img"),
    arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

localtionBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator
            .geolocation
            .getCurrentPosition(onSuccess, onerror);
    } else {
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position) {
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onerror(error) {
    infoTxt.innerHTML = error.message;
    infoTxt
        .classList
        .add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData() {
    infoTxt.innerHTML = "Getting weather deteils...";
    infoTxt
        .classList
        .add("pending");
    fetch(api).then((response) => response.json()).then((result) => weatherDeteils(result));
}

function weatherDeteils(info) {
    infoTxt
        .classList
        .replace("pending", "error");
    if (info.cod == "404") {
        infoTxt.innerText = `${inputField.value} is not a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if (id == 800) {
            wIcons.src = "./icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcons.src = "./icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcons.src = "./icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcons.src = "./icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcons.src = "./icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcons.src = "./icons/rain.svg";
        }

        wrapper
            .querySelector(".temp .numb")
            .innerText = Math.floor(temp);
        wrapper
            .querySelector(".weather")
            .innerText = description;
        wrapper
            .querySelector(".location span")
            .innerText = `${city}, ${country}`;
        wrapper
            .querySelector(".temp .numb-2")
            .innerText = Math.floor(feels_like);
        wrapper
            .querySelector(".humidity span")
            .innerText = `${humidity}%`;

        infoTxt
            .classList
            .remove("pending", "error");
        wrapper
            .classList
            .add("active");
    }
}

arrowBack.addEventListener("click", () => {
    wrapper
        .classList
        .remove("active");
});
