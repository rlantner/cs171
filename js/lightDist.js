/*Creating Part 4 visualizations to determine distance of a crime from a light*/

class LightDist {

    constructor(_parentElement, _distData) {
        this.parentElement = _parentElement;
        this.distData = _distData;

        this.initVis();
    }

    initVis(){

        let vis = this;

        vis.margin = {top: 70, right: 50, bottom: 40, left: 70};
        vis.height = 500 - vis.margin.top - vis.margin.bottom;
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;

        //SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")

        //Source for radial gradient code: https://www.visualcinnamon.com/2016/05/data-based-svg-gradient-d3/
        //create defs for radial gradiant
        vis.defs = vis.svg.append("defs");

        //append radial gradient element
        vis.radialGradient = vis.defs.append("radialGradient")
            .attr("id", "radial-gradient")
            .attr("cx", "50%")
            .attr("cy", "50%")
            .attr("r", "50%")

        //Add colors to make the gradient look like pool of light
        vis.radialGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#FFD400");
        vis.radialGradient.append("stop")
            .attr("offset", "25%")
            .attr("stop-color", "#FFDD3C");
        vis.radialGradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", "#FFEA61");
        vis.radialGradient.append("stop")
            .attr("offset", "90%")
            .attr("stop-color", "#FFF192");
        vis.radialGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#FFFFB7");

        //Apply to a circle by referencing its unique id in the fill
        vis.svg.append("circle")
            .attr("r", 200)
            .style("fill", "url(#radial-gradient)")
            .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height/2) +")")

        //Y scale to include in radial graph
        vis.y = d3.scaleLinear()
            .range([(vis.height/2), 0])

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(8);

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + (vis.width/2) + ", 0)")

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this

        //filter just to night time crimes
        vis.filt = Array.from(vis.distData.filter(d =>
            d.HOUR <6 || d.HOUR> 18
        ))


        /*//filter into shooting vs not shooting
        vis.shootFilt = Array.from(vis.filt.filter(d => d.SHOOTING === 1))
        vis.notShootFilt = Array.from(vis.filt.filter(d => d.SHOOTING ===0))
        console.log(vis.shootFilt)
        console.log(vis.notShootFilt)

        //calculate average distance for shooting and non-shooting crimes
        let shoot = 0
        for (let i = 0; i<vis.shootFilt.length; i++) {
            shoot += vis.shootFilt[i].dist;
        }
        let avShoot = (shoot/vis.shootFilt.length) * 3280.839895 //converted to feet for viz
        console.log("Average dist for shootings: " + avShoot)

        let notShoot = 0
        for (let i = 0; i<vis.notShootFilt.length; i++) {
            notShoot += vis.notShootFilt[i].dist;
        }
        let avNotShoot = (notShoot/vis.notShootFilt.length) * 3280.839895 //converted to feet for viz
        console.log("Average dist for non-shootings: " + avNotShoot)*/

        //filter into violent vs other crimes
        vis.violent = Array.from(vis.filt.filter(d =>
            d["cat"] === "assault" || d["cat"] === "injury/homicide"))
        vis.notViolent = Array.from(vis.filt.filter(d =>
            d["cat"] !== "assault" && d["cat"] !== "injury/homicide"))
        //console.log("Violent crimes:")
        //console.log(vis.violent)
        //console.log("Non-violent crimes:")
        //console.log(vis.notViolent)

        //calculate average distance for shooting and non-shooting crimes
        let violent = 0
        for (let i = 0; i<vis.violent.length; i++) {
            violent += vis.violent[i].dist;
        }
        let avViolent = (violent/vis.violent.length) * 3280.839895 //converted to feet for viz
        //console.log("Average dist for violent: " + avViolent)

        let notViolent = 0
        for (let i = 0; i<vis.notViolent.length; i++) {
            notViolent += vis.notViolent[i].dist;
        }
        let avNotViolent = (notViolent/vis.notViolent.length) * 3280.839895 //converted to feet for viz
        //console.log("Average dist for non-violent: " + avNotViolent)

        vis.crimeArray = [avViolent, avNotViolent]
        console.log("Crime Distances: " + vis.crimeArray)

        vis.updateVis();
    }

    updateVis() {

        let vis = this;

        //create circles to indicate were
        var crimeCircles = vis.svg.selectAll(".crimeCircles")
            .data(vis.crimeArray)

        crimeCircles.enter()
            .append("circle")
            .merge(crimeCircles)
            .attr("class", "crimeCircle")
            .attr("cx", vis.width/2)
            .attr("cy", vis.height/2)
            .attr("r", d => d * 5)
            .attr("fill", "rgba(0, 0, 0, 0)")
            .attr("stroke", function (d, i) {
                if (i==0) {
                    return "red"
                }
                else {
                    return "blue"
                }
            } )
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "3 2")

        //update y axis domain
        vis.y.domain([0, 40]);

        //call axis function
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}