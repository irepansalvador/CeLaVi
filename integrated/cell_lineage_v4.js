//Store width, height and margin in variables
var w = 1200;
var h = 1100;
var margin = {top: 20, right: 10, bottom:10, left: 50};

// Scale the width and height
var xScale = d3.scale.linear()
                .range([0,w - margin.right - margin.left]);

var yScale = d3.scale.ordinal()
                .rangeRoundBands([margin.top, h - margin.bottom],0.2);

// Creat Axes i.e. xAxis and yAxis
var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

// --- Show menu with custom functions in right click

var double_element = [];

var menu = [
	{
	title: 'Show/Expand descendants',
    action: function(d, i) {
	//	console.log('The data for this circle is: ' + d.data.did);
        expand(d)  
        div.transition()		
            .duration(0)		
            .style("opacity", .9)
            .text(count_leaves(d)+' daughters')
            .style("left", (d3.event.pageX + 10 ) + "px")	
            .style("top", (d3.event.pageY - 28) + "px");
        update(d)      
        }
	},
	{
	title: 'Collapse all',
    action: function(d, i) {
        collapse(d)
        update(d)
        }
	},
    {
	title: 'Find common ancestor',
    action: function(d, i) {
        if (double_element.length == 0){
       //     console.log('The data for this circle is: ' + d.data.id);
            yy = d.data.did.toUpperCase()
            common_anc1("#"+yy)
            div.transition()		
                .duration(0)		
                .style("opacity", .9)
                .text('R-Click on another cell')
                .style("left", (d3.event.pageX + 30 ) + "px")	
                .style("top", (d3.event.pageY - 80) + "px")
            } 
        else 
            {
             yy = d.data.did.toUpperCase()
            common_anc2("#"+yy)
//            console.log('Second circle is: ' + yy);
            double_element = [];
            }
        }
    }
];


/*--- Json option --*/

d3.json("json-celllineage_DEATH.js", function(error, p0) {
  if (error) throw error;
  root = d3.hierarchy(p0, function(d) 
    { return d.children; });
  root.x0 = h / 2;
  root.y0 = 0;

  // shows only the root children 
  root.children.forEach(collapse);
  update(root);
});
d3.select(self.frameElement).style("height", "300px");

    
// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var div = d3.select("#area1").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

//-- From here starts the tree part, from 
//-- https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd

/*-- append svg to body ---*/
var svg_tree = d3.select("#area1").append("svg")
    .attr("width", w)
    .attr("height", h+100)
  //  .attr("id", "treeG")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([h, w]);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);
 //console.log(treeData)
  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 55});

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg_tree.selectAll('g.node')
      .data(nodes, function(d) 
            {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr("id", function(d) {return d.data.did.toUpperCase();})
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
        })
      .attr("death", function(d) 
        {return d.data.deathDistance || d.data._deathDistance ? "yes" : "no";})
      .on("mouseout", function(d) {		
            div.transition()		
                .duration(100)		
                .style("opacity", 0);})
      .on('contextmenu', d3.contextMenu(menu))
      .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
//      .attr("id",  function(d) {return d.data.did.toUpperCase();})
      .attr('r', 1e-6);
    

  // Text when adding nodes 
  nodeEnter.append('text')
      .attr("dy", ".35em")
     // position of label depends on children 
      .attr("x", function(d) 
            {return d.children || d._children ? -13 : 13; })
      .attr("text-anchor", function(d) { 
            return d.children || d._children ? "end" : "start"; })
     // HERE I CAN MODIFY TO TUNE THE SIZE AS A FUNCTION OF THE DEPTH
      .attr("font-size", function(d) {
                return d.children || d._children ? 
                    (16- (d.depth/3) + "px" ) : "12px" })
      .attr("font-family", "sans serif")
      .text(function(d) 
            {return d.data.name; })

    // .style("fill-opacity", 1e-6);
    
  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
//    .attr('r', 4.5)
    .attr('r', function(d) {
                return (10- (d.depth/2)) })
    .style("fill", function(d) {
            return d._children ? "lightblue" : "#fff";})
    .style('stroke-width', 2)
    .attr('cursor', 'pointer')
    .style("stroke", function(d) {
    return d.data.deathDistance || d.data._deathDistance ?  "red" : "blue";
    });

  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);

  // ****************** links section ***************************

  // Update the links...
  var link = svg_tree.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link")
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x;
    d.y0 = d.y;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    console.log("I have clicked in cell "+ d.data.did)
    console.log("depth "+ d.depth)
    console.log("parents " + d.ancestors().map( d => d.data.did ))   
    if (d.children) {
    //    console.log("descendants " + d.descendants().map( d => d.data.did )) 
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
    //    console.log("descendants " + d.descendants().map( d => d.data.did )) 
      }
    update(d);    
  }
}

// my functions

function expand(d) {
    if (d._children) {
        d.children = d._children;
        d.children.forEach(expand);
        d._children = null;
        }
  }

function expandAll(){
    expand(root); 
    root.children.forEach(expand);
    update(root);
}

function collapseAll(){
    root.children.forEach(collapse);
    collapse(root);
    update(root);
}
    
function resetAll(){
    expand(root); 
    root.children.forEach(collapse);
//    collapse(root);
    update(root);
}

 
var count;
function count_leaves(d){
    expand(d);
    count = 0;
    if(d.children){   //go through all its children
        for(var ii = 0; ii<d.children.length; ii++){
            expand(d.children[ii])          
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[ii].children){
                count_subleaves(d.children[ii]);
                 var xx = "#"+d.children[ii].data.id;
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("fill", "blue");
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
                }
            //if not then it is a leaf so we count it
            else{count++;
                 var xx = "#"+d.children[ii].data.id;
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("fill", "blue")
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
           //      console.log(count + " " + xx.toUpperCase())
                }
            }
        }
 //   d.children.forEach(collapse);
//    update(root);

    return(count);
    }        

function count_subleaves(d){;
        for(var jj = 0; jj<d.children.length; jj++){
            expand(d.children[jj])
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[jj].children){
                count_subleaves(d.children[jj]);
                var xx = "#"+d.children[jj].data.id;
                d3.selectAll("#area2").select(xx.toUpperCase()).attr("fill", "blue");
                d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
                }
            //if not then it is a leaf so we count it
            else{count++;
                 var xx = "#"+d.children[jj].data.id;
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("fill", "blue");
                 d3.selectAll("#area2").select(xx.toUpperCase()).attr("r", 3);
           //      console.log(count + " " + xx.toUpperCase())
                }
            }
    }        
    
var findCommonElements= function(arrs) {
    var resArr = [];
    for (var i = arrs[0].length - 1; i > 0; i--) {
        for (var j = arrs.length - 1; j > 0; j--) {
            if (arrs[j].indexOf(arrs[0][i]) == -1) {
                break;
            }
        }
        if (j === 0) {
            resArr.push(arrs[0][i]);
        }
    }
    return resArr;
}