
function my_slider_2()
	{
	var slider = d3.select("#slider")
		.classed("svg-container-slider", true); //container class to make it responsive

	var slider_svg = slider.append("svg")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 100 8")
		.classed("svg-content-responsive-nospace", true);

	//Circle Data Set
	var lineData = [
		{ "cx": 0, "color" : "black" },
		{ "cx": 20, "color" : "black" },
		{ "cx": 40, "color" : "black" },
		{ "cx": 60, "color" : "black" },
		{ "cx": 80, "color" : "black" },
		{ "cx": 100,"color" : "black" }];
	
	var lines = slider_svg.selectAll("line")
		.data(lineData)
		.enter()
		.append("line");

//Add the lines attributes
	var lineAttributes = lines
		.attr("x1", function (d) { return (d.cx*0.96) + (2); })
		.attr("x2", function (d) { return (d.cx*0.96) + (2); })
		.attr("y1", 0)
		.attr("y2", 2)
		.attr("stroke-width", 0.1)
		.attr("stroke", "black");

	//Add the SVG Text Element to the svgContainer
	var text = slider_svg.selectAll("text")
		.data(lineData)
		.enter()
		.append("text");
	//Add SVG Text Element Attributes
	var textLabels = text
		.attr("x", function(d) { return (d.cx*0.95); })
		.attr("y", 6)
		.text( function (d) { return  d.cx  })
		.attr("font-family", "sans-serif")
		.attr("font-size", "2px")
		.attr("fill", "black");

	/// Add the slider at the top of everything else
	slider.append("input")
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("viewBox", "0 0 100 4")
		.classed("svg-content-responsive-nospace", true)
		.attr("type", "range")
		.attr("min", 0)
		.attr("max", 100)
		.attr("step",5)
		.attr("id", "time")
		.attr("value", 0)
		.on("input", slided);
}


function my_slider() 
	{
	var slider_menu = [
		{title: 'Collapse all cells',
		action: function(d, i) {depth_collapse(d)}
		},
    {title: 'Expand all cells',
    action: function(d, i) {depth_expanse(d)}
		},
    {title: 'Show clones from this depth',
    action: function(d,i) 
			{console.log("I have clicked in level "+ d)
			Tcount = 0;
			depth_mark(d);
			update(d) 
	//		console.log("Total cells "+ Tcount)
			}
		},
		{title: 'Delete nodes with fewer than N descendants',
    action: function(d, i) {
			var n = parseInt(prompt("Please enter an integer number ", ""));
			depth_delete_node(d,n);
			update(root);
			}
		},
	{title: 'Show label until this depth',
		action: function(d,i) 
			{console.log("I have clicked in level "+ d)
			depth_label = d;
			click(root);
			setTimeout(function(){ click(root); }, 1100);
			console.log("I should see the labels until " + d);
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
			.attr("id",  function(d) {return "depth_" + d})
			.attr('class', 'node')
			.attr('cursor', 'pointer')
			.attr("transform", function(d) {return "translate(" + (x(d)+5) + "," + 2 + ")"; })
			.on("mouseover.t", function(d) {show_depth(d)})
			.on("mouseout.t", function(d) {show_depth2(d)})
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
		console.log("Collapse all from depth " + d);
    // get all the nodes (opened) and get their height
    var xxx = d3.selectAll("#area1").select("svg")
        .selectAll("g")
        .select("circle").data()
        .filter(function(dd) {return dd.depth == d});
    var yyy = [];
    xxx.filter(function(dd) {yyy.push(dd.data.did)});
    var depths2 = yyy.filter( onlyUnique );
    // console.log(depths2)
    depths2.forEach(function(d,i) 
        {
        ci = i;
        var D = d;// console.log(D);
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d)
                  {collapse(d);
      //            console.log("clicked in ith element :",ci)
			            });

        });
     update(root);
 }
function depth_expanse(d){
		console.log("Expand all from depth " + d);
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
        var D = d;// console.log(D);
        var nn = d3.selectAll("#area1")
            .select("#"+D)
            .each(function(d)
                  {expand(d);
                 // console.log("clicked in ith element :",ci)
								  });

        });
     update(root);
 }

function show_depth(d){
//	console.log(d);
	// get all the nodes (opened) and get their height
	var xxx = d3.selectAll("#area1").select("svg")
		.selectAll("g")
		.select("circle").data()
		.filter(function(dd) {return dd.depth == d});
	var yyy = [];
	xxx.filter(function(dd) {yyy.push(dd.data.did)});
	var depths2 = yyy.filter( onlyUnique );
//	console.log(yyy.length)
	if (yyy.length >0) 
		{d3.select("#slider").select("#depth_" + d ).select("circle").attr("r",1.7);}
	depths2.forEach(function(d,i) 
		{
		ci = i;
		var D = d;// console.log(D);
		var nn = d3.selectAll("#area1").select("#"+D).select("circle").attr("r");
		d3.selectAll("#area1").select("#"+D).select("circle").attr("r", nn * 1.5);
	//	console.log("clicked in ith element :",d, ci)
		});
	}
function show_depth2(d){
	// get all the nodes (opened) and get their height
	var xxx = d3.selectAll("#area1").select("svg")
		.selectAll("g")
		.select("circle").data()
		.filter(function(dd) {return dd.depth == d});
	var yyy = [];
	xxx.filter(function(dd) {yyy.push(dd.data.did)});
	var depths2 = yyy.filter( onlyUnique );
	//console.log(depths2)
	if (yyy.length >0) 
		{d3.select("#slider").select("#depth_" + d ).select("circle").attr("r",1.2);}
	depths2.forEach(function(d,i) 
		{
		ci = i;
		var D = d;// console.log(D);
		var nn = d3.selectAll("#area1").select("#"+D).select("circle").attr("r");
		d3.selectAll("#area1").select("#"+D).select("circle").attr("r", nn / 1.5);
		//console.log("clicked in ith element :",d, ci)
		});
	}

