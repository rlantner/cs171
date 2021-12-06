// Variable for the visualization instance
let crimeMap;
let crimeMapZoom;
let stackedBars;
let areaChart;

let parseTime = d3.timeParse('%m/%Y')
let lights = 0;

// Light toggle function - style changes
function toggle()
{
    if (lights !== 2) {
        lights = 1
        document.getElementById("part3").style.color = "white";
        document.getElementById("lights").style.borderColor = "white";
        document.getElementById("part3").style.backgroundImage = "url('img/night.png')";
        crimeMapZoom.wrangleData();
    }
}

let promises = [
    d3.csv("data/boston-crime.csv", data => {
        data.ID = +data.ID;
        data.LAT = +data.LAT;
        data.LONG = +data.LONG;
        data.HOUR = +data.HOUR;
        data.MONTH = +data.MONTH;
        data.YEAR = +data.YEAR;
        data.SHOOTING = +data.SHOOTING;
        //data.OFFENSE_CODE = +data.OFFENSE_CODE;
        return data
    }),
    d3.csv("data/streetlight-locations.csv", data => {
        data.Lat = +data.Lat;
        data.Long = +data.Long;
        return data
    }),
    d3.csv("data/crime_data_with_categories.csv", data => {
        data.ID = +data.ID;
        data.LAT = +data.LAT;
        data.LONG = +data.LONG;
        data.HOUR = +data.HOUR;
        data.MONTH = +data.MONTH;
        data.SHOOTING = +data.SHOOTING;
        data.OFFENSE_CODE = +data.OFFENSE_CODE;
        data.areaDate = parseTime(data.MONTH+'/'+data.YEAR);
        return data
    }),
    d3.csv("data/sun-position.csv", data => {
        data.hour = +data.hour;
        data.month_number = +data.month_number;
        return data
    }),
    d3.csv("data/crime_light_dist.csv", data => {
        data.ID = +data.ID;
        data.lightID = +data.lightID;
        data.lat1 = +data.lat1;
        data.long1 = +data.long1;
        data.lat2 = +data.lat2;
        data.long2 = +data.long2;
        data.HOUR = +data.HOUR;
        data.MONTH = +data.MONTH;
        data.YEAR = +data.YEAR;
        data.SHOOTING = +data.SHOOTING;
        data.dist = +data.dist;
        return data
    })
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function initMainPage(dataArray) {

    // log data
    console.log('check out the data', dataArray);

    crimeMap = new CrimeMap("crime-map", dataArray[0], dataArray[1], dataArray[2], [42.32339346, -71.06321676], "False", 12);
    crimeMapZoom = new CrimeMap("crime-map-zoom", dataArray[0], dataArray[1], dataArray[2], [42.32525137, -71.08459937], "True", 15);

    new HourMonth("crime-hour-month-1", dataArray[2], dataArray[3]);
    new HourMonth("crime-hour-month-2", dataArray[2], dataArray[3]);
    stackedBars = new StackedBarVis("stackedBar", dataArray[2]);
    areaChart = new AreaChartVis('AreaChart', dataArray[2])
    new LightDist("light-distance", dataArray[4]);

}

function updateAll() {
  stackedBars.wrangleData()
    areaChart.wrangleData()
}

// React to 'brushed' event and update all bar charts
function brushed() {

    // * TO-DO *
    // Get the extent of the current brush
    let selectionRange = d3.brushSelection(d3.select(".brush").node());
    // Convert the extent into the corresponding domain values
    let brushRegion = selectionRange.map(areaChart.x.invert);
    //console.log(brushRegion) for debugging
    stackedBars.selectionChanged(brushRegion)

}