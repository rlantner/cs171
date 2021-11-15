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
            .paddingInner(0.2)

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
        vis.svg.append("text")
            .attr("x", -50)
            .attr("y", -8)
            .text("Crime Group");

        vis.stack = d3.stack()
            .keys(["assaults", 'kids', 'thefts', 'harassments', 'frauds', 'injuriesHomicides' ])

// (Filter, aggregate, modify data)
        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;
        console.log(vis.data)
        vis.filteredData = [];

        let crimeByCat = d3.group(vis.data, d=>d['Crime Category'])
        let crimeCatObj = Array.from(crimeByCat,([key,value]) => ({key, value}))
        //console.log(crimeCatObj)

        let assaults = [404, 803, 402, 403, 413, 423, 432, 801, 802, 1620, 400, 800, 2647]
        let thefts = [511, 522, 527, 520, 521, 522, 2010, 611, 612, 301, 215, 338, 339, 371, 381]
        let harassments = [2611, 2407, 2670, 2604, 2629, 2670, 3170, 804, 2006, 2007, 2671]
        let kids = [2003, 2004, 2005, 2664, 2622]
        let fraud =   [1102, 1106, 1107, 1109]
        let injuryHomicide = [3170, 3016, 112, 3803, 3810, 3820, 3830, 123, 121, 111, 2628]

        crimeCatObj.forEach(x => {
            let offense_codes = x.value.map(element => element['OFFENSE_CODE'])
            let cleanCodes = offense_codes.filter((item, index) => offense_codes.indexOf(item) === index); //inspo https://www.samanthaming.com/tidbits/43-3-ways-to-remove-array-duplicates/
           console.log(cleanCodes)

            let summaryObj = {
                crime1_code: cleanCodes[0],
                crime1_count:0,
                crime2_code:'',
                crime2_count:0,
                crime3_code:'',
                crime3_count:0,
                crime4_code:'',
                crime4_count:0,
                crime5_code:'',
                crime5_count:0,
                crime6_code:'',
                crime6_count:0,
                crime7_code:'',
                crime7_count:0,
                crime8_code:'',
                crime8_count:0,
                crime9_code:'',
                crime9_count:0,
                crime10_code:'',
                crime10_count:0,
                crime11_code:'',
                crime11_count:0,
                crime12_code:'',
                crime12_count:0,
                crime13_code:'',
                crime13_count:0,
                crime14_code:'',
                crime14_count:0,
                crime15_code:'',
                crime15_count:0,
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
        console.log(vis.filteredData)
        console.log(vis.stackedData)

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
           .attr('fill', 'black')
           .attr('x', (d,index) => index *50)
          .attr('y', d => vis.y(d[1]))
           .attr('width', vis.x.bandwidth())
           .attr('height', d=>vis.y(d[0])-vis.y(d[1]))

    }
}
