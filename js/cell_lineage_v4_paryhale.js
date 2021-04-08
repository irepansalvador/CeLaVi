// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
 console.log("ALL FILE API supported") // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

// Function to change the size of the viewer areas
function enlarge_areas()
	{
	var numberPattern = /\d+/g;
	var areas = document.querySelectorAll(".svg-container-inbox")
	for(var i=0; i<areas.length; i++)
		{
		var oldsize = parseInt(areas[i].style.paddingBottom.match( numberPattern ));
		var newsize = oldsize + 5;
		console.log("my old size is " + oldsize + "%")
		areas[i].style.paddingBottom = newsize + "%";
		}
	h = d3.select("#area1").selectAll("svg")
		// get the width of div elemen and take pixels
		.style('height').slice(0, -2);
	window.dispatchEvent(new Event('resize'));
	Plotly.update("area2");
	}

function reduce_areas()
	{
	var numberPattern = /\d+/g;
	var areas = document.querySelectorAll(".svg-container-inbox")
	for(var i=0; i<areas.length; i++)
		{
		var oldsize = parseInt(areas[i].style.paddingBottom.match( numberPattern ));
		var newsize = oldsize - 5;
		console.log("my old size is " + oldsize + "%")
		areas[i].style.paddingBottom = newsize + "%";
		}
	h = d3.select("#area1").selectAll("svg")
		// get the width of div elemen and take pixels
		.style('height').slice(0, -2);
window.dispatchEvent(new Event('resize'));
	Plotly.update("area2");
	}

// Define the zoom function for the zoomable tree
function zoomed() {
	svg_tree.attr("transform", d3.event.transform);
//	console.log(d3.event.transform);
	}
var zoom = d3.zoom()
						.scaleExtent([0.2, 2])
						.on("zoom", zoomed);
						
// define the zoomListener which calls the zoom function on the "zoom" event
// constrained within the scaleExtents
//var zoomListener = d3.behavior.zoom().scaleExtent([0.2,2]).on("zoom", zoom);

function enter_link() {
	$('#splashscreen').fadeOut(500);
};

var div = d3.select("body").append("div")	
	.attr("class", "tooltip")
	.style("opacity", 0);

function zoom_reset () 
	{
	svg_tree_base.transition()
		.duration(750)
		.call(zoom.transform, d3.zoomIdentity.translate(30,15).scale(0.9));
	}

var margin = {top: 15, right: 15, bottom:5, left: 30};

var svg_tree_base = d3.select("#area1")
//	.style("padding-bottom", "35%")
//	.classed("svg-container-inbox2", true) //container class to make it responsive
	.append("svg")
	.call(zoom)	
	//class to make it responsive
	//responsive SVG needs these 2 attributes and no width and height attr
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", "0 0 600 500")
	.classed("svg-content-responsive", true)
	.attr("transform", "translate(0,0 )");

	
var svg_tree = svg_tree_base.append("g")
//	.call(zoom)

var w = d3.select("#area1").selectAll("svg")
      // get the width of div element
      .style('width')
      // take of 'px'
      .slice(0, -2);
var h = d3.select("#area1").selectAll("svg")
      // get the width of div element
      .style('height')
      // take of 'px'
      .slice(0, -2);

var depths;
// --- Show menu with custom functions in right click
var double_element = [];

var menu = [
	{
	title: function(d){
			if (d.children)  {return "Collapse node " + d.data.did}
			if (d._children) {return "Expand node" + d.data.did}
			else {return d.data.did + " (terminal node)"}
		}, 
	action: function(d, i) {
		console.log('Trying to collapse/expand this node: ' + d.data.did);
		click(d);
		}
	},
    {
	title: 'Expand all from here',
    action: function(d, i) {
	console.log('The data for this circle is: ' + d.data.did);
        expand(d)  
        update(d)      
        }
	},
	{
	title: 'Collapse all until here',
    action: function(d, i) {
        collapse(d)
        update(d)
        }
	},
	{
	title: 'Delete this node',
    action: function(d) {
        delete_node(d);
        }
	},
   	{
	title: function(d) {return 'Save clone ' + d.data.did},
	action: function(d) {save_clone(d)}
	},
	{
	title: function(d) {return 'Export clone ' + d.data.did + ' to JSON file'},
	action: function(d) 
						{
						d.species = root.species;
						d.source = root.source;
						if (Abs_BL < 2)
							{nodes.forEach(function(dd){dd.length = dd.blength})}
						export_clone_json(d)}
	},
  {
	title: 'Find common ancestor',
    action: function(d, i) {
        if (double_element.length == 0){
       //     console.log('The data for this circle is: ' + d.data.did);
            yy = d.data.did
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
             yy = d.data.did
            common_anc2("#"+yy)
//            console.log('Second circle is: ' + yy);
            double_element = [];
            }
        }
    }
];

