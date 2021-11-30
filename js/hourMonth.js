/*Creating Part 2 visualization to show crime by hour and month*/

class HourMonth {

    constructor(_parentElement, _crimeData, _sunPosition) {
        this.parentElement = _parentElement;
        this.crimeData = _crimeData;
        this.sunPosition = _sunPosition;
        this.displayData = [];

        this.initVis();
    }

    initVis() {

        let vis = this;

        // vis dimensions are slightly different because first instance contains legend
        if (vis.parentElement === "crime-hour-month-1") {
            vis.margin = {top: 160, right: 50, bottom: 40, left: 70};
            vis.height = 600 - vis.margin.top - vis.margin.bottom;
        } else {
            vis.margin = {top: 60, right: 50, bottom: 40, left: 70};
            vis.height = 500 - vis.margin.top - vis.margin.bottom;
        }
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        console.log(vis.crimeData);

        // x & y scales
        vis.x = d3.scaleLinear()
            .domain(d3.extent(vis.sunPosition, d => {return d.hour}))
            .range([0, vis.width]);

        vis.y = d3.scaleBand()
            .domain(["December","November","October","September","August","July","June","May","April","March","February","January"])
            .range([vis.height, 0])
            .paddingInner(0.75);

        // x labels - mod function to show every 4 hours
        vis.xLabels = vis.svg.selectAll(".xlabel")
            .data([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])
            .enter()
            .append("text")
            .attr("class","xLabel")
            .attr("x", d => vis.x(d+1))
            .attr("y", 5)
            .attr("opacity", function(d) {
                if (d%4 === 0) {
                    return "1"
                } else {
                    return "0"
                }
            })
            .text(function(d) {
                if (d === 0) {
                    return '12AM'
                } else if (d < 12) {
                    return d + 'AM'
                } else if (d === 12) {
                    return '12PM'
                } else {
                    return d - 12 + 'PM'
                }
            });

        // y labels - show every month
        vis.yLabels = vis.svg.selectAll(".yLabel")
            .data(["December","November","October","September","August","July","June","May","April","March","February","January"])
            .enter()
            .append("text")
            .attr("class","yLabel")
            .attr("x", 0)
            .attr("y", d => vis.y(d) + 35)
            .text(d => d);

        // chart titles
        if (vis.parentElement === "crime-hour-month-1") {
            vis.svg.append('text')
                .attr("class", "h6")
                .attr("x", -50)
                .attr("y", -30)
                .text("Assaults, Injuries, and Homicides")
        } else {
            vis.svg.append('text')
                .attr("class", "h6")
                .attr("x", -50)
                .attr("y", -30)
                .text("Shootings")
        }


        // Append tooltips
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'bubbleTooltip');


        // Append legend on first instance
        if (vis.parentElement === "crime-hour-month-1") {

            // number of crimes legend
            var sizeLegendCircles = vis.svg.selectAll(".sizeLegendCircle")
                .data([0,1,2]);

            sizeLegendCircles.enter()
                .append("circle")
                .attr("class", "sizeLegendCircle")
                .attr("cx", d => vis.width*(1/3) + d*22)
                .attr("cy", -(vis.margin.top - 20))
                .attr("r", d => d*3 + 5)
                .attr("fill", "lightgrey")
                .attr("transform", "translate(30,30)");

            var sizeLegendText = vis.svg.selectAll(".sizeLegendText")
                .data([0]);

            sizeLegendText.enter()
                .append("text")
                .attr("class", "sizeLegendText")
                .attr("x", vis.width*(1/3) + 70)
                .attr("y", -(vis.margin.top - 25))
                .text("Number of Crimes")
                .attr("transform", "translate(30,30)");


            // sunlight color legend
            var colorLegendCircles = vis.svg.selectAll(".colorLegendCircle")
                .data([0,1,2]);

            colorLegendCircles.enter()
                .append("circle")
                .attr("class", "colorLegendCircle")
                .attr("cx", vis.width*(3/4))
                .attr("cy", d => -(vis.margin.top) + d*22)
                .attr("r", 8)
                .attr("fill", function(d) {
                    if (d === 0) {
                        return "gold"
                    } else if (d === 1) {
                        return "orange"
                    } else {
                        return "navy"
                    }
                })
                .attr("transform", "translate(30,30)");


            var colorLegendText = vis.svg.selectAll(".colorLegendText")
                .data([0,1,2]);

            colorLegendText.enter()
                .append("text")
                .attr("class", "colorLegendText")
                .attr("x", vis.width*(3/4) + 15)
                .attr("y", d => -(vis.margin.top - 5) + d*22)
                .text(function(d) {
                    if (d === 0) {
                        return "Day"
                    } else if (d === 1) {
                        return "Sunrise & Sunset"
                    } else {
                        return "Night"
                    }
                })
                .attr("transform", "translate(30,30)");

        }


