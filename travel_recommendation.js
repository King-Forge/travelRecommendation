//set up some common global constants for reference later
const searchResultsDiv = document.getElementById("searchResults");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");

//register event listeners
resetBtn.addEventListener("click", resetSearch);
searchBtn.addEventListener("click", searchDestinations);
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter"){
        event.preventDefault();
        searchDestinations();
    }
});

//clear search results and search box
function resetSearch() {
    searchResultsDiv.innerHTML = "";
    searchInput.value = "";
}

async function searchDestinations() {
    let searchResults = [];
    let searchString = searchInput.value;
    try{
        //get the data from the local JSON and parse it into an object
        destinationList = await fetch("travel_recommendation_api.json");
        if (!destinationList.ok) {
            throw new Error(`HTTP error! status: ${destinationList.status}`);
        }
        destinationList = await destinationList.json();
    
        //iterate through JSON data for search terms at certian levels
        //convert strings inline for case insentive search
        //note: all city, temple, and beach names contain country name,
        //this means we only have to search on a few levels of the JSON
        for (country of destinationList.countries){
            for (city of country.cities){
                if (city.name.toLowerCase().contains(searchString.toLowerCase())) {
                    searchResults.push(city);
                }
            }
        }
        //search temples and beaches separately
        //since they're nested at a different level than countries
        for (temple of destinationList.temples){
            if (temple.name.toLowerCase().contains(searchString.toLowerCase())){
                searchResults.push(temple);
            }
        }
        for (beach of destinationList.beaches){
            if (beach.name.toLowerCase().contains(searchString.toLowerCase())){
                searchResults.push(beach);
            }
        }
    }
    catch (error) {
        console.error('Error fetching data:', error);
    return [];  //exit function before we try to display anything
    }
    
    //if successful, each entry in the array will now be an object with
    //name, imageURL, and description properties. Only temples and beaches have
    //an ID number, since this is at the country (not city) level in the JSON 
    //now build the div

    searchResultsDiv.innerHTML = "";
    searchResults.forEach(destination => {
        searchResultsDiv.innerHTML += `<div class="searchResult">
            <h3>Destination: ${destination.name}</h3>
            <img src="${destination.imageURL}" alt="Photo of ${destination.name}"> 
            <p>${destination.description}</p>
            </div>`;
    });
}