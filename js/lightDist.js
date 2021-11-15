/*Creating Part 4 visualizations to determine distance of a crime from a light*/

class LightDist {

    constructor(_parentElement, _crimeData, _lightData) {
        this.parentElement = _parentElement;
        this.crimeData = _crimeData;
        this.lightData = _lightData;

        this.initVis();
    }

    initVis(){

        let vis = this;

        //placeholder for now while I work on wrangling the data to calculate the distance to nearest light below

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this

        //examine crime and light data
        console.log("Crime Data")
        console.log(vis.crimeData)

        console.log("Light Data")
        console.log(vis.lightData)

        //create empty array for new array of objects
        let crimeLightPairs = []

        //set light search area for each crime
        /*this.crimeData.forEach(function (crime) {

        })*/


    }


}

//function to determine distance between two points
function distance(lat1, lon1, lat2, lon2) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
}