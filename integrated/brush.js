
var r_data = d3.range(50).map(Math.random);

var brush_svg = d3.select("#brush")
    .classed("svg-container-brush", true) //container class to make it responsive
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 100 4")
    .classed("svg-content-responsive-nospace", true);

var www = d3.select("#brush").selectAll("svg")
      // get the width of div element
      .style('width')
      // take of 'px'
      .slice(0, -2);
var hhh = d3.select("#brush").selectAll("svg")
      // get the width of div element
      .style('height')
      // take of 'px'
      .slice(0, -2);


var g2 = brush_svg.append("g")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

var x = d3.scaleLinear().range([0, www]),
    y = d3.randomNormal(hhh/50, hhh / 50);

var brush = d3.brushX()
    .extent([[0, 0], [www, hhh]])
    .on("start brush end", brushmoved);

var circle = g2.append("g")
    .attr("class", "circle")
    .selectAll("circle")
    .data(r_data)
    .enter().append("circle")
    .attr("transform", function(d) { return "translate(" + x(d) + "," + y() + ")"; })
    .attr("r", 1);

var gBrush = g2.append("g")
    .attr("class", "brush")
    .call(brush);

var handle = gBrush.selectAll(".handle--custom")
  .data([{type: "w"}, {type: "e"}])
  .enter().append("path")
    .attr("class", "handle--custom")
    .attr("fill", "#666")
    .attr("fill-opacity", 0.8)
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr("cursor", "ew-resize")
    .attr("d", d3.arc()
        .innerRadius(0)
        .outerRadius(hhh / 20)
        .startAngle(0)
        .endAngle(function(d, i) { return i ? Math.PI : -Math.PI; }));

gBrush.call(brush.move, [0.3, 0.5].map(x));

function brushmoved() {
  var s = d3.event.selection;
  if (s == null) {
    handle.attr("display", "none");
    circle.classed("active", false);
  } else {
    var sx = s.map(x.invert);
    circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });
    handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + hhh / 20 + ")"; });
  }
}
