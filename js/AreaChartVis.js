class AreaChartVis{

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];

        this.initVis();


    }


    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;

        vis.margin = { top: 50, right: 0, bottom: 200, left: 100};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right,
        vis.height = 600 - vis.margin.top - vis.margin.bottom;


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (vis.margin.left-25) + "," + vis.margin.top + ")");


        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        let tickLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(function(d,i){
                return tickLabels[i]
        })

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        //Chart Title
        vis.svg.append('text')
            .attr('x', 175)
            .attr('y', -20)
            .text('Crime Count By Month')


        // Append a path for the area function, so that it is later behind the brush overlay
        vis.timePath = vis.svg.append("path")
            .attr("class", "area");

        // TO-DO: Add Brushing to Chart
        //initialize brush component
        let brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush", brushed);

        //append brush component
        vis.svg.append("g")
            .attr("class", "x brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", vis.height + 7);

        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;

        // * TO-DO *

        vis.yearFilter =  document.getElementById('showYear').value;
        if (vis.yearFilter =="all"){
            vis.displayData = vis.data.filter(x=> (x.YEAR <= 2018) && (x.YEAR >2015));
        } else{
            vis.displayData = vis.data.filter(x=> x.YEAR==vis.yearFilter)
        }

        vis.dayFilter =  document.getElementById('showDay').value;
        if(vis.dayFilter =='all'){
            console.log("all")
            vis.displayData = vis.displayData
        } else{
            console.log('made it')
            vis.displayData = vis.displayData.filter(x=>x.DAY_OF_WEEK == vis.dayFilter)
        }

        //filter by shootings
        if (document.getElementById('showShootings').checked) {
            //console.log('I am checked')
            vis.displayData = vis.displayData.filter(x => x.SHOOTING ==1)
        } else{
            vis.displayData = vis.displayData
        }

        let dataByDate = d3.group(vis.displayData)
        let countDataByDate = d3.rollup(vis.displayData, leaves=>leaves.length, d=>d.MONTH)
        vis.displayData=Array.from(countDataByDate, ([key,value]) => ({key, value}))
        vis.displayData.sort((a,b) => a.key-b.key)
        console.log(vis.displayData)

        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update domain
       vis.x.domain(d3.extent(vis.displayData, function (d) {
            return d.key;
        }));

        vis.y.domain([0, d3.max(vis.displayData, function (d) {
            return d.value;
        })]);

        //console.log(vis.displayData)
        // D3 area path generator
        vis.area = d3.area()
            .curve(d3.curveCardinal)
            .x(function (d) {
                return vis.x(d.key);
            })
            .y0(vis.height)
            .y1(function (d) {
                return vis.y(d.value);
            });


        // Call the area function and update the path
        // D3 uses each data point and passes it to the area function. The area function translates the data into positions on the path in the SVG.
        vis.timePath
            .datum(vis.displayData)
            .attr("d", vis.area)
            .attr("fill", "black");


        // Update axes
        vis.svg.select(".y-axis").transition().call(vis.yAxis);
        vis.svg.select(".x-axis").transition().call(vis.xAxis);

    }
}

