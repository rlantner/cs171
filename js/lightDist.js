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

        //create empty arrays
        let crimeLightPairs = []
        let lightDistances = []

       /* //calculate closest light
        this.crimeData.forEach(function (crime) {
            for (var i = 0; i < vis.lightData.length; i++){ //loop through each light
                let distToLight = distance(crime.LAT, crime.LON, vis.lightData[i].Lat, vis.lightData[i].Lon) //save each distance
                lightDistances.push(distToLight)
            }
            let closestLight = d3.min(lightDistances)
            crimeLightPairs.push({crime: crime.ID, light: closestLight})
        })
        console.log(crimeLightPairs)*/

    }
/*
*PROCESS NOTES FOR THIS SECTION
* The above code (lines 36-45) that's intended to calculate the closest light for each crime breaks upon loading - it is
* too inefficient. Instead of doing this dynamically, moving forward I am going to calculate this separately and save
* the crime IDs, their the closest light ID, and the distance between the crime and it's closest light as a data file
* we can pull in as a third data file. This will allow us to construct the needed visualizations for part 4 without
* breaking the webpage.
* */

}

//function to determine distance between two points
// based on: https://www.geodatasource.com/developers/javascript
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