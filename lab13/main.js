let cityData = [
    { name: "你的位置", lat: "", lon: "" },
    { name: "台北", lat: 25.0856513, lon: 121.421409 },
    { name: "台中", lat: 24.1852333, lon: 120.4946381 },
    { name: "高雄", lat: 22.7000444, lon: 120.0508691 },
];
let lock = true;

$(function () {
    getLocation();
    for (let x = 0; x < cityData.length; x++) {
        $("#citySelect").append(`<option value='${x}'>${cityData[x].name}</option>`);
    }
    $("#citySelect").on("change", loadServerData);
});

function loadServerData() {
    $("#result").empty();
    let weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?";
    let weatherMapAPIKey = "27a4eeb1cfec89326a4ca86cf973658a";
    $.getJSON(weatherAPI_URL, {
        lat: cityData[this.value].lat,
        lon: cityData[this.value].lon,
        appid: weatherMapAPIKey,
        units: 'metric',
        lang: 'zh_tw'
    })
    .done(function (data) {
        $("#result").append(`<p>氣溫: ${data.main.temp_min} ~ ${data.main.temp_max}</p>`);
        $("#result").append(`<p><img src = 'https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'>${data.weather[0].description}</p>`);
    })
    .fail(function () { console.log("Error"); })
    .always(function () { console.log("Always"); });
}

function getLocation() {
    if (navigator.geolocation == undefined) {
        alert("Fail to get location");
        return;
    }
    let settings = {
        enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(result, error, settings);
} 
function result(position){ 
    let thisCoords = position.coords; 
    console.log(`Location:${thisCoords.latitude},${thisCoords.longitude}`); 
    cityData[0].lat = thisCoords.latitude;
    cityData[0].lon = thisCoords.longitude;
    
    let weatherAPI_URL = "https://api.openweathermap.org/data/2.5/weather?";
    let weatherMapAPIKey = "27a4eeb1cfec89326a4ca86cf973658a";
    $.getJSON(weatherAPI_URL, {
        lat: cityData[0].lat,
        lon: cityData[0].lon,
        appid: weatherMapAPIKey,
        units: 'metric',
        lang: 'zh_tw'
    })
    .done(function (data) {
        $("#result").append(`<p>氣溫: ${data.main.temp_min} ~ ${data.main.temp_max}</p>`);
        $("#result").append(`<p><img src = 'https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'>${data.weather[0].description}</p>`);
    })
    .fail(function () { console.log("Error"); })
    .always(function () { console.log("Always"); });
    // window.location.href = `https://maps.google.com.tw?q=${thisCoords.latitude},${thisCoords.longitude}`; 
}
function error(err) {
    alert(err);
}
