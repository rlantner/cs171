class CrimeMap {

    /*
     *  Constructor method
     */
    constructor(parentElement, crimeData, lightData, peopleCrime, mapCenter, zoomBool, zoomFactor) {
        this.parentElement = parentElement;
        this.crimeData = crimeData;
        this.lightData = lightData;
        this.peopleCrime = peopleCrime;
        this.mapCenter = mapCenter;
        this.zoomBool = zoomBool
        this.zoomFactor = zoomFactor

        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;

        vis.map = L.map(vis.parentElement).setView(vis.mapCenter, vis.zoomFactor);

        // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        // 	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // }).addTo(vis.map);

        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(vis.map);


        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        vis.peopleCrime.forEach(d => {
                d.LAT = +d.LAT
                d.LONG = +d.LONG
                d.YEAR = +d.YEAR
            }
        )

        vis.lightData.forEach(d => {
                d.Lat = +d.Lat
                d.Long = +d.Long
                d.OBJECTID = +d.OBJECTID
            }
        )

        vis.filteredCrime = vis.peopleCrime.filter(d => d["Crime Category"] !== "fraud"
                && (d.YEAR === 2016 || d.YEAR === 2017 || d.YEAR === 2018)
                && (d.HOUR < 6 || d.HOUR > 18))

        if (vis.zoomBool === "True") {
            vis.filteredLight = vis.lightData.filter(d => d.Lat < 42.37 && d.Lat > 42.35 && d.Long < -71.05 && d.Long > -71.07)
        }

        console.log(vis.filteredCrime)
        console.log(vis.filteredLight)

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        let LeafIcon = L.Icon.extend({
            options: {
                iconSize: [8, 8],
            }
        });

        let crimeMarker = new LeafIcon({ iconUrl:  'img/crime_icon.png' });
        let lightMarker = new LeafIcon({ iconUrl:  'img/light_icon.png' });
        
        if (lights === 1) {
                if (vis.zoomBool === "True") {
                    vis.filteredLight.forEach((d, i) => {
                        console.log("light light baby")
                        lights = L.marker([d.Lat, d.Long], { icon: lightMarker })
                            .addTo(vis.map)
                    })
                }
        }


        vis.filteredCrime.forEach((d, i) => {
            let popupContent =  "<strong>" + d.OFFENSE_DESCRIPTION + "</strong><br/>";
            popupContent += "Date: " + d.OCCURRED_ON_DATE + "<br/>";
            popupContent += "Street: " + d.STREET + "<br/>";
            popupContent += "Latitude: " + d.LAT + "<br/>";
            popupContent += "Longitude: " + d.LONG + "<br/>";
            L.marker([d.LAT, d.LONG], { icon: crimeMarker })
                .bindPopup(popupContent)
                .addTo(vis.map)
        })
    }

}
