/* JAVASCRIPT CODE GOES HERE */

// DEFINE GLOBAL VARIABLES TO USE FOR THE 3D OBJECT
var data =[];
var my_cell_rad;
var my_cell_stroke_width;
var my_rad= 5;
var pts = [];
// get the dic where the plot is going to be added to
var plotly_scatter_div = document.getElementById("area2");

// Config value for parsing CSV
var csv_config={header: true,
	skipEmptyLines: true,
	complete: function(results, file) {
		console.log("Parsing complete:", results, file);
		}
	}

function activate_3D_controls() {
	document.getElementById("reset").disabled = false;
	document.getElementById("CellSize").disabled = false;
	document.getElementById("CellStroke").disabled = false;
	document.getElementById("Cells_checkbox").checked = false
	//	document.getElementById("Cells_checkbox").disabled = false;
		//ENABLE  tree options if tree is loaded yet
	var tree_format = $("input[name='Tree_INPUT']:checked").val();
	if (tree_format=="json" || "newick")
		{document.getElementById("Cells_checkbox").disabled = false;}
	if (tree_format=="clones")
		{document.getElementById("Cells_checkbox").disabled = true;}
	}

var cell_check_button = document.querySelector("input[id=Cells_checkbox");
cell_check_button.addEventListener( 'change', function() {
	// if select the option of "show lineage" display warning
	if (document.getElementById("Cells_checkbox").checked == true)
		{
		d3.select("#HM_scale").selectAll("svg").remove();
		showAlert("This option requires the lineage to be completely expanded. Expanding the tree now.");
		Nested_rels_HMscale(max_H);
		d3.select("#HM_scale").attr("title", "The colour bar represents the degree of lineage relationships between a pair of cells. To visualise how every cell is related to a selected cell, click on any cell in the 3D viewer");
		d3.select("#HM_scale").select("h5").text("Lineage relationships");
		// expand all cells
		collapseAll();
		setTimeout(function(){ expandAll(); }, 1000);
		}
	else if (document.getElementById("Cells_checkbox").checked == false)
		{
		d3.select("#HM_scale").selectAll("svg").remove();
		d3.select("#HM_scale").select("h5").text("");
		}
	reset_node_cols();
	reset_cell_cols();
	});

// Initialise the layout of the viz
var layout = {
	showlegend: true,
	legend: {
		x: 1,
		xanchor: "right",
		y: 1,
		bgcolor: "rgb(200, 200, 235)",
		bordercolor: '#FFFFFF',
		borderwidth: 2
		},
	margin: {l: 0,r: 0,b: 0,t: 0},
	scene: {camera: { eye: {x:0.1, y:0.1, z:2}},
		aspectmode: "data",
		bgcolor: "rgb(255,255,255)",
		xaxis: {
			backgroundcolor: "rgb(235, 200, 200)",
			gridcolor: "rgb(255, 255, 255)",
			showbackground: true,
			zerolinecolor: "rgb(255, 255, 255)",
			autorange: true,
			showgrid: true,
			zeroline: false,
			showline: false,
			autotick: true,
			ticks: '',
			showticklabels: false}, 
		yaxis: {
			backgroundcolor: "rgb(200, 235,200)",
			gridcolor: "rgb(255, 255, 255)",
			showbackground: true,
			zerolinecolor: "rgb(255, 255, 255)",
			autorange: true,
			showgrid: true,
			zeroline: false,
			showline: false,
			autotick: true,
			ticks: '',
			showticklabels: false}, 
		zaxis: {
			backgroundcolor: "rgb(200, 200,235)",
			gridcolor: "rgb(255, 255, 255)",
			showbackground: true,
			zerolinecolor: "rgb(255, 255, 255)",
			autorange: true,
			showgrid: true,
			zeroline: false,
			showline: false,
			autotick: true,
			ticks: '',
			showticklabels: false}
	},
	dragmode: "orbit"
};

var config = {
 	toImageButtonOptions: {
		format: "png", // one of png, svg, jpeg, webp
		filename: 'cell_lineage',
		height: 600,
		width: 900,
		scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
		},
	responsive: true,
	displayModeBar:false ,
	displaylogo: false
//	modeBarButtonsToRemove: ['tableRotation']
	};

