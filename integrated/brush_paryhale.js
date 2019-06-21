
function my_slider() {

    var slider_menu = [
	{
	title: 'Collapse all cells',
    action: function(d, i) 
                {depth_collapse(d)}
	},
    {
	title: 'Expand all cells',
    action: function(d, i) 
                {depth_expanse(d)}
	},
    {
	title: 'Show clones from these depth',
    action: function(d,i) 
        {console.log("I have clicked in level "+ d)
        Tcount = 0;
        depth_mark(d);
        div.transition()		
                .duration(0)		
                .style("opacity", .9)
                .text(Tcount+' daughters')
                .style("left", (d3.event.pageX - 50 ) + "px")	
                .style("top", (d3.event.pageY - 48) + "px");
            update(d) 
        console.log("Total cells "+ Tcount)
        }
    }
];

    
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
                  function(d) { return "translate(" + (x(d)+5) + "," + 2 + ")"; })
            .on('click', d3.contextMenu(slider_menu));
//            .on('click', click);

    
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

  // Toggle children on click.
  function slider_click(d) {
    console.log("I have clicked in level "+ d)};


}
 
var ci;

// -- functions

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
    }

 function depth_collapse(d){
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.did)});
    var depths2 = yyy.filter( onlyUnique );
     console.log(depths2)
    depths2.forEach(function(d,i) 
        {
        ci = i;
        var D = d; console.log(D);
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d)
                  {collapse(d);
                  console.log("clicked in ith element :",ci)});

        });
     update(root);
 }
function depth_expanse(d){
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.did)});
    var depths2 = yyy.filter( onlyUnique );
     console.log(depths2)
    depths2.forEach(function(d,i) 
        {
        ci = i;
        var D = d; console.log(D);
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d)
                  {expand(d);
                  console.log("clicked in ith element :",ci)});

        });
     update(root);
 }

function depth_mark(d){
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.did)});
    var depths2 = yyy.filter( onlyUnique );
    console.log(depths2);
    
    depths2.forEach(function(d,i)
        {
        ci = i;
        var D = d;
   //     console.log("looking for #"+D)
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d) {count_leaves2(d)})
        
        nn.select("circle")
            .transition()	
            .duration(500)
            .style("fill", color(ci))
            .style("fill-opacity", 0.8)
            .style("stroke", function(c) 
                   { return ci <10 ? "blue" : "green"})
            .attr("r", 6);
    
        
        });
}



var color  = d3.scaleOrdinal(d3.schemeCategory10);
