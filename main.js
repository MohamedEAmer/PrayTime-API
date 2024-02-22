const searchLocation = document.querySelector(".locationBtn")
const searchCityBtn = document.querySelector(".cityBtn")
const searchCityName = document.querySelector(".cityName")
const searchCountryName = document.querySelector(".cityName")



searchLocation.addEventListener("click", function(){
    getTimeAndLocation();
})
getTime();
setInterval( getTime , 1000)
function getTimeAndLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            getTimeAndLocationDetails(latitude, longitude);
        }, function(error) {
            console.error("Error getting geolocation:", error.message);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function getTimeAndLocationDetails(latitude, longitude) {
    var locationRequest = new XMLHttpRequest();
    var locationURL = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + latitude + "&longitude=" + longitude + "&localityLanguage=en";

    locationRequest.open('GET', locationURL);
    locationRequest.send();

    locationRequest.onload = function() {
        if (locationRequest.status === 200) {
            var locationData = JSON.parse(locationRequest.responseText);
            console.log("MyLocation :",locationData)
            var city = locationData.city;
            var country = locationData.countryName;

            document.getElementById('locationDisplay').innerText =city;
            getTime();
            prays(city,country);
            
        } else {
            console.error("Failed to fetch location data:", locationRequest.statusText);
        }
    };
}



function getCountryToCity(latitude, longitude , country1) {
    var locationRequest = new XMLHttpRequest();
    var locationURL = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + latitude + "&longitude=" + longitude + "&localityLanguage=en";

    locationRequest.open('GET', locationURL);
    locationRequest.send();

    locationRequest.onload = function() {
        if (locationRequest.status === 200) {
            var locationData = JSON.parse(locationRequest.responseText);
            console.log("PrayLocation :", locationData)
            var city = locationData.city;
            var country2 = locationData.countryName;
            if(country1 == country2){
            document.getElementById('city2').innerText = city
            document.getElementById('country2').innerText = country2
            }else{
                document.getElementById('city2').innerText = country1
                document.getElementById('country2').innerText = country2
            }
        } else {
            console.error("Failed to fetch location data:", locationRequest.statusText);
        }
    };
}


async function getTimeToCity(lat,long){
    const apiKey = '6P5G7A4V82MR'; 
    const apiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${long}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status === "OK") {
            const time = new Date(data.formatted);
            console.log(time.toLocaleString().substring(11))
            document.getElementById('time2').innerText =  time.toLocaleString().substring(11);
            // console.log('Current time:', time.toLocaleString());
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}






function getTime() {
    var locationInTime = document.getElementById("locationDisplay").innerHTML
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    minutes = (minutes < 10 ? '0' : '') + minutes;
    seconds = (seconds < 10 ? '0' : '') + seconds;

    var timeString = hours + ':' + minutes + ':' + seconds;

    document.getElementById('timeDisplay').innerText = timeString ;
    document.getElementById('timeDisplayLocation').innerText =' in '+ locationInTime;
}



async function getPraysTime (city, country) {
    const url = `http://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("PraysTime :", data.data)

      if (data && data.data && data.data.timings) {
        document.getElementById('fajr').innerText =data.data.timings.Fajr;
        document.getElementById('dhuhr').innerText =data.data.timings.Dhuhr;
        document.getElementById('asr').innerText =data.data.timings.Asr;
        document.getElementById('maghrib').innerText =data.data.timings.Maghrib;
        document.getElementById('isha').innerText =data.data.timings.Isha;
        
            if(city==country){
                getCountryToCity(data.data.meta.latitude,data.data.meta.longitude,country)
                getTimeToCity(data.data.meta.latitude,data.data.meta.longitude)
                }
            else{
                document.getElementById('city2').innerText =city;
                document.getElementById('country2').innerText = country
                document.getElementById('time2').innerText = document.getElementById('timeDisplay').innerText

                }       

        return data.data.timings;
        
      } else {
        throw new Error('Prayer times data not found');
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error.message);
      return null;
    }
}
function prays(autoCity , autoContry){
    var myCity=autoCity
    var myCountry = autoContry
    if(myCity||myCountry){
        getPraysTime(myCity , myCountry)
    }
    else{
        getPraysTime(searchCityName.value , searchCountryName.value)
    }
    
}

searchCityBtn.addEventListener("click", function(){
    prays();
})
searchCityName.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        prays();
    }
});


// function nextPray(){
//     if(document.getElementById('time2').innerText < document.getElementById('fajr').innerText)
//     {}

// }




