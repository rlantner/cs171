class StackedBarVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.filteredData = this.data;
        this.initVis();
    }

    initVis() {
        let vis = this
        vis.margin = { top: 20, right: 0, bottom: 200, left: 140 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
            vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        //scales and axes
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.4)

        vis.y = d3.scaleLinear()
            .domain([0, 7000])
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
        vis.color = d3.scaleOrdinal()
            .domain(["assault", 'kids', 'theft', 'harassment', 'fraud', 'injury/homicide'])
            .range(['#0fbecc', '#8b3c3e', '#1c3256', '#26d9bf', '#5e3d1e', '#c9f73c'])

// (Filter, aggregate, modify data)
        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;
        //console.log(vis.data)
        vis.filteredData = [];

        let crimeByCat = d3.group(vis.data, d=>d['Crime Category'])
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
            }
            vis.filteredData.push(summaryObj)


           //x.value.forEach(


           // )




        }
        )
       /*let crimeByCODE = d3.group(vis.data, d=>d['OFFENSE_CODE'])
        let crimesByCode = Array.from(crimeByCODE,([key,value]) => ({key, value}))
        //console.log(crimesByCode)

        crimesByCode.forEach(x => {
            console.log(x.value)
            let assault= 0;
            let theft=0;
            let kids =0;
            let fraud =0;
            let harass=0;
            let injHom = 0;
            x.value.forEach(element => {
                if (element['Crime Category'] === 'assault'){
                    assault +=1
                } if (element['Crime Category'] === 'kids') {
                     kids += 1
                }if (element['Crime Category'] === 'theft'){
                    theft +=1
                } if (element['Crime Category'] === 'harassment'){
                    harass +=1
                } if (element['Crime Category'] === 'injury/homicide'){
                    injHom +=1
                } if (element['Crime Category'] === 'fraud') {
                    fraud += 1
                }})

            //method 1
            vis.filteredData.push({
                offense: x.key,
                assaults: assault,
                kids: kids,
                thefts: theft,
                harassments: harass,
                injuriesHomicides: injHom,
                frauds: fraud
                })
            })

        //method 2
        /*let placeHolder = {};
        placeHolder['offense'] = x.key

        if (assault !=0) {
            placeHolder['assaults'] = assault
        }if (kids !=0) {
            placeHolder['kids'] = kids
        } if (theft !=0) {
            placeHolder['thefts'] = theft
        } if (harass !=0) {
            placeHolder['harassments'] = harass
        }  if (injHom !=0) {
            placeHolder['injuriesHomicides'] = injHom
        } if (fraud !=0) {
            placeHolder['frauds'] = fraud
        }

        vis.filteredData.push(placeHolder)
    })*/


    vis.updateVis();
    }

    updateVis(){

        let vis = this;

        vis.stackedData = vis.stack(vis.filteredData)
       //console.log(vis.filteredData)
        //console.log(vis.stackedData)

        vis.x.domain(["assaults", 'kids', 'thefts', 'harassments', 'frauds', 'injuriesHomicides' ])

      vis.groups = vis.svg.append('g')
          .selectAll('g')
          .data(vis.stackedData)
          .enter()
          .append('g')

        vis.groups.selectAll('rect')
           .data(d=>d)
           .enter()
           .append('rect')
           .attr('x', (d,index) => index *50)
          .attr('y', d => vis.y(d[1]))
           .attr('width', vis.x.bandwidth())
           .attr('height', d=> vis.y(d[0]) - vis.y(d[1]))
            .attr('fill', d => vis.color(d.data.group))

    }
}