//###################################################################################
//#############         JSON OPTION                                ##################
//###################################################################################
var max_H;
var colorScale;
var HM_cols = [];
var links_hide = false;

// colors = blue, green, red, purple, orange, black...
var stroke_cols = [ "rgb(0,0,255)","rgb(0,255,0)","rgb(255,0,0)","rgb(255,0,255)","rgb(255,165,0)","rgb(0,0,0)",
                   "rgb(0,0,255)","rgb(0,255,0)","rgb(255,0,0)","rgb(255,0,255)","rgb(255,165,0)","rgb(0,0,0)",
                   "rgb(0,0,255)","rgb(0,255,0)","rgb(255,0,0)","rgb(255,0,255)","rgb(255,165,0)","rgb(0,0,0)"];
var col_scheme = 1;

function load_dataset_json(json) {
	// parse the data set and plot it
	var myroot = JSON.parse(json);
	console.log(myroot);
	root = d3.hierarchy(myroot, function(d) 
		{return d.children; });
	root.x0 = h / 4;
	root.y0 = 0;
	expandAll();
	// get all the heights
	max_H  = get_height();
	nodelen = 600/max_H;
	// SET BRANCHLENGTHS
	set_bl();
	console.log(max_H);
	colorScale = d3.scaleSequential(d3.interpolateYlOrBr)
		.domain([1, max_H]);
	my_slider();
	//Nested_rels_HMscale(max_H);
	console.log(nodes.length);
	if (nodes.length < 500) {links_hide = true;Hide_branches() }
	else {links_hide = false; Hide_branches();
		showAlert("[NOTE] For faster rendering, some tree branches might not show. " +
						"Go to \"More Options\" and \"Show all branches\" " +
						" to change this behaviour.")
		}
	if (root.data.species != undefined) 
		{console.log("yes")
		var mytxt = "Species: " + root.data.species;
		d3.select("#species").text(mytxt);
		root.species = mytxt;
		}
	if (root.data.species == undefined){d3.select("#species").text("");}

	if (root.data.source != undefined) 
		{
		var mytxt = "Source: " + root.data.source;
		d3.select("#source").text(mytxt);
		root.source = mytxt;
		}
	if (root.data.source == undefined){d3.select("#source").text("");}

	update(root);
	//resetAll();
}
function load_dataset_newick(newick,sp,source){
	root = d3.hierarchy(newick);
	root.x0 = h / 4;
	root.y0 = 0;
	expandAll();
	console.log(sp);
	// get all the heights
	max_H  = get_height();
	nodelen = 600/max_H;
	// SET BRANCHLENGTHS
	set_bl();
	console.log(max_H);
	colorScale = d3.scaleSequential(d3.interpolateYlOrBr)
		.domain([1, max_H]);
	my_slider();
	//  Nested_rels_HMscale(max_H);
	console.log(nodes.length);
	if (nodes.length < 500) {links_hide = true; Hide_branches() }
	else {links_hide = false; Hide_branches();
		showAlert("[NOTE] For faster rendering, some tree branches might not show. " +
						"Go to \"More Options\" and \"Show all branches\" " +
						" to change this behaviour.")
		}
	if (sp != undefined) 
		{
		var mytxt = sp[0];
		d3.select("#species").text(mytxt);
		console.log(mytxt);
		root.species = mytxt;
		}
	if (sp == undefined){d3.select("#species").text("");}

	if (source != undefined) 
		{
		var mytxt = source[0];
		d3.select("#source").text(mytxt);
		root.source = mytxt;
		}
	if (source == undefined){d3.select("#source").text("");}
	
	update(root);
	//resetAll();
}

d3.select(self.frameElement).style("height", "300px");

//-- From here starts the tree part, from 
//-- https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd

var i = 0,
    duration = 800,
    root;

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

var nodes;

/* ----------- ZOOM AND PAN ----------- */
// declares a tree layout and assigns the size
var node_h = h;
var treemap = d3.tree()
		.separation(function(a, b) 
			{ if (a.children == null && b.children != null)
					{return (b.leaves().length * 2.5)  }
				else if (b.children === null && a.children != null)
					{return (a.leaves().length * 2.5)  }
				else {return (a.leaves().length + b.leaves().length) }
			})
		.size([node_h, w]);

show_BL = 0;
//var Abs_BL;
var nodelen = 1;
var nodelen2;
var depth_label = 3;
var counter;

function zoom_in_start() {
	counter = setInterval(function() {
		if (show_BL == 0)
			{nodelen = nodelen * 1.1; update(root);}
		if (show_BL == 1)
			{nodelen2 = nodelen2 * 1.1; update(root);
			time_scale_factor = time_scale_factor * 1.1;
			var x = d3.select("#timeline").attr("x1");
			d3.select("#timeline").attr("x1", x * 1.1);
			d3.select("#timeline").attr("x2", x * 1.1);
			//slided();
			}
		}, 50);
	}