function Save3DPNG () {
	Plotly.downloadImage(plotly_scatter_div, config.toImageButtonOptions);
	}

var show_axes_button = document.querySelector("input[id=Show_grid");
show_axes_button.addEventListener( 'change', function() {
	// if select the option of "show lineage" display warning
	if (document.getElementById("Show_grid").checked == true)
		{
		layout.scene.xaxis.showbackground = true;
		layout.scene.yaxis.showbackground = true;
		layout.scene.zaxis.showbackground = true;
		Plotly.update("area2",data,layout,0)
		}
	else if (document.getElementById("Show_grid").checked == false)
		{
		layout.scene.xaxis.showbackground = false;
		layout.scene.yaxis.showbackground = false;
		layout.scene.zaxis.showbackground = false;
		Plotly.update("area2",data,layout,0);
		}
	});


var my_view;
var Npoints;   // Number of cells
var ID_array;
var points_array;
//var plotly_scatter_div; // html div with the 3d obect

// MAIN FUNCTION

// handle upload button
var header;
var missing;
var missing_3D=[];

function containsAll(needles, haystack){
	missing=[];
	for(var i = 0 , len = needles.length; i < len; i++)
		{
		if($.inArray(needles[i], haystack) == -1) 
			{missing.push(needles[i]);
			//return false;
			}
		}
	if (missing.length == 0) 
		{return true;
		}else{return false}
	}

function Coords_upload_button(el, callback) {
  var uploader = document.getElementById(el);  
  var reader = new FileReader();
  console.log(uploader);

  reader.onload = function(e) {
		var contents = e.target.result;
		var parse_results = Papa.parse(contents, csv_config);
		header = parse_results.meta.fields;
		// check if the header has the columns with proper names.
		// if not, throw an error
		if (containsAll(["X","Y","Z","cell"],header))
			{
			console.log("columns are named properly");
			// IF COLUMNS FOUND, PROCEED READING THE FILE
			if (typeof root == 'undefined') {
				// Here I call load_dataset2() !!!!!!
				// --------------------------------------
				callback(contents,0);
			//	alert("[Warning]\n"+
				showAlert("[Warning] "+
								"The lineage tree has not been loaded.\n"+
							"The lineage needs to be loaded to cross-check IDs.");
				} else {
				// --- test if cell IDs are in the lineage tree //
				count_leaves2(root);
				// Here I call load_dataset2() !!!!!!
				// --------------------------------------
				callback(contents,1);
				}
			} else {
			console.log("names are not named properly");
			// IF COLUMS ARE NOT FOUND THROW AN ERROR
			showAlert("[CSV format error]\n" +
			"Header columns need to be \"X\",\"Y\",\"Z\" and \"cell\".");
		}
	};

  uploader.addEventListener("change", handleFiles, false);  

  function handleFiles() {
    //d3.select("#area2").text("loading...");
    var file = this.files[0];
    reader.readAsText(file);
    console.log(file);
		// print the name of the file on the box
		var str = $("input[name=coordsfile]").val()
		var res = str.split("\\");
		console.log("I should see the file name" +str);
		$("label[for=3Dcoord_uploader]").text(res[res.length-1]);
  };
};

var LAST_CLICK = null;

var trace1=[];
var trace2=[];