            vis.wrangleData();

    }

    wrangleData() {

        let vis = this;

        // filter by whatever you want to filter
        // vis.filteredData = vis.crimeData;

        console.log(vis.parentElement);

        if (vis.parentElement === "crime-hour-month-1") {
            vis.filteredData = vis.crimeData.filter(function(d) {
                return d.YEAR >= 2016 && d.YEAR <= 2018 && (d["Crime Category"] === "assault" || d["Crime Category"] === "injury/homicide")
            })
        } else {
            vis.filteredData = vis.crimeData.filter(function(d) {
                return d.YEAR >= 2016 && d.YEAR <= 2018 && d.SHOOTING === 1
            })
        }

        console.log(vis.filteredData);

        // group crime data by month and hour
        // tuple array format: [month, hour, count]
        vis.crimeByMonthHour = d3.flatRollup(vis.filteredData, v => v.length, d => d.MONTH, d => d.HOUR);

        console.log(vis.crimeByMonthHour);
        console.log(vis.sunPosition);

        vis.displayData = [];

        // merge data
        vis.sunPosition.forEach(monthHour => {
            vis.crimeByMonthHour.forEach(d => {

                //console.log(monthHour);
                //console.log(d);

                if (monthHour.month_number === d[0] && monthHour.hour === d[1]) {

                    vis.displayData.push(
                        {
                            month_text: monthHour.month_text,
                            month_number: monthHour.month_number,
                            hour: monthHour.hour,
                            sun_position: monthHour.sun_position,
                            crime_count: d[2]
                        }
                    )

                }

            })
        })

        console.log(vis.displayData);

        vis.updateVis();

    }

    updateVis() {

        let vis = this;

        // sunlight rectangles
        var sunlightRects = vis.svg.selectAll(".sunlightRect")
            .data(vis.sunPosition);

        sunlightRects.exit().remove();

        sunlightRects.enter()
            .append("rect")
            .attr("class", "sunlightRect")
            .merge(sunlightRects)
            .attr("x", d => vis.x(d.hour) - (vis.width/24 + 2)/2)
            .attr("y", d => vis.y(d.month_text) - 2)
            .attr("width", vis.width/24 + 2)
            .attr("height", 4)
            .attr("fill", function(d) {
                if (d.sun_position === 'day') {
                    return "gold"
                } else if (d.sun_position === 'night') {
                    return "navy"
                } else {
                    return "orange"
                }
            })
            .attr("transform", "translate(30,30)");


        // circle radius scale
        vis.rScale = d3.scaleLinear()
            .domain(d3.extent(vis.displayData, d => {return d.crime_count}))
            .range([3,10]);

        // crime circles
        var crimeCircles = vis.svg.selectAll(".crimeCircle")
            .data(vis.displayData);

        crimeCircles.exit().remove();

        crimeCircles.enter()
            .append("circle")
            .attr("class", "crimeCircle")
            .on("mouseover", (event, d) => {

                d3.select(event.currentTarget)
                    .transition()
                    .attr("fill", function(d) {
                        if (d.sun_position === 'day') {
                            return "gold"
                        } else if (d.sun_position === 'night') {
                            return "navy"
                        } else {
                            return "orange"
                        }
                    })
                    .attr("r", 12);

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; background: white;">
                             <p> <b>Month:</b> ${d.month_text}     
                             <br> <b>Hour:</b> ${d.hour}
                             <br> <b>Crimes:</b> ${d.crime_count}</p>   
                         </div>`);
            })
            .on("mouseout", (event, d) => {

                d3.select(event.currentTarget)
                    .transition()
                    .attr("fill","white")
                    .attr("r", d => vis.rScale(d.crime_count));

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .merge(crimeCircles)
            .attr("cx", d => vis.x(d.hour))
            .attr("cy", d => vis.y(d.month_text))
            .attr("r", d => vis.rScale(d.crime_count))
            .attr("fill", "white")
            //.attr("fill", "white")
            .attr("stroke-width","2")
            .attr("stroke", function(d) {
                if (d.sun_position === 'day') {
                    return "gold"
                } else if (d.sun_position === 'night') {
                    return "navy"
                } else {
                    return "orange"
                }
            })
            .attr("transform", "translate(30,30)");




    }


}