function depth_mark(d){
	showAlert("This function only marks the 3D cells that are completely expanded in the tree");
	// get all the nodes (opened) and get their height
	var xxx = d3.selectAll("#area1").select("svg")
		.selectAll("g")
		.select("circle").data()
		.filter(function(dd) {return dd.depth == d});
		var yyy = [];
		xxx.filter(function(dd) {yyy.push(dd.data.did)});
		var depths2 = yyy.filter( onlyUnique );
		console.log(depths2);
	// first reset the colours of the tree and 3D cells
	reset_node_cols();
	reset_cell_cols()
// first assign a random colour to the parent node in the tree
	var rnd_cols=[];
	var pts=[]; 
	var Allpts=[];
	depths2.forEach(function(d)
		{
		sel_ids=[];
		var D = d;
		var result = hexToRgb(randomColour());
		var RGBcol  = "rgb("+ result.r + "," + result.g + ","  + result.b + ")" ;
		d3.selectAll("#area1").selectAll("g").select("#"+D)
			.select("circle")
			.style("fill", RGBcol)
			.attr("r", 6);
		// Get the IDs of ALL the cells of a given clon
		var clone = nodes.filter(function(d) {return d.data.did == D})
		//console.log(clone[0])
		var clone_cells = clone[0].descendants().filter(function(d) {
				if (d.node == "terminal") { sel_ids.push(d.data.did)}
			})
		pts = getPoints(sel_ids);
		pts.forEach(function() {rnd_cols.push(RGBcol)});
		Allpts.push.apply(Allpts,pts);
		});
	console.log(Allpts);
	console.log(rnd_cols);
	setRndColours(Allpts, rnd_cols);
	}

function depth_delete_node(d,n){
	showAlert("Removing nodes with fewer than " + n + 
		" (expanded) leaves in the tree" );
	var flagged_nodes = [];
	var flagged_parents = [];
	// get all the nodes (opened) and get their height
	var xxx = d3.selectAll("#area1").select("svg")
		.selectAll("g")
		.select("circle").data()
		.filter(function(dd) {return dd.depth == d});
		var yyy = [];
		xxx.filter(function(dd) {yyy.push(dd.data.did)});
		var depths2 = yyy.filter( onlyUnique );
		console.log(depths2);
	depths2.forEach(function(d)
		{
		var D = d;
		// Get the IDs of ALL the cells of a given clon
		var clone = nodes.filter(function(d) {return d.data.did == D})
		var clone_n = clone[0].leaves().length;
		//console.log(clone[0].data.did + "has "+ clone_n+ "leaves " );
		if (n > clone_n )
			{flagged_nodes.push(clone[0]);
			flagged_parents.push(clone[0].parent);
			}
		})
	//console.log(flagged_nodes);
	//console.log(flagged_parents.filter(onlyUnique) );
	var unique_parents = flagged_parents.filter(onlyUnique);
	unique_parents.forEach(function (d) {
		var new_children = [];
		var sisters = d.children;
		new_children = sisters.filter( x => !flagged_nodes.includes(x) );
		d.children = new_children;
		})
	}


var tc=0; // to store the number of clones in tim
var time_cells=[];
function slided(d) {
	var container_width =  d3.select("#area1").style('width').slice(0, -2);
	var slider_val = d3.select(this).property("value");
	var slider_scaled =( (600*0.9)*(slider_val/100));
	console.log(slider_scaled , slider_val);
	// remove the previous line
	d3.select("#area1").select("svg").selectAll("line").remove();

	// draw a line 
	var my_line = svg_tree.append("line")
		.attr("x1", slider_scaled )
		.attr("y1", 1000)
		.attr("x2", slider_scaled)
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.style("stroke-dasharray","5,5")//dashed array for line
		.attr("y2", 0);
	// PAINT ALL CELLS AT THAT LEVEL
	// then get all the cells that intersect with the dashed line
	tc = time_cells.length;
	time_cells=[];
	d3.select("#area1").selectAll("svg")
		.selectAll("path")
		.each(function (d) 
			{l_t = this.getBBox();
			if (l_t.x <= slider_scaled && l_t.x+l_t.width >= slider_scaled )
				{time_cells.push(this.__data__.parent.data.did);
				console.log(this.__data__.parent.data.did)}
			});
	if (time_cells.length == tc) {console.log("SAME NUMBER OF CLONES");return}
	// first reset the colours of the tree and 3D cells
	reset_node_cols();
	reset_cell_cols()

	// first define a random colour in the tree
	time_cells.forEach(function(d,i)
		{
		ci = i;
		var rc = randomColour();
		var D = d;
	//     console.log("looking for #"+D)
		d3.selectAll("#area1").selectAll("g").select("#"+D)
			.select("circle")
			.style("fill", rc)
			.style("fill-opacity", 0.8)
			.style("stroke", stroke_cols[parseInt(ci/10)])
			.attr("r", 6);
		});
	//then use the random colour to paint all cells
	time_cells.forEach(function(d,i)
		{
		var D = d;
		//     console.log("looking for #"+D)
		var nn = d3.selectAll("#area1")
			.select("#"+D);
		// then the 
		nn.each(function(d) {paint_daughters(d)});
		console.log("looking for "+ nn)   
		});
	}

var color  = d3.scaleOrdinal(d3.schemeCategory10);
