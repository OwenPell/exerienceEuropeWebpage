function kToF (num){
    const kConstant = 273.15;
    const formula = (num - kConstant) * (9/5) + 32;
    const finalNum = Math.floor(formula)
    // console.log(`${finalNum}`);
    return finalNum
}

function createDataTable(cityQuery, countryQuery, feelsLike, high, low, humidity, windSpeed, description){
    const tableContainer = document.querySelector('#tableContainer')
    
    const table = document.createElement('table');
    tableContainer.appendChild(table);
    table.classList.add("dataTable")

    const colGroup = document.createElement('colgroup');
    table.appendChild(colGroup);

    const col1 = document.createElement('col')
    colGroup.appendChild(col1);
    col1.classList.add("col-header")
    const col2 = document.createElement('col')
    colGroup.appendChild(col2);
    col2.classList.add("col-description")

    //Title Row
    const trHeader = document.createElement('tr');
    table.appendChild(trHeader);
    trHeader.classList.add("tableRow")

    const tdBlank = document.createElement('td');
    trHeader.appendChild(tdBlank);

    const th1 = document.createElement('th');
    th1.innerText = `Weather in ${cityQuery}, ${countryQuery}`;
    trHeader.appendChild(th1);
    

    //Feels Like
    const trFeelsLike = document.createElement('tr');
    table.appendChild(trFeelsLike);
    trFeelsLike.classList.add("tableRow")

    const thFeelsLike = document.createElement('th');
    thFeelsLike.innerText = "Feels Like";
    trFeelsLike.appendChild(thFeelsLike);

    const tdFeelsLike = document.createElement('td');
    tdFeelsLike.innerText = `${feelsLike}F`;
    trFeelsLike.appendChild(tdFeelsLike);

    //High/Low
    const trHighLow = document.createElement('tr');
    table.appendChild(trHighLow);
    trHighLow.classList.add("tableRow")

    const thHighLow = document.createElement('th');
    thHighLow.innerText = "High/Low";
    trHighLow.appendChild(thHighLow);

    const tdHighLow = document.createElement('td');
    tdHighLow.innerText = `${high}/${low}F`;
    trHighLow.appendChild(tdHighLow);

    //Humidity
    const trHum = document.createElement('tr');
    table.appendChild(trHum);
    trHum.classList.add("tableRow")

    const thHum = document.createElement('th');
    thHum.innerText = "Humidity";
    trHum.appendChild(thHum);

    const tdHum = document.createElement('td');
    tdHum.innerText = `${humidity}%`;
    trHum.appendChild(tdHum);

    //Wind Speed
    const trWind = document.createElement('tr');
    table.appendChild(trWind);
    trWind.classList.add("tableRow")

    const thWind = document.createElement('th');
    thWind.innerText = "Wind Speed";
    trWind.appendChild(thWind);

    const tdWind = document.createElement('td');
    tdWind.innerText = `${windSpeed}mph`;
    trWind.appendChild(tdWind);

    //Description
    const trDesc = document.createElement('tr');
    table.appendChild(trDesc);
    trDesc.classList.add("tableRow")

    const thDesc = document.createElement('th');
    thDesc.innerText = "Description";
    trDesc.appendChild(thDesc);

    const tdDesc = document.createElement('td');
    tdDesc.innerText = `${description}`;
    trDesc.appendChild(tdDesc);
}

const getWeatherInfo = async (lat, lon) => {
    const options = {
        method: 'GET',
        url: `https://open-weather13.p.rapidapi.com/city/latlon/${lat}/${lon}`,
        headers: {
          'x-rapidapi-key': '86c8ba1a5cmsh09797d1b1284abbp1a6092jsn02d24ad9fc53',
          'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          const feelsLikeK = response.data.main.feels_like;
          const tempHighK = response.data.main.temp_max;
          const tempLowK = response.data.main.temp_min;
          const humidity = response.data.main.humidity;
          const windSpeed = response.data.wind.speed;
          const description = response.data.weather[0].description;
          const cityQuery = response.data.name;
          const countryQuery = response.data.sys.country;

          const feelsLikeF = kToF(feelsLikeK);
          const tempHighF = kToF(tempHighK);
          const tempLowF = kToF(tempLowK);

          createDataTable(
            cityQuery,
            countryQuery,
            feelsLikeF,
            tempHighF,
            tempLowF,
            humidity,
            windSpeed,
            description
          );
      } catch (error) {
          console.error(error);
      }
}


const getGeocode = async (cityQuery, countryQuery) => {
    const options = {
        method: 'GET',
        url: 'https://geocoding-by-api-ninjas.p.rapidapi.com/v1/geocoding',
        params: {
            city: cityQuery,
            country: countryQuery
        },
        headers: {
          'x-rapidapi-key': '86c8ba1a5cmsh09797d1b1284abbp1a6092jsn02d24ad9fc53',
          'x-rapidapi-host': 'geocoding-by-api-ninjas.p.rapidapi.com'
        }
      };
      
      try {
            const response = await axios.request(options);
          

            if (Array.isArray(response.data) && response.data.length > 0) {
                const { latitude, longitude } = response.data[0];
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                getWeatherInfo(latitude, longitude);
            } else {
                console.log("No geocode results found.");
                return null;
            }
      } catch (error) {
          console.error(error);
      }
}




const weatherForm = document.querySelector("#weatherForm");
weatherForm.addEventListener("submit", function (e) {
    const cityQuery = weatherForm.elements.cityQuery.value;
    const countryQuery = weatherForm.elements.countryQuery.value;
    getGeocode(cityQuery, countryQuery);
    e.preventDefault();

});

const resetForm = document.querySelector("#clearForm");
const tableContainer = document.getElementById("tableContainer");
resetForm.addEventListener("click", function (e) {
    document.getElementById("weatherForm").reset();
    tableContainer.innerHTML = "";
    e.preventDefault();
});