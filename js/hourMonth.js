/*Creating Part 2 visualization to show crime by hour and month*/

class HourMonth {

    constructor(_parentElement, _crimeData) {
        this.parentElement = _parentElement;
        this.crimeData = _crimeData;

        this.initVis();
    }

    initVis() {

        let vis = this;

        vis.wrangleData();
    }

    wrangleData() {

        let vis = this

        vis.updateVis();

    }

    updateVis() {

        let vis = this;

    }


}