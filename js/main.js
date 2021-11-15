/* main JS file */

//load the data with promises

let promises = [
    d3.csv("data/boston-crime.csv", data => {
        data.LAT = +data.LAT;
        data.LONG = +data.LONG;
        return data
    }),
    d3.csv("data/streetlight-locations.csv", data => {
        data.Lat = +data.Lat;
        data.Long = +data.Long;
        return data
    })
];

Promise.all(promises)
    .then(function(data) {
         createVis(data)
    })


function createVis(data) {
    new LightDist("light-distance", data[0], data[1]);
    new HourMonth("crime-hour-month", data[0]);
}