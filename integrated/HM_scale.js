
function MAKE_HMscale() {
/*

    var slider_menu = [
	{
	title: 'Click all cells',
    action: function(d, i) 
                {depth_click(d)}
	},
    {
	title: 'Collapse at this depth',
//    action: function(d, i) {}
	},
    {
	title: 'Show clones from these depth',
    action: function(d,i) 
        {//console.log("I have clicked in level "+ d)
        count = 0;
        depth_expand(d);
        div.transition()		
                .duration(0)		
                .style("opacity", .9)
                .text(count+' daughters')
                .style("left", (d3.event.pageX - 50 ) + "px")	
                .style("top", (d3.event.pageY - 48) + "px");
            update(d) 
        console.log("Total cells "+ count)
        }
    }
];
*/

    
    // get the depths of the tree to plot the slider
    var mm = [];
//    var m = Math.max.apply(null, depths);
//    depths.forEach(function(d) {mm.push(d/m)});
    var m = depths.length;
    depths.forEach(function(d) {mm.push(d)});

    var slider_svg = d3.select("#HM_scale")
        .classed("svg-container-slider", true) //container class to make it responsive
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 100 4")
        .classed("svg-content-responsive", true)
        .append("g");
    
    var www = d3.select("#HM_scale").selectAll("svg")
          // get the width of div element
          .style('width')
          // take of 'px'
          .slice(0, -2);
    var hhh = d3.select("#HM_scale").selectAll("svg")
          // get the width of div element
          .style('height')
          // take of 'px'
          .slice(0, -2);

    
    
    d3.csv("./disparity.csv", function(disp2) {
        
        var myDisp = d3.map(disp2,  function(d){return d.disparity;}).keys()
        // transform the values to floating numbers
        var res = myDisp.map(function(v) {return parseFloat(v, 10);});
        // store Max and min in vars
        var dispMax = d3.max(res); var dispMin = d3.min(res);

    
    var colorScale = d3.scaleSequential(d3.interpolateYlOrBr)
        .domain([0, 10])

    var bars = slider_svg.selectAll("g")
        .data(d3.range(10), function(d) {console.log(d) ; return d; })
        .enter().append("rect")
        .attr("class", "bars")
        .attr("x", function(d, i) { return (i*5) +30; })
        .attr("y", 2)
        .attr("height", hhh/2)
        .attr("width", 5)
        .style("fill", function(d, i ) { return colorScale(d);});
    
    
    slider_svg.selectAll("g")
        .data(d3.range(2), function(d) {console.log(d) ; return d; })
        .enter().append("text")
        .attr("x", function(d, i) { return i==0 ? (50)-30 : (i*50)+30 })
        .attr("y", 2)
        .attr("dy", ".35em")
        .attr("font-size", "3px")
        .attr("font-family", "sans serif")
        .text(function(d, i) { return i==0 ? dispMin : dispMax});
;
    
        //Add SVG Text Element Attributes
      });
    }        
    