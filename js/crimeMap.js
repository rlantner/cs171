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
     *  Initialize maps
     */
    initVis () {
        let vis = this;

        /* Change map initialization dependent on given map */
        if (vis.zoomBool === "True") {
            /* Disable zooming on smaller map */
            vis.map = L.map(vis.parentElement, { zoomControl: false, scrollWheelZoom: false }).setView(vis.mapCenter, vis.zoomFactor);
        }
        else{
            vis.map = L.map(vis.parentElement).setView(vis.mapCenter, vis.zoomFactor);
        }

        /* Initialize tile layer */
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
        
        /* Filter to specific square if smaller zoomed map */
        if (vis.zoomBool === "True") {
            vis.filteredCrime = vis.peopleCrime.filter(d =>
                (d.SHOOTING === 1 || d.OFFENSE_CODE_GROUP === 'Homicide')
                && (d.YEAR === 2018 || d.YEAR === 2017 || d.YEAR === 2016)
                && (d.HOUR < 6 || d.HOUR > 18)
                && (d.LAT < 42.335 && d.LAT > 42.315 && d.LONG < -71.075 && d.LONG > -71.095))
        }
        else{
            vis.filteredCrime = vis.peopleCrime.filter(d =>
                (d.SHOOTING === 1 || d.OFFENSE_CODE_GROUP === 'Homicide')
                && (d.YEAR === 2018 || d.YEAR === 2017 || d.YEAR === 2016)
                && (d.HOUR < 6 || d.HOUR > 18))
        }
        
        /* Streetlight settings for smaller map */
        if (vis.zoomBool === "True") {
            vis.filteredLight = vis.lightData.filter(d => d.OBJECTID%2 === 1 && d.Lat < 42.335 && d.Lat > 42.315 && d.Long < -71.075 && d.Long > -71.095)
        }

        // console.log(vis.filteredCrime)
        // console.log(vis.filteredLight)

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        /* Marker settings */
        let LeafIcon = L.Icon.extend({
            options: {
                iconSize: [8, 8],
            }
        });

        let crimeMarker = new LeafIcon({ iconUrl:  'img/crime_icon.png' });
        let lightMarker = new LeafIcon({ iconUrl:  'img/light_icon.png' });
        
        /* If light button has been pushed, add light markers */
        if (lights === 1) {
                if (vis.zoomBool === "True") {
                    vis.filteredLight.forEach((d, i) => {
                        // console.log("light light baby")
                        lights = L.marker([d.Lat, d.Long], { icon: lightMarker })
                            .addTo(vis.map)
                    })
                }
        }

        /* Add crime markers wigth pop-ups */
        vis.filteredCrime.forEach((d, i) => {
            let popupContent =  "<strong>" + d.OFFENSE_DESCRIPTION + "</strong><br/>";
            popupContent += "Date: " + d.OCCURRED_ON_DATE + "<br/>";
            popupContent += "Street: " + d.STREET + "<br/>";
            if (d.SHOOTING === 1) {
                popupContent += "Shooting: Yes<br/>";
            }
            else{
                popupContent += "Shooting: No<br/>";
            }
            popupContent += "Latitude: " + d.LAT + "<br/>";
            popupContent += "Longitude: " + d.LONG + "<br/>";
            L.marker([d.LAT, d.LONG], { icon: crimeMarker })
                .bindPopup(popupContent)
                .addTo(vis.map)
        })
    }

}