// load dataset and create plot
function load_dataset_2(csv,tree) {
	missing_3D = [];
	var data_3d = d3.csvParse(csv);
	console.log(data_3d);
	// If tree is loaded, check for IDs and missing cells
	if (tree == 1) {
		id_t=[];
		// load everything to data_3d
		data_3d.forEach(function(d) {id_t.push(d.cell)})
		if (containsAll(id_t,sel_ids))
			{console.log("all cell IDs found");
			} else {
			missing_3D = missing;
			showAlert("[Warning] " + missing.length + " of " + id_t.length + 
				" cell IDs were not found in the lineage tree\n"+
				"(e.g. \"" + missing[1] + "\")");
			}
		}
	x_t=[]; y_t=[]; z_t=[]; id_t=[];
	x_t2=[]; y_t2=[]; z_t2=[]; id_t2=[];

	line_col=[]; cell_col=[]; c_size=[];cell_alpha=[];
	line_col2=[]; cell_col2=[]; c_size2=[];cell_alpha2=[];

	points_array=[];points_array2=[];
	var i=0;
	var j=0;
	console.log("missing are " + missing_3D.length);

	// load everything to data_3d
	data_3d.forEach(function(d)
		{
		 if ( containsAll([d.cell],missing_3D) )
			{
			x_t2.push(d.X);
			y_t2.push(d.Y);
			z_t2.push(d.Z);
			id_t2.push(d.cell);
			cell_col2.push("rgba(255,255,255,0)");
			line_col2.push("rgba(0,0,255,1)");
			cell_alpha2.push(1)
			c_size2.push(9);
			points_array2.push(j);
			j=j+1;
			} else {
			x_t.push(d.X);
			y_t.push(d.Y);
			z_t.push(d.Z);
			id_t.push(d.cell);
			cell_col.push("rgb(255,255,255)");
			line_col.push("rgb(0,0,255)");
			cell_alpha.push(1)
			c_size.push(9);
			points_array.push(i);
			i=i+1;
			}
		});
	// put all the points in trace 1 except the missing cells
	trace1 = {
			x: x_t,
			y: y_t,
			z: z_t,
			id: id_t,
			name: 'Cells in tree',
			showlegend: false,
			mode: "markers",
			marker: {
				color: cell_col,
				size: c_size,
				line: {
					color: line_col,
					width: 1},
				opacity:1 
				},
			text: id_t,
			hoverinfo:"text",
			type: "scatter3d"
		};
	// now the missing cells
	trace2 = {
			x: x_t2,
			y: y_t2,
			z: z_t2,
			id: id_t2,
			name: 'Cells missing in tree',
			showlegend: true,
			mode: "markers",
			marker: {
				color: cell_col2,
				size: c_size2,
				line: {
					color: line_col2,
					width: 1},
				opacity:1 
				},
			text: id_t2,
			hoverinfo:"text",
			type: "scatter3d"
		};
	Npoints = x_t.length; // set global var of number of points
	ID_array= id_t;
	data = [trace1,trace2];
	// to make the plot responsive to size changes
	Plotly.newPlot("area2", data, layout, config)	;
	// Display the clones to be shown at the top
	d3.select('.status')
		.text('Click on a cell     ');
	// enable 3d options when 3d cells are loaded 
	activate_3D_controls() 

	// FUNCTION THAT DEFINE BEHAVIOUR WHEN CLICKING ON CELLS
	plotly_scatter_div.on("plotly_click", function(dd) {
		var CLICK_TIME = now();
		if (LAST_CLICK == null) {LAST_CLICK = CLICK_TIME - 2000}
		if (CLICK_TIME - LAST_CLICK > 1000) {
			if (d3.select("#Cells_checkbox").property("checked")==false)
				{
				if (dd.points[0].curveNumber == 0)
					{
					LAST_CLICK=CLICK_TIME;
					var id_txt = "\"id\"" 
					console.log(dd);
					// get the id of point clicked
					var pn = dd.points[0].pointNumber;
					var yy = data[0]["id"][pn];
					// trick to avoid bug feature, where after clicking we get stuck
					// on an infinite loop
					setTimeout(function(x) {
						click2(yy);
						setColours([pn], "rgb(255,0,0)");
						setStroke([pn],"rgb(0,0,139)");
						console.log(pn)
						},130);
					}
				else {showAlert("Cell clicked is not in lineage tree.") } 
				}
			if (d3.select("#Cells_checkbox").property("checked"))
				{
				if (dd.points[0].curveNumber == 0)
					{
					LAST_CLICK=CLICK_TIME;
					var pn = dd.points[0].pointNumber;
					var yy = data[0]["id"][pn];
					setTimeout(function(x) {
						show_anc_cols(yy);
						console.log("called function");
						},130);
					}
				else {showAlert("Cell clicked is not in lineage tree.") }
				}
			} else {
			LAST_CLICK = CLICK_TIME
			}
		});

	}

function now() {
	return (new Date()).getTime()
	}
