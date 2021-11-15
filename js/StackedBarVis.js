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
       let crimeByCODE = d3.group(vis.data, d=>d['OFFENSE_CODE'])
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
