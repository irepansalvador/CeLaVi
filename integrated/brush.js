
function my_slider() {

    
    // get the depths of the tree to plot the slider
    var mm = [];
//    var m = Math.max.apply(null, depths);
//    depths.forEach(function(d) {mm.push(d/m)});
    var m = depths.length;
    depths.forEach(function(d) {mm.push(d)});

    var slider_svg = d3.select("#slider")
        .classed("svg-container-slider", true) //container class to make it responsive
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 100 4")
        .classed("svg-content-responsive", true)
        .append("g");
    
    var www = d3.select("#slider").selectAll("svg")
          // get the width of div element
          .style('width')
          // take of 'px'
          .slice(0, -2);
    var hhh = d3.select("#slider").selectAll("svg")
          // get the width of div element
          .style('height')
          // take of 'px'
          .slice(0, -2);

var x = d3.scaleLinear().range([0,  95/m]);
var y = d3.randomNormal(hhh/15, 0);

    
    // Update the nodes...
  var slider_node = slider_svg.selectAll('g')
      .data(mm, function(d) 
            {return d});

  // Enter any new modes at the parent's previous position.
  var slidernodeEnter = slider_node.enter()
            .append('g')
            .attr("id",  function(d) {return d})
            .attr('class', 'node')
            .attr('cursor', 'pointer')
            .attr("transform", 
                  function(d) { return "translate(" + (x(d)+5) + "," + 2 + ")"; });

    
    // Add Circle for the nodes
  slidernodeEnter.append('circle')
      .attr('class', 'node')
      .style("fill", "purple")
      .style('stroke-width', 0.1)
      .style("stroke", "purple")
      .attr('r', 1.2);
    
     // Text when adding nodes 
  slidernodeEnter.append('text')
      .attr("dy", ".4em").attr("dx",".5em")
      .attr("text-anchor", "end")
      .attr("font-size", "1.2px")
      .attr('fill', 'white')
      .attr("font-family", "sans serif")
      .text(function(d) {return d});


    
}
