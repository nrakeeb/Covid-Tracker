// declaring variables for all measured statistics
var countryNameEl = $(".country .name")[0];
var totalCasesEl = $(".total-cases .value")[0];
var newCasesEl = $(".total-cases .new-value")[0];
var recoveredEl = $(".recovered .value")[0];
var newRecoveredEl = $(".recovered .new-value")[0];
var deathsEl = $(".deaths .value")[0];
var newDeathsEl = $(".deaths .new-value")[0];

var ctx = document.getElementById("axesLineChart").getContext("2d");

// list main variables
var appData = [];
var casesList = [];
var recoveredList = [];
var deathsList = [];
var dates = [];
var formatedDates = [];

// fetch country codes from api
// async/await not used here because fetch isn't inside a function, .then is used instead to handle the promise
fetch("https://api.ipgeolocation.io/ipgeo?apiKey=87c06e069cab4ce597da9c4dc04165d3")
  .then(function (res) {
    return res.json(); // list of countries 
  })

  .then(function (data) {
    var countryCode = data.country_code2;// inside json it has a county code 
    var userCountry;

    // this matches the code from list.js with the data fetched from the api.geolocation
    // country_list is accessible because a variable in the global scope is accessible to all scripts loaded after it is declared.
    for (var i = 0; i < country_list.length; i++) {
      if (country_list[i].code === countryCode) {
        userCountry = country_list[i].name
      }
    }
    fetchData(userCountry);
  });

// fetch API data (cases, recovered, deaths,)
function fetchData(country) {
  userCountry = country;
  countryNameEl.innerHTML = "Loading...";

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  /**
 * @ description apiFetch async function handles all the fetch requests needed to retrieve covid stats 
 * @ returns json 
 */
  // function made asynchronous to resolve promise
  async function apiFetch(country) {
    //make request to covid api to get covid confirmed cases by country and save the results to confirmedRes variable
    var confirmedRes = await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/confirmed",
      requestOptions
    )

    // await used here to resolve the promise from .json()
    var confirmedData = await confirmedRes.json()

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
    // call the updateUI function which 
    updateUI();
  };

  apiFetch(country);
}

/**
 * @ description calls the updateStats function which updates the stats with the results from the api call and the axesLinearChart function which creates a new chart
 */

function updateUI() {
  updateStats();
  axesLinearChart();
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
​
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
          borderColor: "#00008b",
          backgroundColor: "#00008b",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recoveredList,
          fill: false,
          borderColor: "#a9a9a9",
          backgroundColor: "#a9a9a9",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deathsList,
          fill: false,
          borderColor: "#ffa500",
          backgroundColor: "#ffa500",
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