function zoom_out_start() {
	counter = setInterval(function() {
		if (show_BL == 0)
			{nodelen = nodelen * 0.9; update(root);}
		if (show_BL == 1)
			{nodelen2 = nodelen2 * 0.9; update(root);
			time_scale_factor = time_scale_factor * 0.9;
			//slided();
			var x = d3.select("#timeline").attr("x1");
			d3.select("#timeline").attr("x1", x * 0.9);
			d3.select("#timeline").attr("x2", x * 0.9);
			}
		}, 50);
	}
function pan_down_start() {
	counter = setInterval(function() {
		node_h = node_h * 1.1;
		treemap = d3.tree().separation(function(a, b) 
			{ if (a.children == null && b.children != null)
					{return (b.leaves().length * 2.5)  }
				else if (b.children === null && a.children != null)
					{return (a.leaves().length * 2.5)  }
				else {return (a.leaves().length + b.leaves().length) }
			})
		.size([node_h, w]);
		update(root);
		}, 50);
	}
function pan_up_start() {
	counter = setInterval(function() {
		node_h = node_h * 0.9;
		treemap = d3.tree().separation(function(a, b) 
			{ if (a.children == null && b.children != null)
					{return (b.leaves().length * 2.5)  }
				else if (b.children === null && a.children != null)
					{return (a.leaves().length * 2.5)  }
				else {return (a.leaves().length + b.leaves().length) }
			})
.size([node_h, w]);
		update(root);
		}, 50);
	}
    
function resetAll(){
	zoom_reset();
	node_h = h;
	treemap=d3.tree().separation(function(a, b) 
			{ if (a.children == null && b.children != null)
					{return (b.leaves().length * 2.5)  }
				else if (b.children === null && a.children != null)
					{return (a.leaves().length * 2.5)  }
				else {return (a.leaves().length + b.leaves().length) }
			})
	.size([node_h,w]);
	nodelen  = 600/max_H;
	nodelen2 = 600/max_BL;
	time_scale_factor = 1;
	if (show_BL == 1) {
		d3.select("#slider").select("input").property("value", 0);
		d3.select("#timeline").remove();
		time_cells=[];
		}
	// expand all cells
	collapseAll();
	setTimeout(function(){ expandAll(); }, 1000);
	
	}

function end() {
	clearInterval(counter)
	}

d3.select("#Reset_cols_Tree").on("click", function() {
	reset_node_cols()
	});

// ----------------------------------------------

function update(source) {
  ci =0;
  // Assigns the x and y position for the nodes
  var treeData = treemap(root);
  //console.log(treeData)
  // Compute the new tree layout.
  nodes = treeData.descendants();
	if (links_hide == false) {links = treeData.descendants().slice(1);}
	else {
		links2 = treeData.descendants().slice(1);
		links = links2.filter(function (d) {
			if (d.data.did == d.parent.children[0].data.did || d.data.did == d.parent.children[d.parent.children.length-1].data.did) {
			return d}
			})
		}
  nodes.forEach(function(d){
      if (d.blength == undefined) {d.blength = 0};
    });
    
  //  set_bl();
  // Normalize for fixed-depth.
  // nodes.forEach(function(d){ d.y = d.depth * 30});
  if (show_BL == 0)
     {nodes.forEach(function(d){ d.y = d.depth * nodelen});}
  if (show_BL == 1)
     {nodes.forEach(function(d){ d.y = d.blength * nodelen2});}

	// set node property
	nodes.forEach(function(d){
		if (d.children) {d.node = "internal"}
		else if (d._children) {d.node = "internal"}
		else {d.node = "terminal"}
	})

  // ****************** Nodes section ***************************
  // Update the nodes...
  var node = svg_tree.selectAll('g.node')
      .data(nodes, function(d) 
            {return d.id || (d.id = ++i); });
	// set node property
	nodes.forEach(function(d){
	d.did = d.data.did;
	})

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr("id", function(d) {return d.data.did;})
      .attr("did", function(d) {return d.data.did;})
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
        })
