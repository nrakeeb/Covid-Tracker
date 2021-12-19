// declaring variables for all measured statistics
var countryNameEl = document.querySelector(".country");
var totalCasesEl = document.querySelector(".total-cases .value");
var newCasesEl = document.querySelector(".total-cases .new-value");
var recoveredEl = document.querySelector(".recovered .value");
var newRecoveredEl = document.querySelector(".recovered .new-value");
var deathsEl = document.querySelector(".deaths .value");
var newDeathsEl = document.querySelector(".deaths .new-value");
var userInputEl = document.getElementById("userInput");
var searchBtnEl = document.getElementById("searchBtn");
var ctx = document.getElementById("axesLineChart").getContext("2d");
var previousSearchesList = document.getElementById("list")


// list main variables
var appData = [];
var casesList = [];
var recoveredList = [];
var deathsList = [];
var dates = [];
var formatedDates = [];
var userCountry;
var country;
var countryName;
var searchesArray = [];

// when search button clicked it calls the function apiFetch

searchBtnEl.addEventListener("click", function () {
  country = userInputEl.value
  apiFetch(country)
});
// document.getElementById("userInput").onfocus = function() {showRecentSearches()};


// // fetch country codes from api
// // async/await not used here because fetch isn't inside a function, .then is used instead to handle the promise
fetch("https://api.ipgeolocation.io/ipgeo?apiKey=87c06e069cab4ce597da9c4dc04165d3")
  .then(function (res) {
    return res.json(); // list of countries 
  })

  .then(function (data) {
    apiFetch(data.country_name);
  });

/**
* @ description apiFetch async function handles all the fetch requests needed to retrieve covid stats 
* @ returns json 
*/
// function made asynchronous to resolve promise
async function apiFetch(country) {
  if (country !== "") {

    //make request to covid api to get covid confirmed cases by country and save the results to confirmedRes variable
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    }


    var confirmedRes = await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/confirmed",
      requestOptions
    )

    casesList = [];
    recoveredList = [];
    deathsList = [];
    dates = [];
    formatedDates = [];

    // await used here to resolve the promise from .json()
    var confirmedData = await confirmedRes.json()
    userCountry = confirmedData[0].Country

    for (var i = 0; i < confirmedData.length; i++) {
      // populate the dates array with entry dates from api
      dates.push(confirmedData[i].Date);
      // populate the casesList array with confirmed cases from api
      casesList.push(confirmedData[i].Cases);
    }

    // /make request to covid api to get covid recovered cases by country and save the results to recoveredRes variable
    var recoveredRes = await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/recovered",
      requestOptions
    )

    // await used here to resolve the promise from .json()
    var recoveredData = await recoveredRes.json();


    for (var i = 0; i < recoveredData.length; i++) {
      // populate the recoveredList array with recovered cases from api
      recoveredList.push(recoveredData[i].Cases);
    }

    //make request to covid api to get covid deaths by country and save the results to deathsRes variable
    var deathsRes = await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/deaths",
      requestOptions
    )
    var deathsData = await deathsRes.json();

    for (var i = 0; i < deathsData.length; i++) {
      // populate the deathsList array with covid deaths from api
      deathsList.push(deathsData[i].Cases);
    }
  }
  // call the updateUI function which 
  updateUI();
}

/**
 * @ description calls the updateStats function which updates the stats with the results from the api call and the axesLinearChart function which creates a new chart
 */

function updateUI() {
  updateStats();
  axesLinearChart();
  storeSearch();
}

function updateStats() {
  // to get the total cases we get the last entry pushed into the casesList entry 
  var totalCases = casesList[casesList.length - 1];
  // to get the new confirmed case we subtract the last two entries in the casesList array from each other to get the difference
  var newConfirmedCases = totalCases - casesList[casesList.length - 2];
  // to latest recovered number is the last entry of the recoveredList array
  var totalRecovered = recoveredList[recoveredList.length - 1];
  // we subtract the last two entries from the recoveredList array to get the difference
  var newRecoveredCases = totalRecovered - recoveredList[recoveredList.length - 2];
  // get the last entry in the deathsList to get total deaths 
  var totalDeaths = deathsList[deathsList.length - 1];
  // subtract last two entries of the deathList array to get the new deaths stat
  var newDeathsCases = totalDeaths - deathsList[deathsList.length - 2];

  //set the inner html of the html elements to the values defined above 
  countryNameEl.innerHTML = userCountry;
  totalCasesEl.innerText = totalCases;
  newCasesEl.innerHTML = `+${newConfirmedCases}`;
  recoveredEl.innerHTML = totalRecovered;
  newRecoveredEl.innerHTML = `+${newRecoveredCases}`;
  deathsEl.innerHTML = totalDeaths;
  newDeathsEl.innerHTML = `+${newDeathsCases}`;

  // loops through each date in the dates array and passes them through as paramtres in the formatDate function.
  // these formatted dates are then pushed into their own array
  for (var i = 0; i < dates.length; i++) {
    formatedDates.push(formatDate(dates[i]));
  }
}

// format line chart 
var myChart;

/**
 * @ description instantiate the Chart class
 * @ params ctx variable which holds the 2d context of the canvas where the chart will be drawn
 * @ params pre-defined chart-type with custom data sets passed through as an object
 * 
 */
function axesLinearChart() {
  // delete chart if it already exists 
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: casesList,
          fill: false,
          borderColor: " #0066cc",
          backgroundColor: " #0066cc",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recoveredList,
          fill: false,
          borderColor: "#33cc33",
          backgroundColor: "#33cc33",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deathsList,
          fill: false,
          borderColor: " #ff0000",
          backgroundColor: " #ff0000",
          borderWidth: 1,
        },
      ],
      labels: formatedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
// array of month names for the formatDate function
var monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * @ description formatDate function that changes date into a more readable format using javaScript Date object
 * @ param date string
 * @ returns new string with improved date format 
 */
// changes date format from "2020-02-15T00:00:00Z" to "15 Feb"
function formatDate(dateString) {
  var date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}

function storeSearch() {
  // if country is not null, run the below function
  if (country != null) {
    // if local storage is empty, then usersearches pushed into the array
    if (localStorage.getItem('userSearches') === null) {
      searchesArray.push(country)
      localStorage.setItem('userSearches', JSON.stringify(searchesArray))
      //  if local storage is not emply, add usersearches onto existing array
    } else {
      searchesArray = JSON.parse(localStorage.getItem('userSearches'))
      // make sure duplicate vales are not saved onto local storage. IndexOf loops through the array and returns the index of item in the array.
      if (searchesArray.indexOf(country) == -1) {
        searchesArray.push(country);
      }
      localStorage.setItem('userSearches', JSON.stringify(searchesArray))
    }
  }
}
// get searches from local storage to show as list on web once the input box is clicked
function showRecentSearches() {
  if (JSON.parse(localStorage.getItem('userSearches')) != null) {
    searchesArray = JSON.parse(localStorage.getItem('userSearches'));
    previousSearchesList.innerHTML = ""
    for (var i = 0; i < searchesArray.length; i++) {
      var searchItem = document.createElement("li")
      searchItem.innerHTML = searchesArray[i]
      previousSearchesList.appendChild(searchItem)
    }
  }
}