// FUNCTION TO SET PROPERTIES  OF CELLS BASED ON THEIR INDICES. 
// This is to be used interactively with the cell lineage tree, 
// For example when clicking/hovering on any given node of the tree.
// It takes the indices as an array and the colour as a string val

function setColours(points,new_colour) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	points.forEach(function(d) 
		{data[0]["marker"]["color"][d] = new_colour;
		//console.log("Clicked = " + data[0]["id"][d]);
		});
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

function setRndColours(points, rnd_cols) {
	//console.log(points, rnd_cols)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	i = 0; 
	points.forEach(function(d,i) 
		{
		data[0]["marker"]["color"][d] = rnd_cols[i];
		//console.log("Clicked = " + data[0]["id"][d]);
		i++;
		});
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

function setSizes(new_size) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	points_array.forEach(function(d) 
		{data[0]["marker"]["size"][d] = new_size;
		//console.log("Clicked = " + data[0]["id"][d]);
		});
	points_array2.forEach(function(d) 
		{data[1]["marker"]["size"][d] = new_size;
		//console.log("Clicked = " + data[0]["id"][d]);
		});


	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

function setStroke(points,new_colour) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	points.forEach(function(d) 
		{data[0]["marker"]["line"]["color"][d] = new_colour;
		//console.log("Clicked to change stroke = " + data[0]["id"][d]);
		});
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};


