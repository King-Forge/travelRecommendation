//set up some common global constants for reference later
const searchResultsDiv = document.getElementById("searchResults");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("clearBtn");

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
    let searchString = searchInput.value.toLowerCase();
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
                if (city.name.toLowerCase().includes(searchString)) {
                    searchResults.push(city);
                }
            }
        }
        //search temples and beaches separately
        //since they're nested at a different level than countries
        //if user searches for 'temple', 'temples', 'beach', 'beaches', return all relevant items
        for (temple of destinationList.temples){
            if (temple.name.toLowerCase().includes(searchString) ||
              searchString.includes("temple")){
                searchResults.push(temple);
            }
        }
        for (beach of destinationList.beaches){
            if (beach.name.toLowerCase().includes(searchString) ||
              searchString.includes("beach")){
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
        let timeZone = "";
        const littleName = destination.name.toLowerCase();
        //bunch of if statements to set time zone
        //would be beter to do this with a lookup table for 'real' data
        if(littleName.includes("australia")){
            timeZone = "Australia/Sydney";
        } else if (littleName.includes("brazil")){
            timeZone = "America/Sao_Paulo";
        } else if (littleName.includes("japan")){
            timeZone = "Asia/Tokyo";
        } else if (littleName.includes("cambodia")){
            timeZone = "Asia/Phnom_Penh";
        } else if (littleName.includes("india")){
            timeZone = "Asia/Kolkata";
        } else if (littleName.includes("polynesia")){
            timeZone = "Pacific/Tahiti";
        }

        const destinationTime = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric'};
        const formattedTime = new Date().toLocaleTimeString('en-US', destinationTime);
        console.log(`Current time in ${destination.name} is: ${formattedTime}`);

        searchResultsDiv.innerHTML += `<div class="searchResult">
            <h3>Destination: ${destination.name}</h3>
            <p>Current local time is: ${formattedTime}</p>
            <img src="${destination.imageUrl}" alt="Photo of ${destination.name}"> 
            <p>${destination.description}</p>
            </div>`;
    });
}