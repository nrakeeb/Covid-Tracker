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
var search_country_element = document.querySelector(".search");
// add country list element
var country_list_element = document.querySelector(".g7-list");
// add button to change country
var chang_country_btn = document.querySelector(".change");
// add button to close list
var close_list_btn = document.querySelector(".close");
// add input to acknowledge searches
var input = document.getElementById('search-input');

// add function to display country list when searching
function createCountryList(){
    // set list to equal total number of countries added
    var num_countries = country_list.length;
    // unordered country list id
    for (var i = 0; i < country_list.length; i++) {
    console.log("test")
    }
}
    

