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
            vis.height = 1000 - vis.margin.top - vis.margin.bottom;

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


        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barToolTip')

// (Filter, aggregate, modify data)
        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;
        vis.shootings =  document.getElementById('showShootings').value;
        vis.monthFilter =  document.getElementById('showMonth').value;
        vis.dayFilter =  document.getElementById('showDay').value;
        //filter by shootings
        if (vis.shootings ==1) {
          vis.preparedData = vis.data.filter(x => x.SHOOTING ==1)
        } else{
            vis.preparedData = vis.data
        }

        //filter by month
        if(vis.monthFilter =='all'){
            vis.preparedData = vis.preparedData
        } else{
            vis.preparedData = vis.preparedData.filter(x => x.MONTH == vis.monthFilter)
        }

        //filter by day of week
        if(vis.dayFilter =='all'){
            vis.preparedData = vis.preparedData
        } else{
            vis.preparedData = vis.preparedData.filter(x => x.DAY_OF_WEEK == vis.dayFilter)
        }


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

        vis.x.domain(['assault', 'harassment', 'fraud', 'injury/homicide', 'theft', 'kids'])

        let crimeTotals = vis.filteredData.map(x=>x.total)
        vis.y.domain([0, d3.max(crimeTotals)])

        let stacks = vis.svg.selectAll('.barGroups')
            .data(vis.filteredData)

         let stackGroups = stacks.enter()
            .append('g')
            .merge(stacks)
            .attr('class', 'barGroups')

        //draw base level bar in each group

        vis.barOne = stackGroups.append('rect')
            .attr('class', 'bar barOne')
            .attr('id', 'crime1')
            .attr('x', d=>vis.x(d.group))
            .attr('y', d=>vis.y(d.crime1_count))
            .attr('height', d => vis.height - vis.y(d.crime1_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')


        //draw second bars
        vis.barTwo = stackGroups.append('rect')
            .attr('class', 'bar barTwo')
            .attr('id', 'crime2')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+ d.crime2_count))
            .attr('height', d => vis.height - vis.y(d.crime2_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw third bars
        vis.barThree = stackGroups.append('rect')
            .attr('class', 'bar barThree')
            .attr('id', 'crime3')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count))
            .attr('height', d => vis.height - vis.y(d.crime3_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw fourth bars
        vis.barFour = stackGroups.append('rect')
            .attr('class', 'bar barFour')
            .attr('id', 'crime4')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count))
            .attr('height', d => vis.height - vis.y(d.crime4_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw fifth bars
        vis.barFive = stackGroups.append('rect')
            .attr('class', 'bar barFive')
            .attr('id', 'crime5')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count))
            .attr('height', d => vis.height - vis.y(d.crime5_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw sixth bars
        vis.barSix = stackGroups.append('rect')
            .attr('class', 'bar barSix')
            .attr('id', 'crime5')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count))
            .attr('height', d => vis.height - vis.y(d.crime6_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw seventh bars
        vis.barSeven = stackGroups.append('rect')
            .attr('class', 'bar barSeven')
            .attr('id', 'crime7')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count+d.crime7_count))
            .attr('height', d => vis.height - vis.y(d.crime7_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw eigth bars
        vis.barEight = stackGroups.append('rect')
            .attr('class', 'bar barEight')
            .attr('id', 'crime8')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count+d.crime7_count+d.crime8_count))
            .attr('height', d => vis.height - vis.y(d.crime8_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw ninth bars
        vis.barNine = stackGroups.append('rect')
            .attr('class', 'bar barNine')
            .attr('id', 'crime9')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count+d.crime7_count+d.crime8_count+d.crime9_count))
            .attr('height', d => vis.height - vis.y(d.crime9_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw tenth bars
        vis.barTen = stackGroups.append('rect')
            .attr('class', 'bar barTen')
            .attr('id', 'crime10')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count+d.crime7_count+d.crime8_count+d.crime9_count+d.crime10_count))
            .attr('height', d => vis.height - vis.y(d.crime10_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw eleventh bars
        vis.bar11 = stackGroups.append('rect')
            .attr('class', 'bar bar11')
            .attr('id', 'crime11')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count+d.crime7_count+d.crime8_count+d.crime9_count+d.crime10_count+d.crime11_count))
            .attr('height', d => vis.height - vis.y(d.crime11_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw twelfth bars
        vis.bar12 = stackGroups.append('rect')
            .attr('class', 'bar bar12')
            .attr('id', 'crime12')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count+d.crime7_count+d.crime8_count+d.crime9_count+d.crime10_count+d.crime11_count+d.crime12_count))
            .attr('height', d => vis.height - vis.y(d.crime12_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw thirteenth bars
        vis.bar13 = stackGroups.append('rect')
            .attr('class', 'bar bar13')
            .attr('id', 'crime13')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count+d.crime7_count+d.crime8_count+d.crime9_count+d.crime10_count+d.crime11_count+d.crime12_count+d.crime13_count))
            .attr('height', d => vis.height - vis.y(d.crime13_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')

        //draw fourteenth bars
        vis.bar14 = stackGroups.append('rect')
            .attr('class', 'bar bar14')
            .attr('id', 'crime14')
            .attr('x', d=> vis.x(d.group))
            .attr('y', d=> vis.y(d.crime1_count+d.crime2_count+ d.crime3_count+d.crime4_count+d.crime5_count+d.crime6_count+d.crime7_count+d.crime8_count+d.crime9_count+d.crime10_count+d.crime11_count+d.crime12_count+d.crime13_count+d.crime14_count))
            .attr('height', d => vis.height - vis.y(d.crime14_count))
            .attr('width', vis.x.bandwidth())
            .attr('fill', 'black')
            .attr('stroke', 'white')


        stackGroups.exit().remove()
        vis.svg.select(".y-axis")
            .call(vis.yAxis)

        vis.svg.select(".x-axis")
            .call(vis.xAxis)

        //tool tip actions
        d3.selectAll('.bar').on("mouseover", function (event, d) {
            vis.data.forEach(crime => {
                if (crime.OFFENSE_CODE === d[this.id+"_code"]) {
                   vis.crimeLabel = crime.OFFENSE_DESCRIPTION
                }})

           d3.select(this)
                .attr('fill', '#FDB750')
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                    <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                        <h3> Crime Name: ${vis.crimeLabel}</h3>
                        <h4> Crime Code: ${d[this.id+'_code']}<h3>
                        <h4> Crime Count: ${d[this.id+'_count']}<h4_
                    </div>`
        );


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
}
