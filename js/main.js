// Variable for the visualization instance
let crimeMap;
let crimeMapZoom

let promises = [
    d3.csv("data/boston-crime.csv"),
    d3.csv("data/streetlight-locations.csv"),
    d3.csv("data/crime_data_with_categories.csv")
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function initMainPage(dataArray) {

    // // log data
    // console.log('check out the data', dataArray);

    crimeMap = new CrimeMap("crime-map", dataArray[0], dataArray[1], dataArray[2], [42.360082, -71.058880], "False", 12);
    crimeMapZoom = new CrimeMap("crime-map-zoom", dataArray[0], dataArray[1], dataArray[2], [42.35988372, -71.06016189], "True", 15);
};