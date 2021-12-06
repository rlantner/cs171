/*Creating Part 4 visualizations to determine distance of a crime from a light*/

class LightDist {

    constructor(_parentElement, _distData) {
        this.parentElement = _parentElement;
        this.distData = _distData;

        this.initVis();
    }

    initVis(){

        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.height = 700- vis.margin.top - vis.margin.bottom;
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
            .range([(vis.height/2), (vis.height/2)-200])

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(8);

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + (vis.width/2) + ", 0)")

        //add y label

        vis.svg.append("g")
            .attr("class", "ylab")
            .attr("transform", "translate(" + ((vis.width/2)-100) + "," + ((vis.height/2)-210) + ")")
            .append("text")
                .text("Avg. Distance from Closest Streetlight (feet)")
                .attr("class", "ylab-text axis-label")
                .attr("fill", "black")
                .attr("font-size", "10px")

        //add legend
        //create color array
        vis.colors = ["#c94c4c", "#618685", "#36486b"]

        //create legend
        var legend = vis.svg.selectAll(".legend")
            .data(vis.colors)

        legend.enter()
            .append("circle")
            .attr("class", "legend")
            .attr("cx", vis.width*(5/6))
            .attr("cy", (d, i) => i*25 + 120)
            .attr("r", 8)
            .attr("fill", d => d)

        //create label array
        vis.labels = ["Assault", "Injury/Homicide", "Theft"]

        //create legend labels
        var legendLabel = vis.svg.selectAll(".legend-label")
            .data(vis.labels)

        legendLabel.enter()
            .append("text")
            .attr("class", "legend-label")
            .attr("x", vis.width*(5/6) + 15)
            .attr("y", (d, i) => i*25 + 125)
            .text(d => d)

        //add tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', 'tooltip')
            .attr('id', 'distTooltip')

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

        /*//filter into violent vs other crimes
        vis.violent = Array.from(vis.filt.filter(d =>
            d["Crime Category"] === "assault" || d["Crime Category"] === "injury/homicide"))
        vis.notViolent = Array.from(vis.filt.filter(d =>
            d["Crime Category"] !== "assault" && d["Crime Category"] !== "injury/homicide"))
        console.log("Violent crimes:")
        console.log(vis.violent)
        console.log("Non-violent crimes:")
        console.log(vis.notViolent)

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
        console.log("Crime Distances: " + vis.crimeArray)*/

        //filter into violent vs other crimes
        vis.assault = Array.from(vis.filt.filter(d =>
            d["Crime Category"] === "assault"))
        vis.injury = Array.from(vis.filt.filter(d =>
            d["Crime Category"] === "injury/homicide"))
       /* vis.fraud = Array.from(vis.filt.filter(d =>
            d["Crime Category"] === "fraud"))*/
        vis.theft = Array.from(vis.filt.filter(d =>
            d["Crime Category"] === "theft"))

        console.log("assault:")
        console.log(vis.assault)
        console.log("injury:")
        console.log(vis.injury)
       /* console.log("fraud:")
        console.log(vis.fraud)*/
        console.log("theft:")
        console.log(vis.theft)

        //calculate average distance for each crime type
        //assault
        let assault = 0
        for (let i = 0; i<vis.assault.length; i++) {
            assault += vis.assault[i].dist;
        }
        let avAssault = (assault/vis.assault.length) * 3280.839895 //converted to feet for viz
        console.log("Average dist for assault: " + avAssault)

        //injury
        let injury = 0
        for (let i = 0; i<vis.injury.length; i++) {
            injury += vis.injury[i].dist;
        }
        let avInjury = (injury/vis.injury.length) * 3280.839895 //converted to feet for viz
        console.log("Average dist for injury: " + avInjury)

        /*//fraud
        let fraud = 0
        for (let i = 0; i<vis.fraud.length; i++) {
            fraud += vis.fraud[i].dist;
        }
        let avFraud = (fraud/vis.fraud.length) * 3280.839895 //converted to feet for viz
        console.log("Average dist for fraud: " + avFraud)*/

        //theft
        let theft = 0
        for (let i = 0; i<vis.theft.length; i++) {
            theft += vis.theft[i].dist;
        }
        let avTheft = (theft/vis.theft.length) * 3280.839895 //converted to feet for viz
        console.log("Average dist for theft: " + avTheft)

        vis.crimeArray = [avAssault, avInjury, avTheft]
        console.log("Crime Distances: " + vis.crimeArray)
        vis.updateVis();
    }

    updateVis() {

        let vis = this;

        //create circles to indicate average distance of crimes from streetlight
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
                return vis.colors[i]
                })
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "3 2")

        //tooltip
        /*crimeCircles.enter()
            .append("circle")
            .attr("class", "crimeCircle")
            .on("mouseover", (event, d, i) => {
                console.log("mouseover")
                //tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                    <div style = "border: thin solid grey; background: white;">
                        <p> <b> Crime Type: </b> ${vis.labels[i]}
                        <br> <b> Average Distance: </b> ${d} </p>
                    </div>`);})
            .on("mouseout", (event, d) => {
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .merge(crimeCircles)*/

        //update y axis domain
        vis.y.domain([0, 40]);

        //call axis function
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}