//      .on('click', click)
			.on("click", function(d) {
				d3.selectAll("#area1").selectAll("g").select("#"+d.data.did).select("circle")
					.style("fill", randomColour2() );
				paint_daughters(d);
				})
			.on("mouseover.t", function(d) {
				if (points_array == undefined)
					{
					count_leaves2(d);
					div.style("opacity", .9)
						.text(function() {
							{return d.data.did + ": " +
								count2+" daughters."}
							})
						.style("left", (d3.event.pageX + 10 ) + "px")	
						.style("top", (d3.event.pageY - 28) + "px");
					}
				else{
					setAlpha(points_array, 0);
					setAlphaStroke(points_array, 0.01);
					highlight_daughters(d);
					div.style("opacity", .9)
						.text(function() {
							if (count2 == N_terminal && N_terminal > 1 )
								{return d.data.did + ": " +
										count2+" daughters. All cells found"}
							else {return d.data.did + ": " + 
									count2 + " daughters. " +
									N_terminal + " cells found." }
							})
						.style("left", (d3.event.pageX + 10 ) + "px")	
						.style("top", (d3.event.pageY - 28) + "px");
					}
				})
			.on("mouseout.c", function (d) {
				if (points_array != undefined)
					{
					setAlphaStroke(points_array, 1);
					setAlpha(points_array, 1);
					}
				})
			.on("mouseout.t", function(d) {
				div.style("opacity", 0)
				.text('');//}
				})
			.on('contextmenu', d3.contextMenu(menu));
    
  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
