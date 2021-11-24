class StackedBarVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = [];
        this.initVis();
    }

    initVis() {
        let vis = this
        vis.margin = { top: 20, right: 0, bottom: 200, left: 140 };

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

// Axis title
       /* vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Crime Group");*/

        vis.stack = d3.stack()
            .keys(["crime1_count", 'crime2_count', 'crime3_count', 'crime4_count', 'crime5_count', 'crime6_count',
            'crime7_count', 'crime8_count', 'crime9_count', 'crime10_count', 'crime11_count', 'crime12_count',
               'crime13_count', 'crime14_count'])

        //color scale
       /* vis.color = d3.scaleOrdinal()
            .domain(["assault", 'kids', 'theft', 'harassment', 'fraud', 'injury/homicide'])
            .range(['#0fbecc', '#8b3c3e', '#1c3256', '#26d9bf', '#5e3d1e', '#c9f73c'])*/

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barToolTip')

// (Filter, aggregate, modify data)
        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;
        vis.filteredData=[];
        vis.selectedYear =  document.getElementById('yearSelector').value;

        if (vis.selectedYear !== "all") {
            vis.selectedYear = +vis.selectedYear
        }


        //console.log(vis.data)
        vis.desiredYearsfilteredData = vis.data.filter(x=> (x.YEAR <= 2018) && (x.YEAR >2015))

        if (vis.selectedYear === 'all'){
            vis.finalfilteredData = vis.desiredYearsfilteredData
        } else{
            vis.finalfilteredData = vis.desiredYearsfilteredData.filter(x => x.YEAR===vis.selectedYear)
        }

        let crimeByCat = d3.group(vis.finalfilteredData, d=>d['Crime Category'])
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

        vis.stackedData = vis.stack(vis.filteredData)
       //console.log(vis.filteredData)
        console.log(vis.stackedData)

        vis.barNames = vis.filteredData.map(x => x.group)
        vis.y.domain([0, d3.max(vis.filteredData.map(x=>x.total))])
        vis.x.domain(vis.barNames)

      vis.groups = vis.svg.append('g')
          .selectAll('g')
          .data(vis.stackedData)
          .enter()
          .append('g')
          .attr('class', 'barGroups')

        vis.bars = vis.groups.selectAll('rect')
           .data(d => d)

           vis.bars.enter()
           .append('rect')
            .merge(vis.bars)
           .transition()
            .attr('class', 'bar')
           .attr('x', d=>vis.x(d.data.group))
          .attr('y', d => vis.y(d[1]))
           .attr('width', vis.x.bandwidth())
           .attr('height', d=> vis.y(d[0]) - vis.y(d[1]))
            .attr('fill', "linen")
            .attr("stroke", "black")


        vis.bars.exit().remove();
        vis.svg.select(".y-axis")
            .call(vis.yAxis)

        vis.svg.select(".x-axis")
            .call(vis.xAxis)

        //tool tip actions
        d3.selectAll('.bar').on("mouseover", function (event, d) {
            let keys = Object.keys(d.data)
            keys.forEach(x=> {
                if (d.data[x] === d[1] - d[0]) {
                    vis.count = d.data[x]
                    vis.crimeNum = x.split('_')[0]
                    //console.log(d.data[vis.crimeNum+"_code"])
                }})

            vis.data.forEach(crime => {
                if (crime.OFFENSE_CODE === d.data[vis.crimeNum+"_code"]) {
                   vis.crimeLabel = crime.OFFENSE_DESCRIPTION
                }
            })
            //console.log(d)
           d3.select(this)
                .attr('fill', 'black')
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h3> Crime Name: ${vis.crimeLabel}</h3>
                        <h4> Crime Code: ${d.data[vis.crimeNum+"_code"]}<h3>
                        <h4> Crime Count: ${vis.count}
                    </div>`
        );

                /*.html(`
                    <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                         <h3> ${d.}<h3>
                        <h4> Population: ${d.population}</h4>
                         <h4> Cases (absolute): ${d.absCases}</h4>
                         <h4> Deaths (absolute): ${d.absDeaths}</h4>
                         <h4> Cases (relative): ${(d.relCases).toFixed(2)+"%"}
                         <h4> Deaths (relative): ${(d.relDeaths).toFixed(2) + "%"}
                    </div>`);*/
        })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr("fill", "linen")

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

    }
}
