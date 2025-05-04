function createDataTable(price, departAirport, departCity, departCountry, destAirport, destCity, destCountry){
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
    col2.classList.add("col-departure")
    const col3 = document.createElement('col')
    colGroup.appendChild(col3);
    col3.classList.add("col-arrival")

    //Title Row
    const trHeader = document.createElement('tr');
    table.appendChild(trHeader);

    const tdBlank = document.createElement('td');
    trHeader.appendChild(tdBlank);

    const th1 = document.createElement('th');
    th1.innerText = "Departure";
    trHeader.appendChild(th1);

    const th2 = document.createElement('th');
    th2.innerText = "Arrival";
    trHeader.appendChild(th2);


    //Airport Name Row
    const trBody1 = document.createElement('tr');
    table.appendChild(trBody1);

    const thBody1 = document.createElement('th');
    thBody1.innerText = "Airport Name";
    trBody1.appendChild(thBody1);

    const td1Body1 = document.createElement('td');
    td1Body1.innerText = `${departAirport}`;
    trBody1.appendChild(td1Body1);

    const td2Body1 = document.createElement('td');
    td2Body1.innerText = `${destAirport}`;
    trBody1.appendChild(td2Body1);


    //City Row
    const trBody2 = document.createElement('tr');
    table.appendChild(trBody2);

    const thBody2 = document.createElement('th');
    thBody2.innerText = "City";
    trBody2.appendChild(thBody2);

    const td1Body2 = document.createElement('td');
    td1Body2.innerText = `${departCity}`;
    trBody2.appendChild(td1Body2);

    const td2Body2 = document.createElement('td');
    td2Body2.innerText = `${destCity}`;
    trBody2.appendChild(td2Body2)

    //Country Row
    const trBody3 = document.createElement('tr');
    table.appendChild(trBody3);

    const thBody3 = document.createElement('th');
    thBody3.innerText = "Country";
    trBody3.appendChild(thBody3);

    const td1Body3 = document.createElement('td');
    td1Body3.innerText = `${departCountry}`;
    trBody3.appendChild(td1Body3);

    const td2Body3 = document.createElement('td');
    td2Body3.innerText = `${destCountry}`;
    trBody3.appendChild(td2Body3);

    //Price Row
    const trFooter = document.createElement('tr');
    table.appendChild(trFooter);

    const thFooter = document.createElement('th');
    thFooter.innerText = "Total Ticket Cost";
    trFooter.appendChild(thFooter);

    const tdFooter = document.createElement('td');
    tdFooter.innerText = `${price}`;
    trFooter.appendChild(tdFooter);
}


const getFlightInfo = async (originCity, destinationCity, originId, destinationId, departDate, returnDate, numTix) => {
    const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete',
        params: {
          originSkyId: originCity,
          destinationSkyId: destinationCity,
          originEntityId: originId,
          destinationEntityId: destinationId,
          date: departDate,
          returnDate: returnDate,
          cabinClass: 'economy',
          adults: numTix,
          sortBy: 'best',
          currency: 'USD',
          market: 'en-US',
          countryCode: 'US'
        },
        headers: {
          'x-rapidapi-key': '86c8ba1a5cmsh09797d1b1284abbp1a6092jsn02d24ad9fc53',
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      };
      
      try {
        const response = await axios.request(options);
        const price = response.data.data.itineraries[0].price.formatted;
        const departureAirportName = response.data.data.itineraries[0].legs[0].origin.name;
        const departureCity = response.data.data.itineraries[0].legs[0].origin.city;
        const departureCountry = response.data.data.itineraries[0].legs[0].origin.country;
        // const departureTime = response.data.data.itineraries[0].legs[0].destination.departure;
        const destinationAirportName = response.data.data.itineraries[0].legs[0].destination.name;
        const destinationCity = response.data.data.itineraries[0].legs[0].destination.city;
        const destinationCountry = response.data.data.itineraries[0].legs[0].destination.country;
        // const destinationArrivalTime = response.data.data.itineraries[0].legs[0].destination.arrival;
        

        createDataTable(price, 
            departureAirportName, 
            departureCity, 
            departureCountry, 
            destinationAirportName, 
            destinationCity, 
            destinationCountry
        );

      } catch (error) {
        console.error(error);
      }
};


const getCityAirport = async (cityQuery) => {
    const options = {
        method: 'GET',
        url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
        params: {
          query: cityQuery,
          locale: 'en-US'
        },
        headers: {
          'x-rapidapi-key': '86c8ba1a5cmsh09797d1b1284abbp1a6092jsn02d24ad9fc53',
          'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com'
        }
      };


      try {
        const response = await axios.request(options);
    
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const firstResult = response.data.data[0];
          const skyId = firstResult.skyId;
          const entityId = firstResult.entityId;
    
          console.log("First SkyID:", skyId);
          console.log("First EntityID:", entityId);
    
          return { skyId, entityId };
        } else {
          console.log("No airport data found.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching city airport:", error);
        return null;
      }
};

const handleFlightForm = async (departDate, returnDate, numTix) => {
    try {
      const origin = await getCityAirport(flightForm.elements.originCity.value);
      const destination = await getCityAirport(flightForm.elements.destinationCity.value);
  
      const originCityId = origin.skyId;
      const originCityEnt = origin.entityId;
      const destCityId = destination.skyId;
      const destCityEnt = destination.entityId;
      const dDate = departDate;
      const rDate = returnDate;
      const tix = numTix;
  
      getFlightInfo(
        originCityId, 
        destCityId, 
        originCityEnt, 
        destCityEnt,
        dDate,
        rDate,
        tix
      );
    } catch (error) {
      console.error("Error fetching airport info:", error);
    }
};

const flightForm = document.querySelector("#flightForm");
flightForm.addEventListener("submit", function (e) {
    const departDate = flightForm.elements.departDate.value;
    const returnDate = flightForm.elements.returnDate.value;
    const numTix = flightForm.elements.tickets.value;
    handleFlightForm(departDate, returnDate, numTix);
    e.preventDefault(); 
});

const resetForm = document.querySelector("#clearForm");
const tableContainer = document.getElementById("tableContainer");
resetForm.addEventListener("click", function (e) {
    document.getElementById("flightForm").reset();
    tableContainer.innerHTML = "";
    e.preventDefault();
});