//      .attr("id",  function(d) {return d.data.did;})
     .attr('r', function(d) {
              return d.depth < 9 ? (6 - d.depth/3) : 3 })
     .style('stroke-width', function(d) {
              return d.depth < 6 ? (2 - d.depth/5) : 0.8 })

 //    .attr('r', 1e-6)
      .style("stroke", "rgb(0,0,255)");
  // Text when adding nodes 
  nodeEnter.append('text')
      .attr("dy", ".35em")
     // position of label depends on children 
      .attr("x", function(d) 
            {return d.children || d._children ? -10 : 10; })
      .attr("y", function(d) 
            {return d.children || d._children ? 5 : 0; })
     .attr("text-anchor", function(d) { 
            return d.children || d._children ? "end" : "start"; })
      .attr("font-size", function(d) {
               return d.depth <= depth_label  ? (9- (d.depth*0.2) + "px" ) : "0px" })
      .attr("font-family", "sans serif")
      .text(function(d) 
            {return d.data.did; });

    // Text when adding nodes 
  nodeEnter.append('text')
      .attr("class", "textchild")
      .attr("x", 10).attr("dy", ".35em")
      .attr("font-size", 0)
      .text(function(d) 
            {if (d._children == null) {return  ""}
             else if (d._children != null) {return  count_leaves2(d) }
            });;

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
//    .attr('r', function(d) {
 //               return (6- (d.depth/2)) })
    .style("fill", function(d) {
        if (d3.select(this).style("fill") == "rgb(70, 150, 180)" )
            {return d._children ? "rgb(70, 150, 180)" : "rgb(255, 255, 255)";}
         else if (d3.select(this).style("fill") == "rgb(255, 255, 255)" )
            {return d._children ? "rgb(70, 150, 180)" : "rgb(255, 255, 255)";}
         else  {return d3.select(this).style("fill");}
        }
      )
 //   .style('stroke-width', 1.5)
    .style('stroke-width', function(d) {
              return d.depth < 6 ? (2 - d.depth/5) : 0.8 })

    .attr('fill-opacity', 0.9)
    .attr('cursor', 'pointer')
    .style("stroke", function(d) {
        return d3.select(this).style("stroke")}
      );
   // Text when adding nodes 
  nodeUpdate.select('.textchild')
      .text(function(d) 
            {if (d._children == null) {return  ""}
             else if (d._children != null) {return  count_leaves2(d) }
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
      .style("stroke", "darkgrey")
			.style("fill","none")
			.style("stroke-opacity", 0.5)
	    .style('stroke-width', 1.5)
			.attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`
    return path
  }

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

}

// my functions
// Toggle children on click.
function click(d) {
    //console.log("I have clicked in cell "+ d.data.did)
    //console.log("depth "+ d.depth)
    //console.log("parents " + d.ancestors().map( d => d.data.did ))   
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

//###################################################################################
//#############FUNCTIONS TO HIGHLIGHT ALL DAUGHTERS OF A GIVEN NODE##################
//###################################################################################

var count; var Tcount; var orig_col; var orig_stroke;
var sel_ids;
var N_terminal;

function highlight_daughters(d)
	{
	count_leaves2(d);
			// pts is array with point number to be changed
	pts = getPoints(sel_ids);
	N_terminal = pts.length;
	// change colour of the 3Dcell 
	setAlpha(pts, 1 );
	setAlphaStroke(pts, 0.25);
	}

function paint_daughters(d,n)
	{
	orig_col =d3.selectAll("#area1").selectAll("g").select("#"+d.data.did)
		.select("circle").style("fill");
//	orig_stroke =d3.selectAll("#area1").selectAll("g").select("#"+d.data.did)
//		.select("circle").style("stroke");
	count_leaves2(d);
			// pts is array with point number to be changed
	pts = getPoints(sel_ids);
	N_terminal = pts.length;
	// change colour of the 3Dcell 
	setColours(pts, orig_col );
//	setStroke(pts, orig_stroke );
	}

function paint_daughters_HM(d,n)
	{
	count_leaves2(d);
	pts = getPoints(sel_ids);
	setColours(pts,colorScale(n) );
//	setStroke(pts, colorScale(n) );
	}

function count_leaves2(d){
		sel_ids=[];
    count = 0;
    if(d.children){   //go through all its children
        for(var ii = 0; ii<d.children.length; ii++){
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[ii].children){
                count_subleaves2(d.children[ii]);
                }
            else if (d.children[ii]._children){
                count_subleaves2h(d.children[ii]);
                } 
            //if not then it is a leaf so we count it
            else{
                count++;
                var xx = d.children[ii].data.did;
								sel_ids.push(xx);
                }
            }
        }
		else if(d._children){   //go through all its children
        for(var ii = 0; ii<d._children.length; ii++){
            if (d._children[ii]._children){
                count_subleaves2h(d._children[ii]);
                }
            else if (d._children[ii].children){
                count_subleaves2(d._children[ii]);
                }
            //if not then it is a leaf so we count it
            else{count++;
                var xx = d._children[ii].data.did;
								sel_ids.push(xx);
                }
            }
        }
    else {sel_ids.push(d.data.did);}
    count2=count; count=0;
    Tcount = Tcount+count2;
		return(count2);
    }        
function count_subleaves2(d){;
        for(var jj = 0; jj<d.children.length; jj++){
                var xx = d.children[jj].data.did;
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[jj].children){
                count_subleaves2(d.children[jj]);
                }
            else if (d.children[jj]._children){
                count_subleaves2h(d.children[jj]);
                }
            //if not then it is a leaf so we count it
            else{count++;
								sel_ids.push(xx);
               //  console.log(count + " " + xx)
                }
            }
    }
function count_subleaves2h(d){;
        for(var jj = 0; jj<d._children.length; jj++){
               var xx = d._children[jj].data.did;
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d._children[jj]._children){
                count_subleaves2h(d._children[jj]);
                }
            else if (d._children[jj].children){
                count_subleaves2(d._children[jj]);
                }
            //if not then it is a leaf so we count it
            else{count++;
								sel_ids.push(xx);
              //   console.log(count + " " + xx)
                }
            }
    }

//###################################################################################

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

///  ADD dropdown menu
var my_clone;
var clones_list = {
	cols : {},
	IDs : {},
	names: {}
	}

function save_clone(d) {
	// messages to find bug
	//console.log("##################################");
	//console.log("THIS SHOWS WHEN CLICKING IN ANY CLONE TO SAVE");
	my_clone = d.data.did;
	$('#example-button').click();
	}

$('#example-button').colpick({
	flat:false,
	layout:'rgbhex',
	onSubmit:function(hsb,hex,rgb,el,bySetColor) {
		$(el).val('#'+hex);
		$(el).colpickHide();
		var result = hexToRgb("#"+hex);
		var RGBcol  = "rgb("+ result.r + "," + result.g + ","  + result.b + ")" ;
		// messages to find bug
	//	console.log("##################################");
		console.log("THIS SHOWS WHEN CHOOSING ANY COLOUR");
		//console.log("chosen colour = " + RGBcol);
		//console.log('Test: ' + my_clone)
		//
		var t = prompt("Please enter the name for the clone ", my_clone );
		
		options = options +1;
		dropMenu = [options + " " + my_clone + " " + t];
		clones_list.cols[options] = RGBcol;
		clones_list.IDs[options] = my_clone;
		clones_list.names[options] = [my_clone, t];
		update_dropMenu();

		//console.log("----------------------------------");
		//console.log("my N option is now " + options);
	//	console.log("my clone list is : "+ clones_list);
		}
	});

// initialise the menu
var dropdownButton = d3.select("#saved_clones")
var dropMenu;
var options = 0;
// add the options to the button
var update_dropMenu = function() {
	var res = dropMenu[0].split(" ");
	var picked = res[1];
	var t = res[2];
	dropdownButton // Add a button
		.selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
		.data(dropMenu)
		.enter()
		.append('option')
		.text(t) // text showed in the menu
		.attr("value", function (d) { return d; }) // corresponding value returned by the button
	
	console.log("----------------------------------");
	console.log("Adding "+ dropMenu + " to the list ");
}

// When the button is changed, run the updateChart function
dropdownButton.on("change", function(d) {
	//console.log("##################################");
	//console.log("THIS SHOWS WHEN SELECTING ANY  CLONE");
	// recover the option that has been chosen
	var selectedOption = d3.select(this).property("value")
	var res = selectedOption.split(" ");
	var picked = res[1];
	var idx = res[0];
	var t = res[2];
	// messages to bug correction
	console.log("----------------------------------");
	console.log("you have selected " + selectedOption);
	//console.log("clone index =  " + idx);
	//console.log("clone name  = " + picked);

	var xxx = d3.selectAll("#area1").selectAll("g")
		.select("circle").data()
		.filter(function(d) {return d.data.did == picked});
	d3.selectAll("#area1").select("#"+xxx[0].data.did).select("circle")
		.style("fill", clones_list.cols[idx] )
		.attr('fill-opacity', 0.9)
		.style('stroke-width', 1.5);
//		.style("stroke", clones_list.saved[idx]);
	paint_daughters(xxx[0]);
	d3.select("#square_clone").style("fill", clones_list.cols[idx])
	})

function resetClones() {
	options = 0;
	clones_list.cols = {};
	clones_list.IDs = {};
	clones_list.names = {};
	var x =  dropdownButton._groups[0][0].options.length;
	for (var i = 0; i < x; i++)
		{ dropdownButton._groups[0][0].options.remove(0)}
	d3.select("#square_clone").style("fill", "#bccbde");

	dropdownButton // Add a button
		.append('option')
		.text("Choose clone") // text showed in the menu
		.attr("value", "") // corresponding value returned by the button
		.attr("selected", "selected")
		.attr("hidden", "hidden")
	}

function clonesToCsv(filename, rows) {
	var processRow = function (row) {
		var finalVal = '';
		for (var j = 0; j < row.length; j++) {
			var innerValue = row[j] === null ? '' : row[j].toString();
			if (row[j] instanceof Date) {
				innerValue = row[j].toLocaleString();
				};
			var result = innerValue.replace(/"/g, '""');
			if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
			if (j > 0) finalVal += ',';
			finalVal += result;
			}
		return finalVal + '\n';
		};
	var csvFile = '';
	for (var i = 0; i < rows.length; i++) {
		csvFile += processRow(rows[i]);
		}
	var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
	if (navigator.msSaveBlob) { // IE 10+
		navigator.msSaveBlob(blob, filename);
	} else {
		var link = document.createElement("a");
		if (link.download !== undefined) { // feature detection
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", filename);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			}
		}
	}

function exportClones() 
	{
	if (Object.entries(clones_list.names).length > 0 )
		{
		var array2export = [];
		array2export.push(['cell','type'])
		// iterate through the saved list
		for (const [key, value] of Object.entries(clones_list.names))
			{
			console.log(value);
			var xxx = d3.selectAll("#area1").selectAll("g").select("circle")
				.data().filter(function(d) {return d.data.did == value[0]});
			count_leaves2(xxx[0]);
			console.log(sel_ids);
			for (var i=0; i < sel_ids.length; i++)
				{
				array2export.push([sel_ids[i],value[1]])
				}
			}
		console.log(array2export);
		clonesToCsv("exported_clones.csv", array2export);
		}
	else {showAlert("List of clones is empty. Please save some clones first")}
	}


function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
    }

function get_height(){
    // get all the nodes (opened) and get their height
    xxx = d3.selectAll("#area1").selectAll("g")
            .select("circle").data()
            .filter(function(d) {return d.y >= 0});
    var yyy = [];
    xxx.filter(function(d) {yyy.push(d.depth)})

    // get the unique vals for x coordinates
    depths = yyy.filter( onlyUnique );
    return depths.length;    
    //console.log(depths);
}
function get_heightID(){
    // get all the nodes (opened) and get their height
    xxx = d3.selectAll("#area1").selectAll("g")
            .select("circle").data()
            .filter(function(d) {return d.y >= 0});
    var yyy = [];
    xxx.filter(function(d) {yyy.push(d.data.did)})

    // get the unique vals for x coordinates
    depths = yyy.filter( onlyUnique );
    return depths;    
    //console.log(depths);
}
function reset_node_cols() {
	d3.selectAll("#area1")
		.selectAll('circle.node')
		.attr('r', function(d) {
			return d.depth < 9 ? (6 - d.depth/3) : 3 })
		.style('stroke-width', function(d) {
			return d.depth < 6 ? (2 - d.depth/5) : 0.8 })
		.style("fill", function(d) {
			return d._children ? "rgb(70, 150, 180)" : "rgb(255, 255, 255)";})
		.attr('fill-opacity', 0.9)
		.attr('cursor', 'pointer')
		.style("stroke", "rgb(0,0,255)");
	}

function get_branlen(){
    // get all the nodes (opened) and get their height
    xxx = d3.selectAll("#area1").selectAll("g")
            .select("circle").data()
            .filter(function(d) {return d.y >= 0});
    var yyy = [];
    xxx.filter(function(d) {yyy.push(d.data.length)})

    // get the unique vals for x coordinates
    branlen = yyy.filter( onlyUnique );
    return branlen;    
    //console.log(bralen);
}

var max_BL;
function set_bl(){
	document.getElementById("BranchLenghts").style.display = "none";
	if (root.data.length != undefined)
		{
		var bl_prompt = prompt("Branch lenghts have been detected. \nIf these represent time to parent node (C. elegans example) enter \"relative\"\nIf they represent time from root (Parhyale example) enter \"absolute\"\nIf you want to ignore branch lengths press Cancel");
		if (bl_prompt != null) {
			if (bl_prompt == "relative") 
				{
				Abs_BL=0;
				console.log("rel selected");
				document.getElementById("BranchLenghts").style.display = "block";
				}
			else if (bl_prompt == "absolute") 
				{
				Abs_BL=1;
				console.log("abs selected");
				document.getElementById("BranchLenghts").style.display = "block";
				}
			else {console.log("you have typed something else: " + bl_prompt);}
			}
		}
	else {
			Abs_BL=2;
			document.getElementById("BranchLenghts").style.display = "none" ;
		}
		
	max_BL = 0;
	if (Abs_BL == 1)
		{
		nodes.forEach(function(d) 
			{
			//if (d.parent !==null) { CORRECT HERE FOR LENGHT!!
			d.blength = (d.data.length);
			if (max_BL < d.blength) {max_BL = d.blength} 
			//  }// + d.parent.blength} 
			})
		}
	else if (Abs_BL == 0)
		{
		console.log("I should see this after relative");
		nodes.forEach(function(d) 
			{
			if (d.parent != null) 
				{
				d.blength = (d.data.length + d.parent.blength);
				if (max_BL < d.blength) {max_BL = d.blength} 
				}
			})
		}
	console.log("my MAX BL is " + max_BL);
	nodelen2 =600/max_BL;
	console.log(nodelen2)
	}


function show_bl(){
//	if (document.getElementById("Json_CLONES").checked == false)
//		{
		if (show_BL == 1)
			{show_BL = 0;
			d3.select("#slider").selectAll("input").remove();
			d3.select("#slider").selectAll("svg").remove();
			// remove the previous line
			d3.select("#area1").select("svg").selectAll("line").remove();
			my_slider();
			}
		else if (show_BL == 0) 
			{show_BL = 1;
			d3.select("#slider").selectAll("svg").remove();
			my_slider_2();
			}
		update(root);
//		}
	}
function common_anc1(d) {
	console.log("I have clicked in cell "+ d)
	d3.selectAll("#area1").select("g").select(d)
		.each(function(d) 
			{
			selections = d.ancestors().map(d => d.data.did)
			console.log("Parents are " + selections)
			double_element.push(selections)
			})
	}

function common_anc2(d) {
	console.log("I have clicked in cell "+ d)
	d3.selectAll("#area1").select("g").select(d)
		.each(function(d) 
		{
		selections = d.ancestors().map(d => d.data.did)
		console.log("Parents are " + selections)
		double_element.push(selections)
		a = findCommonElements(double_element)
		b = a[a.length-1]
		console.log("Last common ancestor is " + b)
		// paint common ancestor
		d3.selectAll("#area1").selectAll("#"+b)
			.select("circle").style("fill", "rgb(255,0,0)")
			// paint all descendants
			.each(function(d)
			{
			//count_leaves(d);
			selections = d.descendants().map(d => d.data.did)
			for(var jj = 0; jj<selections.length; jj++)
				{
				console.log("daughters "+selections[jj])
				d3.selectAll("#area1").selectAll("#"+selections[jj])
					.select("circle").style("fill", "rgb(255,0,0)")
				var xx = "#"+selections[jj];
				d3.selectAll("#area2").select(xx)
					.attr('opacity', 10).attr('fill-opacity', 1).attr("fill", "rgb(255,0,255)");
				d3.selectAll("#area2").select(xx).attr("r", my_rad);
				}
			})
		})
	}

function collapse_missing() {
	var missing_daughters=[];
	var missing_sisters=[];
	// get ALL open nodes
	var x = nodes.filter(function(d) {return d.node == "terminal"})
	for (var i=0; i<x.length; i++)
		{
		d = x[i];
//		console.log(d.data.did);
		// check if a terminal node is in the 3D array
		if (containsAll([d.data.did],ID_array)) {}
		// if not go to ancestors
		else {
			//console.log(d.data.did);
			missing_daughters.push(d.data.did);
			if (containsAll([d.data.did],missing_sisters))
				{//console.log("skip " + d.data.did + " as is a missing sister");
				continue}
			selections = d.ancestors().map(d => d)
			//console.log(selections)
			for(var jj = 1; jj<selections.length; jj++)
				{
				//console.log("ancestor of  "+  d.data.did + " level " + jj + " = " + selections[jj].data.did);
				count_leaves2(selections[jj]);
				pts = getPoints(sel_ids);
				//console.log("pts length is " +pts.length);
				if (pts.length == 0)
					{var joined = missing_sisters.concat(sel_ids);
					missing_sisters = joined.filter(onlyUnique);
					}
				else if (pts.length > 0 && jj == 1)
					{
					//console.log("I should be painting this " + d.data.did);
					d3.selectAll("#area1").selectAll("#"+ d.data.did)
						.select("circle")
						.attr("r",1) 
						.style("fill", "rgb(200,200,200)")
						.style("stroke", "rgb(200,200,200)");

					break;
					}
				else if  (pts.length > 0 && jj > 1)
					{//console.log("I should click this " + selections[jj-1].data.did);
						collapse(selections[jj-1]);
					//	update(selections[jj-1]);
						break;
					}
				//else {console.log("whats this "+ selections[jj].data.did +" pts "+ pts.length) }
				}
			}
		}
	//console.log(missing_daughters);
	//console.log(missing_sisters);
	update(root);
	}


function delete_missing() {
	var missing_daughters=[];
	var missing_sisters=[];
	// get ALL open nodes
	var x = nodes.filter(function(d) {return d.node == "terminal"})
	for (var i=0; i<x.length; i++)
		{
		d = x[i];
//		console.log(d.data.did);
		// check if a terminal node is in the 3D array
		if (containsAll([d.data.did],ID_array)) {}
		// if not go to ancestors
		else {
			//console.log(d.data.did);
			missing_daughters.push(d.data.did);
			if (containsAll([d.data.did],missing_sisters))
				{//console.log("skip " + d.data.did + " as is a missing sister");
				continue}
			selections = d.ancestors().map(d => d)
			//console.log(selections)
			for(var jj = 1; jj<selections.length; jj++)
				{
				//console.log("ancestor of  "+  d.data.did + " level " + jj + " = " + selections[jj].data.did);
				count_leaves2(selections[jj]);
				pts = getPoints(sel_ids);
				//console.log("pts length is " +pts.length);
				if (pts.length == 0)
					{var joined = missing_sisters.concat(sel_ids);
					missing_sisters = joined.filter(onlyUnique);
					}
				else if (pts.length > 0 && jj == 1)
					{
					//console.log("I should be deleting this  " + d.data.did);
					delete_nodes(d);
					break;
					}
				else if  (pts.length > 0 && jj > 1)
					{
					//console.log("I should delete this ancestral node " + selections[jj-1].data.did);
					delete_nodes(selections[jj-1]);
					//selections[jj-1].children = null;
						//	update(selections[jj-1]);
						break;
					}
				//else {console.log("whats this "+ selections[jj].data.did +" pts "+ pts.length) }
				}
			}
		}
	//console.log(missing_daughters);
	//console.log(missing_sisters);
	update(root);
	}


function delete_nodes(d) {
	if (d.parent) {
		var new_children = [];
		var sisters = d.parent.children;
		sisters.filter(function (s) {
			if (s.data.did != d.data.did)
				{new_children.push(s)} 
			})
		if (new_children.length > 0)
			{d.parent.children = new_children;}
		else {d.parent.children = null }
		//update(d);
		}
	}




function showAlert(message) {
	$(".myalert").find('.message').text(message);
	$(".myalert").fadeIn("slow", function() {
	setTimeout(function() {
	$(".myalert").fadeOut("slow");
	}, 3000);
	});
}

function delete_node(d) {
	if (d.parent) {
		var new_children = [];
		var sisters = d.parent.children;
		sisters.filter(function (s) {
			if (s.data.did != d.data.did)
				{new_children.push(s)} 
			})
		if (new_children.length > 0)
			{d.parent.children = new_children;}
		else {d.parent.children = null }
		update(d);
		}
	}

function Hide_branches() {
	if (links_hide == false) 
		{
		links_hide = true;
		document.getElementById("showbranches").innerHTML = "Render all branches";
		showAlert("This option hides N-2 branches of each polytomy (a node with > 2 daughters) of the tree.")
		}
	else {links_hide = false;
		document.getElementById("showbranches").innerHTML = "Render only some branches"; 
		}
	update(root)
}

var randomColour = (function(){
	var golden_ratio_conjugate = 0.618033988749895;
	var h = Math.random();
	var hslToRgb = function (h, s, l){
		var r, g, b
		if(s == 0){
			r = g = b = l; // achromatic
			}
		else{
			function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
	};
	return function(){
		h += golden_ratio_conjugate;
		h %= 1;
		return hslToRgb(h, 0.5, 0.60);
		};
	})();


function randomColour2() {
	var golden_ratio_conjugate = 0.618033988749895;
	var h = Math.random();
	var hslToRgb = function (h, s, l){
		var r, g, b
		if(s == 0){
			r = g = b = l; // achromatic
			}
		else{
			function hue2rgb(p, q, t){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
	};
//	return function(){
		h += golden_ratio_conjugate;
		h %= 1;
		return hslToRgb(h, 0.5, 0.60);
	//	};
	};

