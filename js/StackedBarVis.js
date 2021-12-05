class StackedBarVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = this.data;
        this.initVis();
    }

    initVis() {
        let vis = this
        vis.margin = { top: 50, right: 0, bottom: 200, left: 140 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 600 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        //scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.2)

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

// Chart title
       vis.svg.append("text")
            .attr('class', 'title')
            .attr("x", 150)
            .attr("y", -20)
            .text("Crime Break Downs By Group");
//Axis Title
        vis.svg.append('text')
            .attr('class', 'x-title')
            .attr('x', 225)
            .attr('y', vis.height+40)
            .text("Crime Group");
//Axis Title
        vis.svg.append('text')
            .attr('class', 'y-title')
            .attr('x', 0)
            .attr('y', 0)
            .attr('transform', 'rotate(-90) translate(-250, -55)')
            .text('Count of Crimes')

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barToolTip')

// (Filter, aggregate, modify data)
        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;
        vis.yearFilter =  document.getElementById('showYear').value;
        vis.dayFilter =  document.getElementById('showDay').value;

        //filter by shootings
        if (document.getElementById('showShootings').checked) {
            //console.log('I am checked')
            vis.preparedData = vis.displayData.filter(x => x.SHOOTING ==1)
        } else{
            vis.preparedData = vis.displayData
        }

        //filter by Year
        if(vis.yearFilter =='all'){
            vis.preparedData = vis.preparedData
        } else{
            vis.preparedData = vis.preparedData.filter(x => x.YEAR == vis.yearFilter)
        }
        //filter by day of week
        if(vis.dayFilter =='all'){
            vis.preparedData = vis.preparedData
        } else{
            vis.preparedData = vis.preparedData.filter(x => x.DAY_OF_WEEK == vis.dayFilter)
        }

        //console.log(vis.preparedData)
        vis.filteredData=[];
        let crimeByCat = d3.group(vis.preparedData, d=>d['Crime Category'])
        let crimeCatObj = Array.from(crimeByCat,([key,value]) => ({key, value}))
        //console.log(crimeCatObj)


        crimeCatObj.forEach(x => {
            let offense_codes = x.value.map(element => element['OFFENSE_CODE'])
            let cleanCodes = offense_codes.filter((item, index) => offense_codes.indexOf(item) === index); //inspo https://www.samanthaming.com/tidbits/43-3-ways-to-remove-array-duplicates/
            //console.log(cleanCodes.length)

            if (x.key === 'assault') {
                cleanCodes.push('0')
            }
            if(x.key === 'fraud') {
                cleanCodes.push('0', '0', '0', '0', '0', '0', '0', '0', '0', '0')
            }

            if(x.key === 'kids') {
                cleanCodes.push('0', '0', '0', '0', '0', '0', '0', '0', '0')
            }
            if(x.key === 'injury/homicide') {
                cleanCodes.push('0', '0', '0', '0')
            }
            if(x.key === 'harassment') {
                cleanCodes.push('0', '0', '0', '0')
            }

            let crime1_count = 0;
            let crime2_count = 0;
            let crime3_count =0;
            let crime4_count = 0;
            let crime5_count =0;
            let crime6_count =0;
            let crime7_count = 0;
            let crime8_count = 0;
            let crime9_count =0;
            let crime10_count = 0;
            let crime11_count = 0;
            let crime12_count =0;
            let crime13_count =0;
            let crime14_count =0;








            x.value.forEach(crime => {
                if (crime['OFFENSE_CODE'] === cleanCodes[0]){
                    crime1_count +=1
                }
                if (crime['OFFENSE_CODE'] === cleanCodes[1]){
                    crime2_count +=1
                }
                if (crime['OFFENSE_CODE'] === cleanCodes[2]){
                    crime3_count +=1
                }
                if (crime['OFFENSE_CODE'] === cleanCodes[3]){
                    crime4_count +=1
                }
                if (crime['OFFENSE_CODE'] === cleanCodes[4]){
                    crime5_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[5]){
                    crime6_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[6]){
                    crime7_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[7]){
                    crime8_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[8]){
                    crime9_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[9]){
                    crime10_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[10]){
                    crime11_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[11]){
                    crime12_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[12]){
                    crime13_count +=1
                } if (crime['OFFENSE_CODE'] === cleanCodes[13]){
                    crime14_count +=1
                }

            })

            let summaryObj = {
                group: x.key,
                crime1_code: cleanCodes[0],
                crime1_count:crime1_count,
                crime2_code:cleanCodes[1],
                crime2_count:crime2_count,
                crime3_code:cleanCodes[2],
                crime3_count:crime3_count,
                crime4_code:cleanCodes[3],
                crime4_count:crime4_count,
                crime5_code:cleanCodes[4],
                crime5_count:crime5_count,
                crime6_code:cleanCodes[5],
                crime6_count:crime6_count,
                crime7_code:cleanCodes[6],
                crime7_count:crime7_count,
                crime8_code:cleanCodes[7],
                crime8_count:crime8_count,
                crime9_code:cleanCodes[8],
                crime9_count:crime9_count,
                crime10_code:cleanCodes[9],
                crime10_count:crime10_count,
                crime11_code:cleanCodes[10],
                crime11_count:crime11_count,
                crime12_code:cleanCodes[11],
                crime12_count:crime12_count,
                crime13_code:cleanCodes[12],
                crime13_count:crime13_count,
                crime14_code:cleanCodes[13],
                crime14_count:crime14_count,
                total: crime1_count+crime2_count+crime3_count+crime4_count+crime5_count+crime6_count+crime7_count+crime8_count
                +crime9_count+crime10_count+crime11_count+crime12_count+crime13_count+crime14_count
            }
            vis.filteredData.push(summaryObj)


        }
        )

        console.log(vis.filteredData)


    vis.updateVis();
    }

    updateVis(){

        let vis = this;

        d3.selectAll('g.bar').remove(); //clears bars so that only desired new ones will be drawn

        //set x domain
        vis.x.domain(vis.filteredData.map(x=>x.group))

        //set y domain
        let crimeTotals = vis.filteredData.map(x=>x.total)
        vis.y.domain([0, d3.max(crimeTotals)])

        //draw the bars
        let bars = vis.svg.selectAll('g.bar').data(vis.filteredData, d=>d.group)

        //creates a bar for each crime type
        let barsEnter = bars.enter()
            .append('g')
            .attr('class', 'bar')
            .attr('class', d=>  `bar bar-${d.group}`)

        barsEnter
            .merge(bars)
            .transition()
            .attr('transform', d=> `translate(${vis.x(d.group)},0)`); //move bars to align wuth axis

        vis.svg.selectAll('g.bar').data(vis.filteredData, d=>d.group).exit().remove();
        //bars.exit().transition().remove();

        let rects =
            barsEnter
                .selectAll('rect.crime')
                .data(function(d) {
                    let codesAndCounts = [];
                    let lastCount = 0;
                    for (let i = 1; i <= 14; i++) {
                        codesAndCounts.push({
                            code: d[`crime${i}_code`],
                            count: d[`crime${i}_count`],
                            lastCount
                        });
                        lastCount += d[`crime${i}_count`];
                    }
                    //console.log(codesAndCounts)
                    return codesAndCounts;
                });
        rects.exit().remove();

       rects.enter()
            .append("rect")
            .attr("class", "crime")
            .attr("class", (d, i) => `crime crime${i}`)
            .attr("fill", "black")
            .attr("stroke", "deepskyblue")
            .attr('stroke-width', 2)

            .merge(rects)
           .transition()
            .attr("y", d => {
                //console.log(d)
                //console.log(d.count+d.lastCount)
                return vis.y(d.count +d.lastCount)
            })
            .attr("width",vis.x.bandwidth())
            .attr("height", d => vis.height - vis.y(d.count));

       //call axes
        vis.svg.select(".y-axis")
            .call(vis.yAxis)

        vis.svg.select(".x-axis")
            .call(vis.xAxis)

        //tool tip actions
        d3.selectAll('.crime').on("mouseover", function (event, d) {
            //console.log(d)
            vis.data.forEach(crime => {
                if (crime.OFFENSE_CODE === d.code) {
                   vis.crimeLabel = crime.OFFENSE_DESCRIPTION
                }})

          d3.select(this)
                .attr('fill', 'orange')
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                         <div style="border: thin solid grey; background: white;">
                             <p> <b>Crime Name:</b> ${vis.crimeLabel}
                             <br> <b>Crime Code:</b> ${d.code}
                             <br> <b>Crime Count:</b> ${d.count}</p>
                         </div>`);


       })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr("fill", "black")

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

    }
    selectionChanged(brushRegion) {
        let vis = this;

        // Filter data accordingly without changing the original data


        // * TO-DO *
        // Filter data accordingly without changing the original data
        // * TO-DO *
        let startDate = brushRegion[0]
        let endDate = brushRegion[1]
        vis.displayData = vis.data.filter(item => {
            if (item.MONTH >= startDate && item.MONTH<=endDate){
                return item.MONTH
            }});

        //console.log(vis.displayData)
        //console.log(brushRegion)

        // Update the visualization
        vis.wrangleData();
    }
}