function setAlpha(points,new_alpha) {
//	console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	// define a regex to search for the first 3 channels
	var myRe = /\d+/g;
	points.forEach(function(d) 
		{
		if (d>=0)
			{
			var x = data[0]["marker"]["color"][d];
			var y = x.match(myRe);
			x = "rgba("+ y[0]+ "," + y[1]+ ","  + y[2]+ "," + new_alpha + ")" ;
			//x = x.slice(0,-1).concat(", 0.5)");
			data[0]["marker"]["color"][d] = x;
			//console.log("Clicked to change alpha = " + data[0]["id"][d] + x);
			}	
		});
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};
function setAlphaStroke(points,new_alpha) {
	//console.log(points)
	// define a regex to search for the first 3 channels
	var myRe = /\d+/g;
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// For each point change the colour value for layout
	points.forEach(function(d) 
		{
		if (d>=0)
			{
			var x = data[0]["marker"]["line"]["color"][d];
			x = x.match(myRe);
			x = "rgba("+ x[0]+ "," + x[1]+ ","  + x[2]+ "," + new_alpha + ")" ;
			//x = x.slice(0,-1).concat(", 0.5)");
			data[0]["marker"]["line"]["color"][d] = x;
			//console.log("Clicked to change alpha = " + data[0]["id"][d] + x);
			}
		});
	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

function setStrokeWidth(new_width) {
	//console.log(points)
	// get current value of camera, so it can be set again
	myview = plotly_scatter_div.layout.scene.camera;
	// get current colour of cells to be set again
//	var my_cells_cols = data[0]["marker"]["line"]["color"];
	data[0]["marker"]["line"]["width"] = new_width;
	data[1]["marker"]["line"]["width"] = new_width;

	// Update plot based on the new values
	Plotly.update("area2", data, myview,0);
	};

// ----------------- Interactions

d3.select("#reset").on("click", function() {
	console.log("CLICKED ON RESET");
	reset_cell_cols(); reset_node_cols();
});

function reset_cell_cols() {
	setColours(points_array, "rgb(255,255,255)");
	setStroke(points_array, "rgb(0,0,255)");
	if (data_meta !== 'undefined')
		{
		// select all the rows of the table and extract the data
		var mytypes = d3.select(".viewport").select("svg")
			.selectAll("g.row").selectAll("rect");
		mytypes._groups.forEach(function(dd)
			{
			dd[0].attributes.clicked.value = 0;
			})
		}
	}

// Add an event listener to the button created in the html part
d3.select("#CellSize").on("input", changeSize );
// A function that update the color circle
function changeSize() {
    my_cell_rad = this.value;
    setSizes(my_cell_rad); 
}
// Add an event listener to the button created in the html part
d3.select("#CellStroke").on("input", changeStrokeWidth );
// A function that update the color circle
function changeStrokeWidth() {
	my_cell_stroke_width = this.value;
	setStrokeWidth(my_cell_stroke_width)
	console.log("I should see this " + my_cell_stroke_width);
	};



function click2(d) {
    var yy = "#"+d;
    d3.selectAll("#area1").select(yy).select("circle")
        .style("stroke", "rgb(255,0,255)")
        .style("stroke-width", 5).attr("r",my_rad+1);
    show_anc(yy);
		// if clones option selected, get all the sisters when clicking
		var tree_format = $("input[name='Tree_INPUT']:checked").val();
		if (tree_format=="clones") {
			root.leaves().forEach(function(dd,i) 
				{if (dd.data.did == d) 
					{//console.log(dd,i);
					pts = [];sel_ids=[];rnd_cols=[];
					var mycol = randomColour();
					var x = root.leaves()[i].parent.descendants();
					// display the clone index
					var inode = root.leaves()[i].parent.data.did;
					console.log(inode);
					for(var ii = 0 ; ii < root.children.length; ii++) 
						{if (root.children[ii].data.did == inode)
							{console.log("clicked on clone " + ii)
								d3.select('.status')
									.text('Cell clicked belongs to clone ' + ii);
							}
						}

					x.forEach(function(ddd) {
						sel_ids.push(ddd.data.did);
						rnd_cols.push(mycol);
						})
					pts=getPoints(sel_ids);
					setRndColours(pts, rnd_cols)
					}
				})
			}
    }

function show_anc(d) {
	console.log("I have clicked in cell "+ d)
	d3.selectAll("#area1").select("g").select(d)
	.each(function(d) 
		{
		selections = d.ancestors().map(d => d.data.did)
		console.log("Parents are " + selections)
		for(var jj = 0; jj<selections.length; jj++)
			{
			//console.log("This should be a loop"+jj)
			d3.selectAll("#area1").selectAll("#"+selections[jj])
				.select("circle").style("fill", "rgb(255,0,0)").attr("r",my_rad);
			}
		})
	}
function show_anc_cols(d) {
	var parent_level = 0;
	d3.selectAll("#area1").select("g").select("#"+d)
		.each(function(d) 
		{
		selections = d.ancestors().map(d => d.data.did);
		selections_rev = selections.reverse();
		console.log(selections_rev)
		var norm_cols = (max_H/selections.length) * 0.7; // to have a normalised scale of cols
		reset_node_cols();	
		for(var jj = 0; jj<selections.length; jj++)
			{var nj = jj + 1; // to call the colour variable                 
			// select the node to paint its children
			var node_j = xxx = d3.selectAll("#area1").selectAll("g")
				.select("circle").data()
				.filter(function(d) 
					{return d.data.did == selections[jj]});
			// call the function to paint cells from diff levels of relationship
			var mycol =  (max_H*0.3) + (nj*norm_cols);
			paint_daughters_HM(node_j[0],mycol);
			console.log("This should be a loop"+jj,node_j[0], mycol) 
			d3.selectAll("#area1").selectAll("#"+selections[jj])
				.select("circle")
				.style("fill", colorScale(mycol))
				.style("stroke", colorScale(mycol))
				.attr('opacity', 10).attr('fill-opacity', 1).attr("r",my_rad + 2 );
			// select the nested clone from an ancestor
			var nested_clone;
			nested_clone = node_j[0].descendants();
			console.log(nested_clone);
			nested_clone.forEach(function(d) 
				{
				d3.selectAll("#area1").selectAll("#"+d.data.did)
					.select("circle")
					.style("fill", colorScale(mycol))
					.style("stroke", colorScale(mycol))
					.attr('opacity', 10).attr('fill-opacity', 1);
				//	.attr("r",my_rad);
				})
			}
		})
	}

/*
function checkID(id) {
	const idx = ID_array.findIndex(x => x === id);
	return idx;
	}
*/
function getPoints(ids) {
	pts = [];
	ids.forEach(function(d)
		{
		var xx = ID_array.findIndex(x => x === d);
		if (xx >=0) {pts.push(xx)};
		});
	console.log("daughters are " + ids.length  +  " .Number of points is tree " + pts.length)
	return pts;
	}

