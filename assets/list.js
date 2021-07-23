// declare variables as a list of countries with their equivalent ISO codes
var country_list = [
    { name: 'Canada', code: 'CAN' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'Italy', code: 'IT' },
    { name: 'Japan', code: 'JP' },
    { name: 'UK', code: 'GB' },
    { name: 'US', code: 'US' },
];
console.log(country_list)

// add search country element 
var searchCountry = document.querySelector(".search");
// add country list element
var countryList = document.querySelector(".g7-list");
// add button to change country
var changeCountry = document.querySelector(".change");
// add button to close list
var closeList = document.querySelector(".close");
// add input to acknowledge searches
var input = document.getElementById('search-input');

// add function to display country list when searching
function createCountryList() {
    // set list to equal total number of countries added
    var num_countries = country_list.length;
    // unordered country list id
    for (var i = 0; i < country_list.length; i++) {
        console.log("test")
    }
}

// How many lists declared in drop down
var numOflists = 3;

createCountryList();

// upon user interaction via clicking displays search bar for user to search specific country 
function changeCountr() {
    input.value = ""
    resetCountry ();
    searchCountry.classlist.toggle("hide");
    searchCountry.classlist.toggle("fadeIn");
}





// resets lists of countries from previous searches
function resetCountry () {
    countr_list.


}