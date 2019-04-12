
function my_slider() {

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

 function depth_click(d){
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.id)});
    var depths2 = yyy.filter( onlyUnique );

    depths2.forEach(function(d,i) 
        {
        ci = i;
        var D = d.toUpperCase();
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d)
                  {click(d);
                  console.log("clicked in ith element :",ci)});
        nn.select("circle")
            .transition()	
            .duration(2000).style("fill", "red");
        });
 }

function depth_expand(d){
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.id)});
    var depths2 = yyy.filter( onlyUnique );

    depths2.forEach(function(d,i)
        {
        ci = i;
        var D = d.toUpperCase();
   //     console.log("looking for #"+D)
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d) 
              {//click(d)
              //expand(d)  
                div.transition()		
                    .duration(0)		
                    .style("opacity", .9)
                    .text(rnd_count_leaves(d)+' daughters')
                    .style("left", (d3.event.pageX + 10 ) + "px")	
                    .style("top", (d3.event.pageY - 28) + "px");
                update(d) 
              });
        nn.select("circle")
            .transition()	
            .duration(2000)
            .style("fill", color(ci))
            .style("fill-opacity", 0.8)
            .style("stroke", color(ci))
            .attr("r", 8);
        });
    //return depths;    
}



var color  = d3.scaleOrdinal(d3.schemeCategory10);

function rnd_count_leaves(d){
    expand(d);
    //count = 0;
    if(d.children){   //go through all its children
        for(var ii = 0; ii<d.children.length; ii++){
            expand(d.children[ii])          
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[ii].children){
                rnd_count_leaves(d.children[ii]);
                 var xx = "#"+d.children[ii].data.id;
                 d3.selectAll("#area2").select(xx.toUpperCase())
                     .attr('opacity', 10).attr('fill-opacity', 1).attr("fill",color(ci));
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
                }
            //if not then it is a leaf so we count it
            else{count++;
                 var xx = "#"+d.children[ii].data.id;
                 d3.selectAll("#area2").select(xx.toUpperCase())
                    .attr('opacity', 10).attr('fill-opacity', 1).attr("fill", color(ci));
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
                 d3.selectAll("#area1").select("circle").select(xx.toUpperCase())
                     .style("fill", color(ci)).style("fill-opacity", 0.8).style("stroke", color(ci));
           //      console.log(count + " " + xx.toUpperCase())
                }
            }
        }
 //   d.children.forEach(collapse);
//    update(root);

    //return(count);
    }        

function rnd_count_subleaves(d){;
        for(var jj = 0; jj<d.children.length; jj++){
            expand(d.children[jj])
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[jj].children){
                rnd_count_leaves(d.children[jj]);
                var xx = "#"+d.children[jj].data.id;
                d3.selectAll("#area2").select(xx.toUpperCase())
                    .attr('opacity', 10).attr('fill-opacity', 1).attr("fill", color(ci));
                d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
                }
            //if not then it is a leaf so we count it
            else{count++;
                 var xx = "#"+d.children[jj].data.id;
                 d3.selectAll("#area2").select(xx.toUpperCase())
                    .attr('opacity', 10).attr('fill-opacity', 1).attr("fill", color(ci));
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
                 d3.selectAll("#area1").select("circle").select(xx.toUpperCase())
                     .style("fill", color(ci)).style("fill-opacity", 0.8).style("stroke", color(ci));

                 //      console.log(count + " " + xx.toUpperCase())
                }
            }
    }        
    