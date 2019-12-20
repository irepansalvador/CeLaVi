 
// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
 console.log("ALL FILE API supported") // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var margin = {top: 15, right: 15, bottom:5, left: 30};

var svg_tree = d3.select("#area1")
	.style("padding-bottom", "32%")
	.classed("svg-container-inbox2", true) //container class to make it responsive
	.append("svg")
	//class to make it responsive
	//responsive SVG needs these 2 attributes and no width and height attr
	.attr("preserveAspectRatio", "xMinYMin meet")
	.attr("viewBox", "0 0 600 500")
	.classed("svg-content-responsive", true)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + 0 + ")");

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
var depths;

// --- Show menu with custom functions in right click
var double_element = [];

var menu = [
	{
	title: 'Show descendants',
    action: function(d, i) {
	console.log('The data for this circle is: ' + d.data.did);
        div.transition()		
            .duration(0)		
            .style("opacity", .9)
            .text(count_leaves2(d,0)+' daughters')
            .style("left", (d3.event.pageX + 10 ) + "px")	
            .style("top", (d3.event.pageY - 28) + "px");
        update(d)      
        }
	},
    {
	title: 'Expand descendants',
    action: function(d, i) {
	console.log('The data for this circle is: ' + d.data.did);
        expand(d)  
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
	title: 'Save clone',
    action: function(d, i) {
        yy = d.data.did;
        options = options +1;
        console.log('Test: ' + yy)
        dropMenu = [options + " " + yy];
        update_dropMenu();
        }
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
var stroke_cols = [ "blue","green","red","purple","orange","black",
                   "blue","green","red","purple","orange","black",
                   "blue","green","red","purple","orange","black"];
var col_scheme = 1;

function load_dataset_json(json) {
  // parse the data set and plot it
  var myroot = JSON.parse(json);
  console.log(myroot);
  root = d3.hierarchy(myroot, function(d) 
        { return d.children; });
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
  Nested_rels_HMscale(max_H);
  
  update(root);
  resetAll();
}

function load_dataset_newick(newick){
	root = d3.hierarchy(newick);
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
  Nested_rels_HMscale(max_H);
  
  update(root);
  resetAll();
}

function load_dataset_clones(json) {
  // parse the data set and plot it
  var myroot = JSON.parse(json);
  console.log(myroot);
  root = d3.hierarchy(myroot, function(d) 
        { return d.children; });

  // get all the Daughters of the root 
 	var max_Clones = root.children.length;
  console.log(max_Clones);

	call_CloneSlider(max_Clones);

//  console.log(max_H);
//  colorScale = d3.scaleSequential(d3.interpolateYlOrBr)
//      .domain([1, max_H]);
//  my_slider();
//  Nested_rels_HMscale(max_H);
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
var node_h = h/2;
var treemap = d3.tree().size([node_h, w]);

show_BL = 0;
var Abs_BL;
var nodelen = 1;
var nodelen2;


d3.select("#zoom_in_tree").on("click", function() {
 	if (document.getElementById("Json_CLONES").checked == false)
		{
   if (show_BL == 0)
     {nodelen = nodelen * 1.1; update(root);}
    if (show_BL == 1)
     {nodelen2 = nodelen2 * 1.1; update(root);}
	}
});

d3.select("#zoom_out_tree").on("click", function() {
 	if (document.getElementById("Json_CLONES").checked == false)
		{
   if (show_BL == 0)
     {nodelen = nodelen * 0.9; update(root);}
    if (show_BL == 1)
     {nodelen2 = nodelen2 * 0.9; update(root);}
		}
	});

d3.select("#pan_down_tree").on("click", function() {
	if (document.getElementById("Json_CLONES").checked == false)
		{
   node_h = node_h * 1.1;
    treemap = d3.tree().size([node_h, w]);
    update(root);
		}
	});

d3.select("#pan_up_tree").on("click", function() {
	if (document.getElementById("Json_CLONES").checked == false)
		{
   node_h = node_h * 0.9;
    treemap = d3.tree().size([node_h, w]);
    update(root);
		}
	});
d3.select("#Reset_cols_Tree").on("click", function() {
	if (document.getElementById("Json_CLONES").checked == false)
		{
		reset_node_cols()
		}
});

// ----------------------------------------------

function update(source) {
  ci =0;
  // Assigns the x and y position for the nodes
  var treeData = treemap(root);
  //console.log(treeData)
  // Compute the new tree layout.
  nodes = treeData.descendants(),
  links = treeData.descendants().slice(1);
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
    
  // ****************** Nodes section ***************************
  // Update the nodes...
  var node = svg_tree.selectAll('g.node')
      .data(nodes, function(d) 
            {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr("id", function(d) {return d.data.did;})
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
        })
      .on('click', click)
      .on("mouseover.t", function(d) {
          if (d3.select("#Tree_checkbox").property("checked"))
            {
             div.style("opacity", .9)
                .text(d.data.did + " "+count_leaves2(d,0) +" daughters")
                .style("left", (d3.event.pageX + 10 ) + "px")	
                .style("top", (d3.event.pageY - 28) + "px");
						}
					else if (show_BL==1) 
						{div.style("opacity", .9)
                .text(d.data.did + "; time="+d.blength)
                .style("left", (d3.event.pageX + 10 ) + "px")	
                .style("top", (d3.event.pageY - 28) + "px");
						}
					else if (show_BL==0) 
						{div.style("opacity", .9)
                .text(d.data.did + "; depth="+d.depth)
                .style("left", (d3.event.pageX + 10 ) + "px")	
                .style("top", (d3.event.pageY - 28) + "px");
						}

        })
      .on("mouseout.c", function (d) {
          if (d3.select("#Tree_checkbox").property("checked"))
            {reset_cell_cols()}
          })
      .on("mouseout.t", function(d) {
         //  if (d3.select("#Tree_checkbox").property("checked")) {
            div.style("opacity", 0)
                .text('');//}
            })
     .on('contextmenu', d3.contextMenu(menu));
    
  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
//      .attr("id",  function(d) {return d.data.did;})
     .attr('r', function(d) {
                return (6- (d.depth/2)) })
 //    .attr('r', 1e-6)
      .style("stroke", "blue");
  // Text when adding nodes 
  nodeEnter.append('text')
      .attr("dy", ".35em")
     // position of label depends on children 
      .attr("x", function(d) 
            {return d.children || d._children ? 2 : 10; })
      .attr("y", function(d) 
            {return d.children || d._children ? 10 : 0; })
     .attr("text-anchor", function(d) { 
            return d.children || d._children ? "end" : "start"; })
      .attr("font-size", function(d) {
               return d.depth <= 1 ? (9- (d.depth*0.2) + "px" ) : "0px" })
      .attr("font-family", "sans serif")
      .text(function(d) 
            {return d.data.did; });

    // Text when adding nodes 
  nodeEnter.append('text')
      .attr("class", "textchild")
      .attr("x", 10).attr("dy", ".35em")
      .attr("font-size", 9)
      .text(function(d) 
            {if (d._children == null) {return  ""}
             else if (d._children != null) {return  count_leaves(d) }
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
            {return d._children ? "rgb(70, 150, 180)" : "#fff";}
         else if (d3.select(this).style("fill") == "rgb(255, 255, 255)" )
            {return d._children ? "rgb(70, 150, 180)" : "#fff";}
         else  {return d3.select(this).style("fill");}
        }
      )
    .style('stroke-width', 1.5)
    .attr('fill-opacity', 0.9)
    .attr('cursor', 'pointer')
    .style("stroke", function(d) {
        return d3.select(this).style("stroke")}
      );
   // Text when adding nodes 
  nodeUpdate.select('.textchild')
      .text(function(d) 
            {if (d._children == null) {return  ""}
             else if (d._children != null) {return  count_leaves(d) }
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
	if (document.getElementById("Json_CLONES").checked == false)
		{
    root.children.forEach(collapse);
    collapse(root);
		update(root);
		}
	}
    
function resetAll(){
	if (document.getElementById("Json_CLONES").checked == false)
		{
		expand(root); 
    root.children.forEach(collapse);
//    collapse(root);
    update(root);
		}
	}

//###################################################################################
//#############FUNCTIONS TO HIGHLIGHT ALL DAUGHTERS OF A GIVEN NODE##################
//###################################################################################
var count; var Tcount; var orig_col; var orig_stroke;
var sel_ids;
function count_leaves2(d,n){
		sel_ids=[];
    orig_col =d3.selectAll("#area1").selectAll("g").select("#"+d.data.did)
            .select("circle").style("fill");
    orig_stroke =d3.selectAll("#area1").selectAll("g").select("#"+d.data.did)
            .select("circle").style("stroke");
//    console.log("my orig col is " + orig_col);
    count = 0;
    if(d.children){   //go through all its children
        for(var ii = 0; ii<d.children.length; ii++){
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[ii].children){
                count_subleaves2(d.children[ii],n);
                }
            else if (d.children[ii]._children){
                count_subleaves2h(d.children[ii],n);
                } 
            //if not then it is a leaf so we count it
            else{
                count++;
                var xx = d.children[ii].data.did;
								sel_ids.push(xx);
                }
            }
        }
    if(d._children){   //go through all its children
        for(var ii = 0; ii<d._children.length; ii++){
            //expand(d._children[ii])
            if (d._children[ii]._children){
                count_subleaves2h(d._children[ii],n);
                //console.log(d._children[ii])
                }
            else if (d._children[ii].children){
                count_subleaves2(d._children[ii],n);
                //console.log(d._children[ii])
                }
            //if not then it is a leaf so we count it
            else{count++;
                var xx = d._children[ii].data.did;
								sel_ids.push(xx);
                }
            }
        }
    else {//count++;
         var xx = "#"+d.data.did;
          d3.selectAll("#area2").select(xx)
            .attr('opacity', 10).attr('fill-opacity', 1).attr("fill", "blue");
          d3.selectAll("#area2").select(xx).attr("r", my_rad);
  //          console.log(xx)
					}
 //   d.children.forEach(collapse);
    count2=count; count=0;
    Tcount = Tcount+count2;
    //return(count2);
	//	console.log(count2, orig_col,n);
		// pts is array with point number to be changed
		var pts = getPoints(sel_ids);
		// change colour of the 3Dcell 
		function newcol() {
			if (d3.select("#Cells_checkbox").property("checked") && n>0 )
				{return colorScale(n)}
			else if (orig_col == "rgb(255, 255, 255)") {return "rgb(70, 150, 180)"}
			else {return n <= 0 ? orig_col : colorScale(n)}
			};
	// change stroke colour of the 3Dcell
		function newstrokecol() {
			if (d3.select("#Cells_checkbox").property("checked") && n>0)
				{return colorScale(n)}
			else if (d3.select("#Cells_checkbox").property("checked")==false)
				{return orig_stroke}
			};
		setColours(pts, newcol() );
		setStroke(pts, newstrokecol() );
		// return number of descendants cells
		return(count2);
    }        
function count_subleaves2(d,n){;
        for(var jj = 0; jj<d.children.length; jj++){
                var xx = d.children[jj].data.did;
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[jj].children){
                count_subleaves2(d.children[jj],n);
                }
            else if (d.children[jj]._children){
                count_subleaves2h(d.children[jj],n);
                }
            //if not then it is a leaf so we count it
            else{count++;
								sel_ids.push(xx);
               //  console.log(count + " " + xx)
                }
            }
    }
function count_subleaves2h(d,n){;
        for(var jj = 0; jj<d._children.length; jj++){
               var xx = d._children[jj].data.did;
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d._children[jj]._children){
                count_subleaves2h(d._children[jj],n);
                }
            else if (d._children[jj].children){
                count_subleaves2(d._children[jj],n);
                }
            //if not then it is a leaf so we count it
            else{count++;
								sel_ids.push(xx);
              //   console.log(count + " " + xx)
                }
            }
    }

//#############FUNCTIONS TO COUNT ONLY ALL DAUGHTERS OF A GIVEN NODE##################
//###################################################################################
var count;
function count_leaves(d){
    count = 0;
    if(d.children){   //go through all its children
        for(var ii = 0; ii<d.children.length; ii++){
            //expand(d.children[ii])

            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[ii].children){
                count_subleaves(d.children[ii]);
                }
            else if (d.children[ii]._children){
                count_subleavesh(d.children[ii]);
                } 
            //if not then it is a leaf so we count it
            else{
                count++;
                  //     console.log(count + " " + xx)
                }
            }
        }
    if(d._children){   //go through all its children
        for(var ii = 0; ii<d._children.length; ii++){
            //expand(d._children[ii])
            if (d._children[ii]._children){
                count_subleavesh(d._children[ii]);
                //console.log(d._children[ii])
                }
            else if (d._children[ii].children){
                count_subleaves(d._children[ii]);
                //console.log(d._children[ii])
                }

            //if not then it is a leaf so we count it
            else{count++;
                }
            }
        }
 //   d.children.forEach(collapse);
    count2=count; count=0;
    return(count2);
    }        
function count_subleaves(d){;
        for(var jj = 0; jj<d.children.length; jj++){
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d.children[jj].children){
                count_subleaves(d.children[jj]);
                }
            else if (d.children[jj]._children){
                count_subleavesh(d.children[jj]);
                }
            //if not then it is a leaf so we count it
            else{count++;
                 //console.log(count + " " + xx)
                }
            }
    }
function count_subleavesh(d){;
        for(var jj = 0; jj<d._children.length; jj++){
            //if the current child in the for loop has children of its own
            //call recurse again on it to decend the whole tree
            if (d._children[jj]._children){
                count_subleavesh(d._children[jj]);
                }
            else if (d._children[jj].children){
                count_subleaves(d._children[jj]);
                }
            //if not then it is a leaf so we count it
            else{count++;
//                 console.log(count + " " + xx)
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

// initialise the menu
var dropdownButton = d3.select("#controls_1").append('select')
var dropMenu = ["Saved clones "]
var options = 0;
// add the options to the button
var update_dropMenu = function() {
dropdownButton // Add a button
  .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
 	.data(dropMenu)
  .enter()
	.append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button
}

// When the button is changed, run the updateChart function
dropdownButton.on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    var res = selectedOption.split(" ");
    ci = res[1];
    
    
    var xxx = d3.selectAll("#area1").selectAll("g")
            .select("circle").data()
            .filter(function(d) {return d.data.did == res[1]});
    
    d3.selectAll("#area1").select("#"+xxx[0].data.did).select("circle")
        .style("fill", color(ci))
        .attr('fill-opacity', 0.9)
        .style('stroke-width', 1.5)
        .style("stroke", color(ci));
    
    count_leaves2(xxx[0],-1);
    
    console.log(selectedOption);
})

update_dropMenu();

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
    console.log(depths);
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
    console.log(depths);
}
function reset_node_cols() {
    d3.selectAll("#area1")
        .selectAll('circle.node')
//    .attr('r', 4.5)
        .attr('r', function(d) {
                return (6- (d.depth/2)) })
        .style("fill", function(d) {
            return d._children ? "rgb(70, 150, 180)" : "#fff";})
        .style('stroke-width', 1.5)
        .attr('fill-opacity', 0.9)
        .attr('cursor', 'pointer')
        .style("stroke", "blue");
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
    console.log(bralen);
}

var max_BL;
function set_bl(){
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
	if (Abs_BL == 0)
		{
		nodes.forEach(function(d) 
			{
			if (d.parent !==null) 
				{d.blength = (d.data.length + d.parent.blength);
				if (max_BL < d.blength) {max_BL = d.blength} 
				}
			})
		}
	console.log("my MAX BL is " + max_BL);
	nodelen2 =600/max_BL;
	console.log(nodelen2)
	}


function show_bl(){
	if (document.getElementById("Json_CLONES").checked == false)
		{
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
		}
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
			.select("circle").style("fill", "red")
			// paint all descendants
			.each(function(d)
			{
			//count_leaves(d);
			selections = d.descendants().map(d => d.data.did)
			for(var jj = 0; jj<selections.length; jj++)
				{
				console.log("daughters "+selections[jj])
				d3.selectAll("#area1").selectAll("#"+selections[jj])
					.select("circle").style("fill", "red")
				var xx = "#"+selections[jj];
				d3.selectAll("#area2").select(xx)
					.attr('opacity', 10).attr('fill-opacity', 1).attr("fill", "purple");
				d3.selectAll("#area2").select(xx).attr("r", my_rad);
				}
			})
		})
	}

