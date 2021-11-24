// Variable for the visualization instance
let crimeMap;
let crimeMapZoom;
let stackedBars;

let parseTime = d3.timeParse('%Y')
let btn;
let lights = 0;

function toggle()
{
    lights = 1
    btn = document.getElementById("lights").innerText
    console.log(btn);
    if(btn === "Turn on the lights!")
    {
        console.log("off -> on")
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
        data.YEAR1 = parseTime(data.YEAR);
        return data
    }),
    d3.csv("data/sun-position.csv", data => {
        data.hour = +data.hour;
        data.month_number = +data.month_number;
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

    crimeMap = new CrimeMap("crime-map", dataArray[0], dataArray[1], dataArray[2], [42.360082, -71.058880], "False", 12);
    crimeMapZoom = new CrimeMap("crime-map-zoom", dataArray[0], dataArray[1], dataArray[2], [42.35988372, -71.06016189], "True", 15);
    
    new LightDist("light-distance", dataArray[0], dataArray[1]);
    new HourMonth("crime-hour-month-1", dataArray[2], dataArray[3]);
    new HourMonth("crime-hour-month-2", dataArray[2], dataArray[3]);
    stackedBars = new StackedBarVis("stackedBar", dataArray[2]);
    new AreaChartVis('AreaChart', dataArray[2])
}

function updateAll() {
  stackedBars.wrangleData()
}